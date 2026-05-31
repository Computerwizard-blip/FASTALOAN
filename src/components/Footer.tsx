import { PageId } from '../types';
import { Smartphone, Globe, Shield, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageId) => void;
  onOpenAuth: () => void;
}

export default function Footer({ setCurrentPage, onOpenAuth }: FooterProps) {
  const currentYear = 2026;

  return (
    <footer id="footer-container" className="bg-slate-50 text-slate-600 pt-16 pb-12 border-t border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Segment: Brand & Direct Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-200">
          
          {/* Logo & Brief Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-xl tracking-wider">
              <div className="h-8 w-8 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
              <span>PESA<span className="text-orange-500">SWIFT</span></span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-sm leading-relaxed">
              PesaSwift is a licensed digital credit provider providing safe, accessible, and instant financial accommodations to Kenyan entrepreneurs and individuals. Manage your credit limits, calculate transparent interest rates, and disburse directly via M-Pesa.
            </p>
            
            {/* Regulatory Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                <Shield className="h-3.5 w-3.5 text-orange-500" />
                <span>CBK Registered Digital Lender</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-200 text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-bit Secure TLS Vault</span>
              </div>
            </div>
          </div>

          {/* Quick Actions / PWA Installer */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-premium">
            <div className="space-y-1">
              <h4 className="text-slate-900 font-extrabold text-sm sm:text-base uppercase tracking-wider font-sans">Apply for Instant Microcredit</h4>
              <p className="text-xs text-slate-500">Fast Safaricom STK Push repayments. 10-minute automated approvals.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              
              <button
                id="footer-gplay-btn"
                onClick={() => alert("PesaSwift Mobile app setup complete! Shortcuts added successfully.")}
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-5 py-2.5 text-left transition-all active:scale-98 cursor-pointer"
              >
                <Smartphone className="h-6 w-6 text-orange-500" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Get official App</div>
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-widest">PesaSwift App</div>
                </div>
              </button>

              <button
                id="footer-web-apply-btn"
                onClick={onOpenAuth}
                className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl px-5 py-4 transition-all active:scale-98 cursor-pointer shadow-md"
              >
                <Globe className="h-4.5 w-4.5" />
                <span>Check My Credit Score</span>
              </button>

            </div>
          </div>

        </div>

        {/* Middle Segment: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          
          <div className="space-y-4">
            <h5 className="text-slate-900 text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-l-2 border-orange-500 pl-2">Credit Services</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-orange-600 transition-colors uppercase cursor-pointer">Verify My Credit limit</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('how-it-works')} className="hover:text-orange-600 transition-colors uppercase cursor-pointer">Official Loan Terms</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('calculator')} className="hover:text-orange-600 transition-colors uppercase cursor-pointer">Interest calculator</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('faqs')} className="hover:text-orange-600 transition-colors uppercase cursor-pointer">Frequently Asked Questions</button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-slate-900 text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-l-2 border-orange-500 pl-2">Repay & Settle</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage('repay')} className="hover:text-orange-600 transition-colors uppercase cursor-pointer">M-Pesa STK Gateway</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('repay')} className="hover:text-orange-600 transition-colors uppercase cursor-pointer">Manual Paybill settlement</button>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-orange-600 transition-colors uppercase cursor-pointer">Register Safaricom Sim</button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('legal-help')} className="hover:text-orange-600 transition-colors uppercase cursor-pointer">Lending Codes & Disputes</button>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h5 className="text-slate-900 text-xs font-mono uppercase tracking-wider text-slate-400 font-bold border-l-2 border-orange-500 pl-2">Support & Authority Contacts</h5>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0 pt-0.5" />
                <span className="text-slate-600 leading-relaxed font-semibold">
                  PesaSwift Digital Credit Providers Ltd, Delta Corner Towers, Floor 4, Westlands, Nairobi, Kenya
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-orange-500" />
                <span className="text-slate-600 font-semibold">0700 123 456 (Corporate Operations Hub)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-slate-600 font-semibold">support@pesaswift.co.ke</span>
                  <span className="text-[10px] text-slate-500">Regulatory Officer: legal@pesaswift.co.ke</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Segment: Trust Disclosures */}
        <div className="pt-8 border-t border-slate-200 text-[10.5px] text-slate-500 leading-relaxed space-y-4 font-mono">
          <p>
            <strong>Responsible Borrowing Notice:</strong> Digital loan allocations carry principal and interest expectations. Defaulting or delays in settlement may lead to formal registration updates under the licensed Credit Reference Bureau (CRB) of Kenya under Central Bank guidelines. Always review interest rates and payback intervals prior to drawing overdraft liquidity.
          </p>
          <p>
            <strong>Regulatory Authority Licensing:</strong> PesaSwift is a registered and certified Digital Credit Provider (DCP-0849) compliant with Central Bank of Kenya (CBK) mobile finance digital framework guidelines. All financial communications and STK push sequences are encrypted and transmitted securely via Safaricom Daraja protocols.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-200 gap-4 text-xs font-sans">
            <span>&copy; {currentYear} PesaSwift Kenya Limited. All Registered Rights Reserved. CBK DCP #0849 Audited.</span>
            <div className="flex gap-4">
              <button onClick={() => setCurrentPage('legal-help')} className="hover:underline hover:text-orange-650">Lending Terms & Rules</button>
              <button onClick={() => setCurrentPage('legal-help')} className="hover:underline hover:text-orange-650">Data Protection Policy</button>
              <button onClick={() => setCurrentPage('how-it-works')} className="hover:underline hover:text-orange-655">Borrowing Process Details</button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
