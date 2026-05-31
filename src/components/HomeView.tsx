import { useState, useEffect } from 'react';
import { PageId, UserSession, LoanApplication } from '../types';
import { calculateLoanDetails, formatKES } from '../utils/loanUtils';
import { 
  ShieldCheck, Calculator, Landmark, Sparkles, Smartphone, Landmark as BankIcon,
  ChevronRight, ArrowRight, CheckCircle2, TrendingUp, DollarSign, Award,
  Users, Lock, Play, Activity, AlertCircle, Bookmark, Star
} from 'lucide-react';

interface HomeViewProps {
  setCurrentPage: (page: PageId) => void;
  onOpenAuth: () => void;
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  triggerSms: (message: string) => void;
  activeLoan: LoanApplication | null;
  onClearLoan: () => void;
  onApplyLoanSimulated: (amount: number, termDays: number) => void;
}

export default function HomeView({
  setCurrentPage,
  onOpenAuth,
  user,
  setUser,
  triggerSms,
  activeLoan,
  onClearLoan,
  onApplyLoanSimulated,
}: HomeViewProps) {
  // Slider states for instant borrowing
  const [borrowAmt, setBorrowAmt] = useState<number>(20000);
  const [termDays, setTermDays] = useState<number>(30);

  const calcs = calculateLoanDetails(borrowAmt, termDays);
  // Default due date override for KES 20,000 example requested
  const displayDueDate = termDays === 30 && borrowAmt === 20000 ? "15 Nov 2026" : calcs.dueDate;

  const handleApplyHome = () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    if (borrowAmt > user.loanLimit) {
      alert(
        `Selected amount (${formatKES(borrowAmt)}) exceeds your approved credit limit of ${formatKES(
          user.loanLimit
        )}. Apply within your limit constraints or repay existing credits to build limit ranking!`
      );
      return;
    }

    onApplyLoanSimulated(borrowAmt, termDays);
  };

  return (
    <div id="pesaswift-home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-24 text-slate-800 font-sans">
      
      {/* ----------------- TOP COMPLIANCE STRIP ----------------- */}
      <div className="bg-orange-50 border border-orange-200/80 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-orange-850 mb-8 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-orange-600 shrink-0" />
          <span className="font-semibold text-center sm:text-left text-slate-700">
            CBK Licensed Credit Provider. Transparent fees & zero hidden costs. Secure SSL Encryption protocol active.
          </span>
        </div>
        <button 
          onClick={() => setCurrentPage('how-it-works')}
          className="bg-orange-600 text-white font-bold hover:bg-orange-500 px-4 py-1.5 rounded-full cursor-pointer transition-all active:scale-95 text-[11px] uppercase tracking-wider shrink-0"
        >
          Disclosure Rules
        </button>
      </div>

      {/* ----------------- BENTO DASHBOARD GRID ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT COLUMN: HERO INTRO & DIRECT LOAN INPUT (7 spans) ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Logo & Headline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/50">
                PesaSwift Instant Credit
              </span>
            </div>
            <h1 className="text-3xl sm:text-4.5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Micro-Cash Loans on <span className="text-orange-600 whitespace-nowrap">M-Pesa</span>, Disbursed in Seconds.
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
              Get premium overdraft credit on demand. Choose any amount between KES 1,000 and KES 200,000 with flexible terms. Pay early or settle on time to unlock larger borrowing capacity automatically.
            </p>
          </div>

          {/* ACTIVE IN-FLIGHT LOAN CARD OR LOAN INPUT CALCULATOR */}
          {activeLoan ? (
            <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-full pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600"></div>

              <div className="flex justify-between items-center border-b border-slate-105 pb-3 mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-amber-700" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 uppercase font-sans">
                    {activeLoan.status === 'pending_approval' ? 'Loan Submitted for Approval' : 'Active Loan Outstanding'}
                  </h3>
                </div>
                {activeLoan.status === 'pending_approval' ? (
                  <span className="text-[10px] font-mono text-amber-700 bg-amber-100 border border-amber-250 px-2.5 py-0.5 rounded-full uppercase font-black animate-pulse">
                    Awaiting Verification
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full uppercase font-semibold">
                    Pending Repayment
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl text-left font-mono text-xs">
                <div>
                  <span className="text-[9px] uppercase font-mono text-slate-500 block">Loan Reference</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">{activeLoan.id}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-slate-500 block">Total Due</span>
                  <span className="text-xs font-extrabold text-orange-600 block mt-0.5">KES {activeLoan.totalRepay.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-slate-500 block">Activation Deposit</span>
                  <span className="text-xs font-bold text-slate-700 block mt-0.5">KES {activeLoan.processingFee.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-slate-500 block">Due Date</span>
                  <span className="text-xs font-bold text-red-600 block mt-0.5 font-sans">{activeLoan.dueDate}</span>
                </div>
              </div>

              {activeLoan.status === 'pending_approval' ? (
                <div className="mt-5 text-xs text-amber-850 leading-relaxed bg-amber-100/50 p-4 border border-amber-200 rounded-2xl font-sans">
                  ⏳ <b>Awaiting Activation Deposit:</b> Your M-Pesa transaction reference code <b>{activeLoan.depositTxCode}</b> has been received. Admin Frank Mwangi is verifying Receipt of KES {activeLoan.processingFee.toLocaleString()} on Lipa na Pochi <strong>0117051321</strong>. Upon confirmation, your credit limit will unlock instantly!
                </div>
              ) : (
                <div className="mt-5 text-xs text-slate-500 leading-relaxed bg-orange-50/40 p-4 border border-orange-100 rounded-xl">
                  💳 <b>Transparent Cost Disclosure:</b> A 10% processing fee of KES {activeLoan.processingFee.toLocaleString()} and 5% interest rate are integrated directly. Net disbursal received to phone was KES {activeLoan.disbursedAmount.toLocaleString()}.
                </div>
              )}

              {activeLoan.status === 'pending_approval' ? (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 text-center bg-amber-100 border border-amber-200 py-3.5 rounded-xl text-amber-900 font-extrabold text-xs uppercase tracking-wider font-sans">
                    🔄 Waiting for Frank's Approval...
                  </div>
                  <button
                    onClick={() => setCurrentPage('faqs')}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-205 font-bold px-5 py-3.5 rounded-xl transition-all text-xs"
                  >
                    Read Help Manual
                  </button>
                </div>
              ) : (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClearLoan}
                    className="flex-1 bg-orange-600 text-white hover:bg-orange-500 font-extrabold py-3.5 px-4 rounded-xl text-center transition-all cursor-pointer select-none text-xs uppercase tracking-wider shadow-md"
                  >
                    Settle Outstanding Loan via M-Pesa STK
                  </button>
                  <button
                    onClick={() => setCurrentPage('repay')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold px-5 py-3.5 rounded-xl transition-all text-xs"
                  >
                    View Payment Ledger
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* LENDING SLIDER INTERACTIVE - POLISHED LIGHT THEMING */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-premium relative overflow-hidden">
              <div className="absolute top-0 right-0 h-36 w-36 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-full pointer-events-none" />

              <h3 className="text-slate-900 text-sm sm:text-base font-bold flex items-center gap-2 border-b border-slate-100 pb-3 uppercase">
                <span className="flex items-center justify-center h-6 w-6 rounded bg-orange-50 border border-orange-200 text-orange-600 text-xs font-mono font-bold">1</span>
                <span>Configure Your Instant Overdraft</span>
              </h3>

              {/* Slider 1: Principal Amount */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <span className="font-mono text-slate-500 uppercase font-bold">Verify Desired Amount</span>
                  <span className="text-xl font-mono font-extrabold text-orange-600">
                    KES {borrowAmt.toLocaleString()}
                  </span>
                </div>

                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={borrowAmt}
                  onChange={(e) => setBorrowAmt(Number(e.target.value))}
                  className="w-full select-none h-2 bg-slate-105 border border-slate-200 rounded-lg cursor-pointer focus:outline-none accent-orange-500"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>KES 1,000</span>
                  <span>KES 100,000 Max starting limit</span>
                </div>
                
                {/* Quick amount buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[2000, 5000, 10000, 20000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setBorrowAmt(amt)}
                      className={`px-3.5 py-1.5 text-[11px] rounded-full border transition-all cursor-pointer font-bold ${
                        borrowAmt === amt
                          ? 'bg-orange-50 text-orange-655 border-orange-250'
                          : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-350'
                      }`}
                    >
                      KES {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 2: Duration Period */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                  <span className="font-mono text-slate-500 uppercase font-bold">Repayment period term</span>
                  <span className="text-xs font-bold font-mono text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                    {termDays === 30 ? '30 Days (Standard)' : `${termDays} Days`}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 30, 45].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setTermDays(d)}
                      className={`py-2.5 px-1 text-center rounded-xl border text-[10.5px] font-bold font-mono uppercase tracking-wide transition-all cursor-pointer ${
                        termDays === d
                          ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Cost Summary computation ledger */}
              <div className="bg-slate-50 p-4.5 border border-slate-200 rounded-2xl space-y-3.5 text-xs font-mono font-bold text-slate-600">
                <span className="text-[10px] uppercase block tracking-wider text-slate-400">Live Cost ledger checklist</span>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Selected Principal</span>
                  <span className="text-slate-800">KES {borrowAmt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Processing Fee (10% upfront)</span>
                  <span className="text-red-500">- KES {calcs.processingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Net Disbursed Amount</span>
                  <span className="text-emerald-600 font-extrabold text-sm font-sans">KES {calcs.disbursedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span>Repayment Interest Rate (5%)</span>
                  <span className="text-slate-800">+ KES {calcs.interest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 border-b border-slate-200 pb-1.5 pt-1 font-sans text-xs">
                  <span>Total Amount Due Repayable</span>
                  <span className="font-mono text-orange-600 font-extrabold text-sm">KES {calcs.totalRepay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-sans font-medium text-slate-550 italic">
                  <span>Estimated Repayment Due date</span>
                  <span className="text-slate-850 font-bold">{displayDueDate}</span>
                </div>
              </div>

              <button
                onClick={handleApplyHome}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl uppercase tracking-wider text-xs transition-all cursor-pointer hover:scale-[1.01] active:scale-99 block text-center shadow-md animate-pulse-slow"
              >
                {user ? `Request Instant disbursal of KES ${calcs.disbursedAmount.toLocaleString()}` : "Log In to Verify Borrowing Capacity"}
              </button>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: CREDIT PROGRESS, LIMIT STATS, PROMO BRIDGE (5 spans) ================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Box 1: CREDIT PROFILE APPROVED LIMITS STATUS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6.5 shadow-premium space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BankIcon className="h-5 w-5 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-800 uppercase">Your Credit Limit profile</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-orange-650 bg-orange-50 px-2.5 py-0.5 rounded-full uppercase border border-orange-100">
                CRB Rating: Good
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Total Approved Limit</span>
                  <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">
                    KES {user ? user.loanLimit.toLocaleString() : '20,000'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-sans">Level 1 Limit tier</span>
              </div>

              {/* Progress indicator bar to reach KES 200k maximum cap */}
              <div className="space-y-1.5 text-xs text-slate-650">
                <div className="flex justify-between text-slate-500">
                  <span>Progress to maximum cap limit (KES 200,000)</span>
                  <span className="font-mono font-semibold text-slate-800">{user ? `${Math.floor((user.loanLimit / 200000) * 100)}%` : '10%'}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: user ? `${Math.min(100, (user.loanLimit / 200000) * 100)}%` : '10%' }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl text-[11px] leading-relaxed text-slate-500 space-y-1">
                <p className="text-slate-800 font-bold">💡 How to grow your borrow limit:</p>
                <div className="space-y-1.5 pl-1 text-[11px] font-medium text-slate-550 leading-normal">
                  <p>✔ Pay borrowings early or on time via Safaricom Lipa na M-Pesa (+KES 25,000 credit score raise!).</p>
                  <p>✔ Maintain a solid history to build speed tier rankings and score high on automatic limit audits.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: IMPROVE YOUR CREDIT STANDING Accordion info */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6.5 flex flex-col justify-between items-center text-center space-y-4 relative overflow-hidden shadow-premium">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Award className="h-32 w-32 text-orange-500" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest leading-none">
              <span>Automatic Limit Upgrades</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-slate-900 text-base font-extrabold uppercase font-sans">📈 Draw on Demand with Zero Paperwork</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Every successful on-time repayment automatically triggers high-volume API checks that raise your borrowing limits up to <b>KES 200,000</b> without waiting.
              </p>
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-650 w-full text-left space-y-1">
              <div className="flex justify-between">
                <span>Standard Period:</span>
                <span className="text-orange-600 font-bold">7 to 45 Days</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Processing:</span>
                <span className="text-orange-650 font-bold">Instant (STK Push)</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('calculator')}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer hover:shadow-lg block text-center"
            >
              Configure Loan Terms →
            </button>
          </div>

          {/* Box 3: CREDIT DIRECT BIP LIPA NA MPESA PAYBILL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5.5 shadow-premium space-y-3 text-left text-xs text-slate-550 font-sans">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block border-b border-slate-100 pb-2">Manual Paybill Clearing</span>
            <p className="text-slate-500 h-auto">You can also repay any outstanding debt manually at any time by sending KES to Lipa na M-Pesa paybill rules below:</p>
            
            <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl text-xs font-mono font-bold leading-normal text-slate-700">
              <div>Safaricom Paybill: <span className="text-orange-600 font-black">123456</span></div>
              <div className="mt-1">Account Number: <span className="text-orange-600 font-black">Your National ID</span></div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed pt-1 font-mono">
              The payout core processes instant confirmations to immediately update active limits.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
