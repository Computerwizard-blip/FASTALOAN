import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Shield, Scale, FileText, Send, HelpCircle, Landmark, MessageSquare } from 'lucide-react';

export default function HelpLegalView() {
  const [activeDoc, setActiveDoc] = useState<'contact-chat' | 'terms' | 'privacy' | 'cbk'>('contact-chat');

  // Simulated Live Support Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: "Habari! Welcome to PesaSwift Live Support. I am your 24/7 dedicated assistant. How can I help you regarding our licensed digital credit lines today?",
      time: '11:46 AM'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Send a message and get a simulated AI reply based on predefined triggers
  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const userMsgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: userMsgTime }]);
    setChatInput('');
    setChatLoading(true);

    // Dynamic support answers
    let reply = "Thank you for reaching out. A representative is looking into your inquiry and will update you via SMS / Email in under 3 minutes.";
    const lower = userMsg.toLowerCase();
    if (lower.includes('license') || lower.includes('cbk') || lower.includes('authorized')) {
      reply = "PesaSwift is fully authorized and licensed under CBK Digital Credit Providers Regulations, 2022. Our License Number is DCP/0849. You can review our full certificate under the CBK License navigation section on this page.";
    } else if (lower.includes('interest') || lower.includes('fee') || lower.includes('charge')) {
      reply = "We offer absolute pricing transparency: 5% flat interest added to your selected loan, and a 10% processing fee deducted upfront at payout point. There are zero compound interest factors or hidden roll penalties.";
    } else if (lower.includes('limit') || lower.includes('increase') || lower.includes('grow')) {
      reply = "To raise your start credit limit (from initial values toward KES 200,000), repay your loans on or before the due date exactly 3 consecutive times. High score metrics are calculated on-the-fly.";
    } else if (lower.includes('repay') || lower.includes('paybill') || lower.includes('pay')) {
      reply = "To repay, simply go to M-Pesa > Lipa na M-Pesa > Paybill. Use Business No 123456 and your active National ID Number as the Account Number.";
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'agent', text: reply, time: userMsgTime }]);
      setChatLoading(false);
    }, 1500);
  };

  return (
    <div id="help-legal-wrapper" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-200 text-slate-850">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Help, Complaints & Regulatory Compliance</h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Review our legal agreements, verify our Central Bank regulations license certificate, or escalate a grievance directly to our Westlands support division.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Selection List */}
        <div className="lg:col-span-4 space-y-3 bg-white border border-slate-200 p-5 rounded-3xl shadow-premium">
          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-400 block pb-1">COMPLIANCE PORTFOLIO</span>
          
          <button
            id="legal-tab-chat"
            onClick={() => setActiveDoc('contact-chat')}
            className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 transition-all cursor-pointer ${
              activeDoc === 'contact-chat' 
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-55 hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <MessageSquare className="h-4.5 w-4.5 shrink-0" />
            <span>24/7 Live Agent & Contacts</span>
          </button>

          <button
            id="legal-tab-terms"
            onClick={() => setActiveDoc('terms')}
            className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 transition-all cursor-pointer ${
              activeDoc === 'terms' 
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-55 hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <Scale className="h-4.5 w-4.5 shrink-0" />
            <span>Terms & Conditions Disclosure</span>
          </button>

          <button
            id="legal-tab-privacy"
            onClick={() => setActiveDoc('privacy')}
            className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 transition-all cursor-pointer ${
              activeDoc === 'privacy' 
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-55 hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <Shield className="h-4.5 w-4.5 shrink-0" />
            <span>Privacy Policy & scoring</span>
          </button>

          <button
            id="legal-tab-cbk"
            onClick={() => setActiveDoc('cbk')}
            className={`w-full text-left p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 transition-all cursor-pointer ${
              activeDoc === 'cbk' 
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-slate-55 hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <Landmark className="h-4.5 w-4.5 shrink-0" />
            <span>CBK License #DCP-0849</span>
          </button>

          {/* Core Support Contacts strip always visible in Left Panel */}
          <div className="pt-6 border-t border-slate-150 space-y-3.5 text-xs text-slate-600 leading-normal">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block leading-tight">OFFICIAL CONTACT CHANNELS</span>
            
            <div className="flex gap-2.5 items-start">
              <MapPin className="h-4.5 w-4.5 text-orange-600 shrink-0 pt-0.5" />
              <span>PesaSwift Kenya Ltd, Westlands, Floor 4, Delta Chambers, Nairobi</span>
            </div>

            <div className="flex gap-2.5 items-center">
              <Mail className="h-4 w-4 text-orange-600 shrink-0" />
              <span>help@pesaswift.co.ke</span>
            </div>

            <div className="flex gap-2.5 items-center">
              <Phone className="h-4.5 w-4.5 text-orange-600 shrink-0" />
              <span>0700 123 456 (24/7 Support)</span>
            </div>
          </div>

        </div>

        {/* Right Side Content Pane */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl shadow-premium overflow-hidden min-h-[505px] flex flex-col">
          
          {/* HEADER BAR FOR SELECTED DOC */}
          <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-150 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-mono font-bold text-slate-500">
              {activeDoc === 'contact-chat' && '24/7 Live In-app Chat Simulation'}
              {activeDoc === 'terms' && 'Lending Terms and Disclosures'}
              {activeDoc === 'privacy' && 'Data Collections & Privacy Charter'}
              {activeDoc === 'cbk' && 'Central Bank of Kenya Authorization'}
            </span>
            <span className="text-[10px] bg-orange-50 text-orange-655 font-mono font-bold px-2.5 py-0.5 border border-orange-100 rounded-full uppercase">
              Current Version 2026
            </span>
          </div>

          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            
            {/* DOCUMENT 1: LIVE CHAT AND DIRECT ASSISTAL */}
            {activeDoc === 'contact-chat' && (
              <div id="section-chat-simulation" className="space-y-6 flex-1 flex flex-col justify-between">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 text-xs border-b border-slate-100 pb-5">
                  <div className="space-y-1">
                    <strong className="block text-slate-805 font-bold">Standard Support:</strong>
                    <p>Contact 24/7 live channels anytime at <span className="text-orange-600 underline font-semibold">help@pesaswift.co.ke</span> or call <strong className="font-semibold text-slate-800">0700 123 456</strong>.</p>
                  </div>
                  <div className="space-y-1 border-l-0 md:border-l md:pl-4 border-slate-100">
                    <strong className="block text-slate-805 font-bold">Complaints Grievances:</strong>
                    <p>Have an escalate query? Reach <span className="text-orange-600 underline font-semibold">complaints@pesaswift.co.ke</span>. We resolve everything internally within 3 days.</p>
                  </div>
                  <div className="space-y-1 border-l-0 md:border-l md:pl-4 border-slate-100">
                    <strong className="block text-slate-805 font-bold">Regulatory Escalation:</strong>
                    <p>If not fully satisfied in 7 days, customers hold the legal right to escalate complaints to the CBK (Central Bank of Kenya) officers.</p>
                  </div>
                </div>

                {/* Simulated interactive chat window */}
                <div className="flex-1 flex flex-col justify-between border border-slate-205 rounded-2xl p-4 bg-slate-50/50 min-h-[280px]">
                  
                  {/* messages list */}
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col max-w-[85%] space-y-0.5 ${
                          msg.sender === 'user' ? 'ml-auto items-end animate-in slide-in-from-right-1 duration-100' : 'mr-auto items-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl text-xs ${
                            msg.sender === 'user'
                              ? 'bg-orange-600 text-white rounded-br-none'
                              : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono pl-1">{msg.time}</span>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="mr-auto">
                        <div className="bg-slate-200/70 p-3 rounded-2xl text-[10px] font-mono text-slate-400 animate-pulse uppercase">
                          Agent typing answer...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendChatMessage} className="flex gap-2 border-t border-slate-200 pt-3 mt-3">
                    <input
                      id="chat-sim-input"
                      type="text"
                      placeholder="e.g. How do I get a limit increase? / What is the Paybill?"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 text-slate-800"
                    />
                    <button
                      id="chat-send-btn"
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-555 text-white rounded-xl p-2.5 transition-colors active:scale-95 cursor-pointer shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>

                </div>

              </div>
            )}

            {/* DOCUMENT 2: TERMS AND CONDITIONS */}
            {activeDoc === 'terms' && (
              <div id="section-terms-text" className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed overflow-y-auto max-h-[420px] pr-2 font-medium">
                
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wide border-l-2 border-orange-500 pl-2">1. PesaSwift Core Loan parameters</h4>
                  <p>
                    By submitting an application for digital credit with PesaSwift Kenya Limited, the customer requests a digital credit allowance under the CBK Digital Credit Providers Regulations of 2022. All disbursed loans carry a strict flat single interest of 5% on the principal, and a flat 10% processing fee deducted up-front prior to Lipa na M-Pesa dispersal.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wide border-l-2 border-orange-500 pl-2">2. Interest rates and calculations</h4>
                  <p>
                    Unlike predatory compound-rate apps, PesaSwift interest rates do NOT escalate on a monthly basis. Interest is flat 5% total for the entire pre-selected loan cycle. If you accept a KES 20,000 credit line, the fixed interest is +KES 1,000. You repay exactly KES 21,500 if zero other adjustments are agreed. Early repayment is accepted at any point with zero penalties or charges.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase font-mono tracking-wide border-l-2 border-orange-500 pl-2">3. Credit scoring and CRB listings</h4>
                  <p>
                    We prioritize customer rehabilitation. If you fail to repay your outstanding balance after the agreed due date parameters, we afford a 30-day grace period. Late payments not communicated or structured before the due date trigger reporting listings with authorized credit bureau agencies (TransUnion, Creditinfo, Metropol credit rating bureaus) as strictly guided by Central Bank of Kenya statutes.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-xs space-y-1 text-slate-700">
                  <strong className="block text-orange-950 font-bold">Consumer Safeguard Advisory:</strong>
                  <p>PesaSwift does not impose un-communicated fees, rollover charges, compound elements, or auto-debits without explicit M-Pesa authentication flow approval.</p>
                </div>

              </div>
            )}

            {/* DOCUMENT 3: PRIVACY POLICY */}
            {activeDoc === 'privacy' && (
              <div id="section-privacy-text" className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed overflow-y-auto max-h-[420px] pr-2 font-medium">
                
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wide border-l-2 border-orange-500 pl-2">1. Encrypted Data we Collect</h4>
                  <p>
                    To calculate your instant score rating, we request permission to query your National Identity Card records and M-Pesa transaction statements for the past 6 consecutive months. We request no physical paperwork or collateral factors. All queries occur via highly encrypted, compliant fintech API gateways in absolute safety.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wide border-l-2 border-orange-500 pl-2">2. Compliance with Data Protection Acts</h4>
                  <p>
                    PesaSwift Kenya Limited operates strictly in compliance with both the Kenya Data Protection Act of 2019 and global GDPR privacy frameworks. We never, under any circumstances, sell, lease, or transmit customer contact lists, M-Pesa statement data, or ID figures to third-party marketing services or unlicensed credit providers.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wide border-l-2 border-orange-500 pl-2">3. Safety and Security Standards</h4>
                  <p>
                    All customer profile repositories, credit logs, and password details are processed inside double-walled containers secure under AES 256-bit secure sockets TLS transport shielding. Any suspicious database query raises automated lockdowns.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-xs text-orange-850">
                  <strong>Data Compliance Safeguard:</strong> You retain the absolute legal right to request complete deletion of your compiled PesaSwift credit scorer statements at any point of zero active outstanding debt.
                </div>

              </div>
            )}

            {/* DOCUMENT 4: CBK LICENSE FILE */}
            {activeDoc === 'cbk' && (
              <div id="section-cbk-certificate" className="space-y-6 flex-1 flex flex-col justify-center">
                
                {/* Visual Representation of Certificate */}
                <div className="bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 max-w-sm mx-auto text-center space-y-4 relative overflow-hidden shadow-inner">
                  
                  {/* Decorative coat-style design */}
                  <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-550"></div>

                  <div className="flex justify-center">
                    <Landmark className="h-10 w-10 text-orange-600 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h5 className="text-[10px] tracking-widest font-mono font-bold text-orange-700 uppercase block">CENTRAL BANK OF KENYA</h5>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase leading-normal">DIGITAL CREDIT PROVIDERS LICIFICATE</h4>
                  </div>

                  <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans font-medium">
                    This certifies that <strong>PesaSwift Kenya Limited</strong> is fully licensed and registered under section 59A of the Central Bank of Kenya Act (Cap. 491) to operate digital credit systems within Kenya.
                  </p>

                  <div className="border-t border-slate-200 pt-3.5 pb-1 space-y-1">
                    <div className="text-[11px] font-mono font-black text-slate-800">License ID Number: DCP-0849</div>
                    <div className="text-[9px] font-mono text-slate-400 font-bold">Effective Since: January 1, 2026</div>
                  </div>

                  <div className="text-[9.5px] text-orange-750 font-bold uppercase tracking-wider font-mono bg-orange-100 rounded-full py-1 px-4 inline-block border border-orange-200">
                    ★ Status: Legally Active & Verified ★
                  </div>

                </div>

                <p className="text-xs text-slate-500 text-center max-w-sm mx-auto leading-relaxed">
                  PesaSwift is registered under CBK regulation audits. For inquiries or escalations, verify with the official DCP licensing archives published on the CBK standard public registries.
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
