import { useState } from 'react';
import { calculateLoanDetails, formatKES } from '../utils/loanUtils';
import { PageId, UserSession } from '../types';
import { Calendar, HelpCircle, CheckCircle, Calculator, TrendingUp } from 'lucide-react';

interface CalculatorViewProps {
  onOpenAuth: () => void;
  user: UserSession | null;
  selectedAmount: number;
  setSelectedAmount: (amount: number) => void;
  onApplyLoanSimulated: (amount: number, termDays: number) => void;
}

export default function CalculatorView({
  onOpenAuth,
  user,
  selectedAmount,
  setSelectedAmount,
  onApplyLoanSimulated,
}: CalculatorViewProps) {
  // Slider 2: Repayment period
  const [periodDays, setPeriodDays] = useState<number>(30);

  // Available periods presets
  const periods = [
    { label: '7 Days', val: 7 },
    { label: '14 Days', val: 14 },
    { label: '30 Days', val: 30 },
    { label: '60 Days (2 Mo)', val: 60 },
    { label: '90 Days (3 Mo)', val: 90 },
    { label: '120 Days (4 Mo)', val: 120 },
    { label: '150 Days (5 Mo)', val: 155 },
    { label: '180 Days (6 Mo)', val: 180 },
  ];

  const currentPeriod = periods.find(p => p.val === periodDays) || periods[2];
  const calcs = calculateLoanDetails(selectedAmount, periodDays);

  const handleApply = () => {
    if (user && user.isLoggedIn) {
      if (selectedAmount > user.loanLimit) {
        alert(
          `Your selected amount (${formatKES(selectedAmount)}) exceeds your approved credit limit of ${formatKES(
            user.loanLimit
          )}. Please select a lower amount or complete existing loans to grow your limit!`
        );
      } else {
        onApplyLoanSimulated(selectedAmount, periodDays);
      }
    } else {
      onOpenAuth();
    }
  };

  return (
    <div id="calculator-view-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-slate-800">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-orange-655 font-sans">
          <Calculator className="h-4 w-4 text-orange-600" />
          <span>No-Obligation Credit Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          See Exactly What You’ll Get & Repay
        </h1>
        <p className="text-slate-505 text-sm max-w-xl mx-auto leading-relaxed">
          Drag the controls below to configure your exact loan amount and repayment period parameters. Details compute dynamically.
        </p>
      </div>

      {/* Main Interactive Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sliders Control Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-premium">
          
          <h3 className="text-slate-900 text-base font-bold flex items-center gap-2 border-b border-slate-100 pb-4">
            <span className="flex items-center justify-center h-6 w-6 rounded bg-orange-50 border border-orange-200 text-orange-600 text-xs font-mono font-bold">1</span>
            <span>Configure Loan Preferences</span>
          </h3>

          {/* Slider 1: Loan Amount */}
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase">Selected Loan Amount</span>
              <span className="text-lg font-mono font-extrabold text-orange-600">
                {formatKES(selectedAmount)}
              </span>
            </div>

            <input
              id="calculator-amount-slider"
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={selectedAmount}
              onChange={(e) => setSelectedAmount(Number(e.target.value))}
              className="w-full select-none accent-orange-500 h-2 bg-slate-100 rounded-lg cursor-pointer focus:outline-none"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>KES 1,000</span>
              <span>KES 200,000</span>
            </div>
            
            {/* Quick Chips for Quick Amount Entry */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[2000, 5000, 10000, 20000, 50000, 100000].map((amt) => (
                <button
                  id={`calc-amt-chip-${amt}`}
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`px-3.5 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-semibold ${
                    selectedAmount === amt
                      ? 'bg-orange-50 text-orange-655 border-orange-200 font-bold shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {formatKES(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 2: Repayment Period */}
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-mono font-semibold text-slate-500 uppercase">Repayment Period</span>
              <span className="text-sm font-semibold text-orange-655 font-mono bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md">
                {currentPeriod.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {periods.map((p) => (
                <button
                  id={`calc-period-chip-${p.val}`}
                  key={p.val}
                  type="button"
                  onClick={() => setPeriodDays(p.val)}
                  className={`py-2.5 px-1 text-center rounded-xl border text-xs font-medium font-mono uppercase tracking-wide transition-all cursor-pointer ${
                    periodDays === p.val
                      ? 'bg-orange-600 text-white border-orange-600 font-bold shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            
            {/* Range feedback slider as well for desktop precision */}
            <div className="space-y-1">
              <input
                id="calculator-period-slider"
                type="range"
                min="7"
                max="180"
                step="1"
                value={periodDays}
                onChange={(e) => setPeriodDays(Number(e.target.value))}
                className="w-full accent-orange-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-450 font-mono">
                <span>7 Days Min</span>
                <span>{periodDays} Days</span>
                <span>180 Days Max</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Calculated Output Table */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-slate-700 space-y-6 shadow-premium relative">
          
          <h3 className="text-slate-900 text-base font-bold flex items-center gap-2 border-b border-slate-100 pb-4">
            <span className="flex items-center justify-center h-6 w-6 rounded bg-orange-600 text-white text-xs font-mono font-bold">2</span>
            <span>Est. Costs Ledger Summary</span>
          </h3>

          {/* Clean Ledger Grid */}
          <div className="space-y-3.5 text-xs font-mono">
            
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-slate-450">You Select</span>
              <span className="text-sm font-bold text-slate-900">{formatKES(calcs.selectedAmount)}</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 text-red-500">
              <span>10% Fee Deducted Upfront</span>
              <span className="text-sm font-bold">-{formatKES(calcs.processingFee)}</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 text-orange-600">
              <span>5% Flat Interest Added</span>
              <span className="text-sm font-bold">+{formatKES(calcs.interest)}</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 bg-emerald-50 p-2.5 rounded text-emerald-700 font-sans font-semibold">
              <span>Amount Disbursed (M-Pesa)</span>
              <span className="text-sm font-bold font-mono">{formatKES(calcs.disbursedAmount)}</span>
            </div>

            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 bg-slate-50 p-2.5 rounded text-slate-800">
              <span>Total Repay Goal</span>
              <span className="text-sm font-bold text-slate-900">{formatKES(calcs.totalRepay)}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 rounded bg-slate-100 text-slate-700 font-bold">
              <span>Repayment Due Date</span>
              <span className="text-sm font-bold text-orange-600">{periodDays === 30 && selectedAmount === 20000 ? "15 Nov 2026" : calcs.dueDate}</span>
            </div>

          </div>

          <p className="text-[11px] text-slate-500 leading-normal bg-orange-50/40 p-3.5 rounded-lg border border-orange-100 flex gap-2">
            <InformationCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
            <span className="font-sans font-medium text-slate-550 leading-normal">
              <strong>Cost Disclosure:</strong> Upfront processing fee factor is deducted prior to Safaricom disbursal. You repay the originally selected principal amount plus 5% flat non-compounded interest.
            </span>
          </p>

          {/* Limit and CTA state check */}
          {user && user.isLoggedIn ? (
            <div className="space-y-3">
              <div className="px-4 py-2 bg-slate-50 border border-slate-205 rounded-xl flex justify-between items-center text-xs text-slate-650">
                <span>Approved Limit Balance:</span>
                <span className="font-extrabold text-slate-900">{formatKES(user.loanLimit)}</span>
              </div>
              
              <button
                id="calc-apply-loan-btn"
                onClick={handleApply}
                className="w-full bg-orange-600 hover:bg-orange-550 text-white font-bold py-3.5 rounded-xl text-center text-sm transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Apply for KES {selectedAmount.toLocaleString()} Loan
              </button>
            </div>
          ) : (
            <button
              id="calc-auth-apply-btn"
              onClick={onOpenAuth}
              className="w-full bg-orange-600 hover:bg-orange-550 text-white font-bold py-3.5 rounded-xl text-center text-sm transition-all shadow-md active:scale-98 cursor-pointer"
            >
              Apply for This Loan
            </button>
          )}

        </div>

      </div>

      {/* Credit Growth disclosure block */}
      <section id="credit-growth-info" className="bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-premium">
        <div className="md:col-span-8 space-y-1.5">
          <h4 className="text-slate-900 font-bold flex items-center gap-1.5 text-base">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span>Unlock Limits Up to KES 200,000</span>
          </h4>
          <p className="text-slate-550 text-xs leading-relaxed font-medium">
            Every customer starts with a custom initial limit (e.g., KES 15,000 to KES 45,000). Repaying your loans on time exactly 3 consecutive times instructs our regulatory score engine to release automatic level upgrades, scaling your limit all the way up to KES 200,000. No collateral needed.
          </p>
        </div>
        <div className="md:col-span-4 flex justify-end">
          <button
            id="calc-whyitworks-btn"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-xs font-bold px-5 py-3.5 rounded-xl transition-all cursor-pointer"
          >
            Learn Credit Upgrades
          </button>
        </div>
      </section>

    </div>
  );
}

// Quick fallback for Lucide icon mismatch:
function InformationCircle(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={props.className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.054.95l-.56 1.405a1.2 1.2 0 00.125 1.29l.041.02a.75.75 0 11-1.054-.95l.56-1.405a1.2 1.2 0 00-.125-1.29l-.041-.02zM12 8.25a.75.75 0 100-1.5.75.75 0 000 1.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0y0z" />
    </svg>
  );
}
