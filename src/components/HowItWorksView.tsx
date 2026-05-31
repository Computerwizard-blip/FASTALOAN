import { useState } from 'react';
import { calculateLoanDetails, formatKES } from '../utils/loanUtils';
import { PageId } from '../types';
import { ShieldCheck, HelpCircle, Landmark, Check, ArrowRight, BookOpen, Scale, Percent, Wallet, Calendar } from 'lucide-react';

interface HowItWorksViewProps {
  setCurrentPage: (page: PageId) => void;
  onOpenAuth: () => void;
}

export default function HowItWorksView({ setCurrentPage, onOpenAuth }: HowItWorksViewProps) {
  // Toggle example values to see the math change!
  const [selectedExampleVal, setSelectedExampleVal] = useState<number>(20000);

  const calcs = calculateLoanDetails(selectedExampleVal, 30);
  const displayDueDate = selectedExampleVal === 20000 ? "15 Nov 2026" : calcs.dueDate;

  return (
    <div id="howitworks-view-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-slate-800">
      
      {/* Page Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-255 rounded-full text-xs font-bold text-orange-655 font-sans">
          <BookOpen className="h-4 w-4 text-orange-600" />
          <span>Complete Pricing Disclosure</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          No Hidden Fees. Here’s Exactly How PesaSwift Works
        </h1>
        <p className="text-slate-505 text-sm max-w-xl mx-auto leading-relaxed">
          We believe in absolute clarity. Read our step-by-step flow, interact with the pre-calculated examples, and understand our rules before you borrow.
        </p>
      </div>

      {/* Step-by-Step Narrative */}
      <div className="space-y-8">
        
        {/* Step 1 */}
        <div id="narrative-step-1" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-premium flex flex-col md:flex-row gap-6">
          <div className="h-10 w-10 shrink-0 rounded-full bg-orange-600 text-white font-bold font-mono text-base flex items-center justify-center shadow-sm">
            01
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Check Your Limit Free</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Enter your National ID and Safaricom M-Pesa phone number in our system. Our automated model queries Credit Reference Bureau data and transaction scoring logs to establish your safe starting credit limit. 
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-450 font-mono">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-orange-600 font-bold" /> Limit: KES 1,000 – KES 200,000
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-orange-600 font-bold" /> 100% Free of Cost
              </span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div id="narrative-step-2" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-premium flex flex-col md:flex-row gap-6">
          <div className="h-10 w-10 shrink-0 rounded-full bg-orange-600 text-white font-bold font-mono text-base flex items-center justify-center shadow-sm">
            02
          </div>
          <div className="space-y-4 w-full">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 2: Select Loan + Repayment Term</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Choose the credit weight appropriate for your project or gap. You are totally free to toggle the loan principal and dates within your approved boundaries. Try picking a pre-defined example below to inspect real numbers:
              </p>
            </div>

            {/* Quick pre-sets selector */}
            <div className="grid grid-cols-4 gap-2 mr-2">
              {[5000, 10000, 20000, 50000].map((preset) => (
                <button
                  id={`preset-btn-${preset}`}
                  key={preset}
                  onClick={() => setSelectedExampleVal(preset)}
                  className={`py-2.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedExampleVal === preset
                      ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {formatKES(preset)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Interactive Example details - WHITE CARD WITH ORANGE ACCENTS */}
        <div id="narrative-step-3" className="bg-white border border-orange-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-premium">
          <div className="absolute top-0 right-0 h-44 w-44 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-6">
            <div className="h-10 w-10 shrink-0 rounded-full bg-orange-600 text-white font-bold font-mono text-base flex items-center justify-center shadow-sm">
              03
            </div>

            <div className="space-y-6 w-full">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Step 3: See Costs Before You Accept</h3>
                <p className="text-slate-505 text-xs">This details exact deductions and additions before accepting. PesaSwift leaves zero fine-print surprises.</p>
              </div>

              {/* Display Table matching prompt copy layout exactly */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-sm bg-slate-50 font-mono">
                <div className="grid grid-cols-2 p-3 border-b border-slate-200 bg-slate-100 text-xs text-slate-500 uppercase tracking-widest font-bold">
                  <span>Credit Factor Item</span>
                  <span className="text-right">Value (KES)</span>
                </div>
                
                {/* 1 */}
                <div className="grid grid-cols-2 p-3 border-b border-slate-200">
                  <span className="text-slate-600">Loan Amount Selected</span>
                  <span className="text-right font-bold text-slate-800">{formatKES(calcs.selectedAmount)}</span>
                </div>

                {/* 2 */}
                <div className="grid grid-cols-2 p-3 border-b border-slate-200 text-red-500">
                  <span>10% Processing Fee (Deducted Upfront)</span>
                  <span className="text-right font-bold">-{formatKES(calcs.processingFee)}</span>
                </div>

                {/* 3 */}
                <div className="grid grid-cols-2 p-3 border-b border-slate-200 text-orange-655">
                  <span>5% Interest Added</span>
                  <span className="text-right font-bold">+{formatKES(calcs.interest)}</span>
                </div>

                {/* 4 */}
                <div className="grid grid-cols-2 p-3 border-b border-slate-200 bg-emerald-50 text-emerald-700">
                  <span className="font-sans font-semibold">Amount Disbursed to M-Pesa</span>
                  <span className="text-right font-bold font-mono">{formatKES(calcs.disbursedAmount)}</span>
                </div>

                {/* 5 */}
                <div className="grid grid-cols-2 p-3 border-b border-slate-200 bg-slate-100">
                  <span className="font-sans font-semibold">Total Amount to Repay</span>
                  <span className="text-right font-bold text-slate-900 font-mono">{formatKES(calcs.totalRepay)}</span>
                </div>

                {/* 6 */}
                <div className="grid grid-cols-2 p-3 text-slate-600">
                  <span>Forecasted Due Date</span>
                  <span className="text-right font-bold text-orange-600">{displayDueDate}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
                  Click below to trigger a live scoring simulation using this example value. Real credit transfers occur on approval.
                </p>
                <button
                  id="howitworks-accept-cta"
                  onClick={onOpenAuth}
                  className="bg-orange-600 hover:bg-orange-505 active:scale-98 text-white font-bold px-6 py-3 rounded-xl text-center text-xs transition-all tracking-wider font-mono shrink-0 uppercase shadow-md cursor-pointer"
                >
                  Accept & Get Cash
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div id="narrative-step-4" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-premium flex flex-col md:flex-row gap-6">
          <div className="h-10 w-10 shrink-0 rounded-full bg-orange-600 text-white font-bold font-mono text-base flex items-center justify-center shadow-sm">
            04
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Step 4: Repay Conveniently</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pay the total repayable balance of <strong className="font-bold text-slate-800">{formatKES(calcs.totalRepay)}</strong> via Safaricom Paybill <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-semibold text-xs">123456</span> before your target due date ({displayDueDate}). Easy automated triggers handle immediate balance clears.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block text-xs font-mono">
              <div className="text-slate-400 font-bold uppercase text-[9px] mb-1">M-Pesa Steps Recap:</div>
              <p className="text-slate-700">Paybill: <strong>123456</strong> | Account No: <strong>[Your National ID]</strong> | Amount: <strong>{formatKES(calcs.totalRepay)}</strong></p>
            </div>
          </div>
        </div>

      </div>

      {/* KEY RULES BOX */}
      <section id="key-rules-and-ethics" className="bg-orange-50 border border-orange-200/60 rounded-2xl p-6 sm:p-8 space-y-4">
        
        <div className="flex items-center gap-2 text-orange-900">
          <Scale className="h-5 w-5 shrink-0" />
          <h4 className="text-sm font-bold uppercase tracking-wider font-mono">Ethical Lending Commitment: Key Rules</h4>
        </div>

        <p className="text-xs text-slate-655 leading-relaxed">
          PesaSwift operates under CBK DCP licensing, guaranteeing fairness. Our math is fully fixed with strict consumer protection:
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
          <li className="space-y-1">
            <strong className="block font-bold text-slate-900 font-sans text-sm">Upfront Processing Fee:</strong>
            <p className="text-slate-555 leading-relaxed">
              We charge a flat 10% processing fee. It is deducted upfront upon submission to satisfy M-Pesa network and verification charges.
            </p>
          </li>
          <li className="space-y-1">
            <strong className="block font-bold text-slate-900 font-sans text-sm">Flat Single Interest:</strong>
            <p className="text-slate-555 leading-relaxed">
              Interest is 5% flat on your selected loan amount. It is NOT compound, and it is NOT an escalating monthly factor. What you see is what you pay.
            </p>
          </li>
          <li className="space-y-1">
            <strong className="block font-bold text-slate-900 font-sans text-sm">No Rollover Penalties:</strong>
            <p className="text-slate-555 leading-relaxed">
              If stuck, contact our representatives before your due date. We arrange extended periods without hidden rolling penalties.
            </p>
          </li>
        </ul>
      </section>

    </div>
  );
}
