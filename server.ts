import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helper function to format phone numbers to Safaricom standard (e.g. 254712345678)
  function formatPhone(phone: string): string {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "254" + clean.substring(1);
    } else if (clean.startsWith("+")) {
      clean = clean.substring(1);
    }
    if (!clean.startsWith("254") && clean.length === 9) {
      clean = "254" + clean;
    }
    return clean;
  }

  // API Endpoint: Safaricom M-Pesa Daraja STK Push Proxy
  app.post("/api/stkpush", async (req, res) => {
    try {
      const { publicKey, secretKey, shortcode, passkey, phone, amount } = req.body;

      if (!publicKey || !secretKey || !shortcode || !passkey || !phone || !amount) {
        return res.status(400).json({
          success: false,
          error: "All parameters are required (publicKey, secretKey, shortcode, passkey, phone, amount).",
        });
      }

      const formattedPhone = formatPhone(phone);
      
      // Auto detect sandbox vs production based on standard sandbox shortcode or keys
      const isSandbox = shortcode === "174379" || publicKey.toLowerCase().includes("sandbox");
      const baseUrl = isSandbox 
        ? "https://sandbox.safaricom.co.ke" 
        : "https://api.safaricom.co.ke";

      console.log(`[M-Pesa STK] Initiating request to ${baseUrl} representing shortcode ${shortcode}`);

      // 1. Generate Sandbox/Local Auth Token
      const authHeaderName = Buffer.from(`${publicKey}:${secretKey}`).toString("base64");
      
      const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${authHeaderName}`,
        }
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        return res.status(401).json({
          success: false,
          error: `Credentials Authentication Failed: ${tokenResponse.status} ${tokenResponse.statusText}`,
          darajaResponse: errText,
        });
      }

      const tokenData = await tokenResponse.json() as { access_token: string };
      const accessToken = tokenData.access_token;

      // 2. Generate Timestamp & Password
      const now = new Date();
      // Safaricom expects EAT (UTC+3) or local consistent timestamp in YYYYMMDDHHmmss
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const timestamp = `${year}${month}${date}${hours}${minutes}${seconds}`;

      const passwordInput = `${shortcode}${passkey}${timestamp}`;
      const password = Buffer.from(passwordInput).toString("base64");

      // 3. Prepare STK Push body
      const callbackUrl = "https://mydomain.com/pathtallback"; // Safaricom requires a HTTPS callback URL, but works for simulation regardless
      const mpesaBody = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(amount)).toString(),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: "https://pesaswift-callback.free.beeceptor.com/callback",
        AccountReference: "PESASWIFT",
        TransactionDesc: "Clear outstanding borrow credit ledger",
      };

      console.log("[M-Pesa STK] Dispatching payload:", JSON.stringify(mpesaBody, null, 2));

      // 4. Request STK push
      const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mpesaBody),
      });

      const stkData = await stkResponse.json() as any;

      if (!stkResponse.ok) {
        return res.status(stkResponse.status).json({
          success: false,
          error: "Safaricom Gateway rejected the dispatch request.",
          debugPayload: mpesaBody,
          darajaResponse: stkData,
        });
      }

      return res.status(200).json({
        success: true,
        message: "STK Push triggered successfully on Safaricom handset.",
        timestamp,
        formattedPhone,
        debugPayload: mpesaBody,
        darajaResponse: stkData,
      });

    } catch (error: any) {
      console.error("[Backend Error]", error);
      return res.status(500).json({
        success: false,
        error: error.message || "An internal error occurred in the proxy server.",
      });
    }
  });

  // Vite development integration or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PesaSwift STK Engine] Server boot running on port ${PORT}`);
  });
}

startServer();
