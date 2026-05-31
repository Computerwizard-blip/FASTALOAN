import { useState, useEffect, FormEvent } from 'react';
import { UserSession, LoanApplication } from '../types';
import { formatKES } from '../utils/loanUtils';
import { Check, Copy, Sparkles, Smartphone, History, CheckCircle, ShieldCheck, Hourglass, Landmark } from 'lucide-react';

interface RepayViewProps {
  user: UserSession | null;
  activeLoan: LoanApplication | null;
  onClearLoan: () => void;
  onOpenAuth: () => void;
  onRepaySubmitted?: () => void;
}

/**
 * LOAN HISTORY COMPONENT
 * Renders previous, fully paid historical limit rounds in a responsive structure.
 */
function LoanHistory({ loans }: { loans: LoanApplication[] }) {
  return (
    <div id="repay-loan-history-container" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <History className="h-5 w-5 text-orange-655" />
        <h3 id="repay-loan-history-title" className="text-slate-900 text-sm sm:text-base font-bold uppercase tracking-wider">
          Secured Settlement Ledger (Closed Accounts)
        </h3>
        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold ml-auto uppercase">
          {loans.length} Settled
        </span>
      </div>

      <div className="overflow-x-auto">
        <table id="repay-loan-history-table" className="min-w-full divide-y divide-slate-100 text-xs sm:text-sm font-sans">
          <thead>
            <tr className="text-slate-500 font-mono text-[9px] uppercase tracking-wider text-left border-b border-slate-100 pb-2">
              <th scope="col" className="py-3 font-semibold">Settled ID</th>
              <th scope="col" className="py-3 font-semibold">Date Settled</th>
              <th scope="col" className="py-3 text-right font-semibold">Settled Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loans.map((loan) => (
              <tr id={`repay-history-row-${loan.id}`} key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 font-mono font-bold text-slate-705">
                  {loan.id}
                </td>
                <td className="py-4 text-slate-500">
                  {loan.completedAt || loan.dueDate || loan.appliedAt}
                </td>
                <td className="py-4 text-right font-mono font-extrabold text-emerald-600">
                  {formatKES(loan.totalRepay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RepayView({
  user,
  activeLoan: propActiveLoan,
  onClearLoan,
  onOpenAuth,
  onRepaySubmitted,
}: RepayViewProps) {
  // Synchronise state with localstorage to handle instant updates gracefully
  const [localActiveLoan, setLocalActiveLoan] = useState<LoanApplication | null>(propActiveLoan);
  const [copiedPochi, setCopiedPochi] = useState(false);
  const [repaymentCode, setRepaymentCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Balance checking inputs for logged-out queries
  const [typedId, setTypedId] = useState('');
  const [checkedRecord, setCheckedRecord] = useState<boolean>(false);
  const [searchedUser, setSearchedUser] = useState<UserSession | null>(null);
  const [searchedLoan, setSearchedLoan] = useState<LoanApplication | null>(null);

  // Sync state whenever prop activeLoan changes.
  useEffect(() => {
    setLocalActiveLoan(propActiveLoan);
  }, [propActiveLoan]);

  // Keep state updated in case localStorage updates out-of-band
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
        const currentActive = storedLoans.find(
          (l: any) => l.nationalId === user.nationalId && (l.status === 'disbursed' || l.status === 'pending_approval' || l.status === 'pending_repayment')
        );
        if (currentActive) {
          setLocalActiveLoan(currentActive);
        } else {
          setLocalActiveLoan(null);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Copy Pochi Line 0117051321 helper
  const handleCopyPochi = () => {
    navigator.clipboard.writeText('0117051321');
    setCopiedPochi(true);
    setTimeout(() => setCopiedPochi(false), 2000);
  };

  // Logged out account search query
  const handleQueryBalance = (e: FormEvent) => {
    e.preventDefault();
    if (!typedId.trim()) {
      alert('Please enter your National ID / Client Handle.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('pesaswift_users') || '[]');
    const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');

    const userFound = storedUsers.find(
      (u: any) => u.nationalId.toLowerCase() === typedId.trim().toLowerCase()
    );
    const loanFound = storedLoans.find(
      (l: any) => l.nationalId.toLowerCase() === typedId.trim().toLowerCase() && 
      (l.status === 'disbursed' || l.status === 'pending_approval' || l.status === 'pending_repayment')
    );

    setCheckedRecord(true);
    if (userFound) {
      setSearchedUser(userFound);
      setSearchedLoan(loanFound || null);
    } else {
      setSearchedUser(null);
      setSearchedLoan(null);
    }
  };

  // Submit repayment transactional code
  const handleRepaySubmit = (targetLoan: LoanApplication) => {
    if (!repaymentCode.trim() || repaymentCode.trim().length < 4) {
      alert('Kindly fill in a valid transactional code received from Lipa na Pochi confirmation message.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Update in storedLoans
      const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
      const updated = storedLoans.map((l: any) => {
        if (l.id === targetLoan.id) {
          return {
            ...l,
            status: 'pending_repayment',
            repaymentTxCode: repaymentCode.trim().toUpperCase()
          };
        }
        return l;
      });

      localStorage.setItem('pesaswift_loans', JSON.stringify(updated));

      // Retrieve updated item
      const updatedActive = updated.find((l: any) => l.id === targetLoan.id);

      // Save to state
      setLocalActiveLoan(updatedActive || null);
      if (searchedLoan && searchedLoan.id === targetLoan.id) {
        setSearchedLoan(updatedActive || null);
      }

      setRepaymentCode('');
      setIsSubmitting(false);

      // Trigger dynamic callback in parent if applicable
      if (onRepaySubmitted) {
        onRepaySubmitted();
      }

      // Show SMS carrier simulation notification
      const mockSmsPayload = `PESASWIFT Received: Repayment reference ${repaymentCode.trim().toUpperCase()} for Amount KES ${targetLoan.totalRepay.toLocaleString()} has been queued. Verification processing wait about 2 to 3 minutes, kindly wait as we process.`;
      
      // Attempt triggering simulated carrier message via event dispatcher or manual alert helper
      const customEvent = new CustomEvent('trigger-app-sms', { detail: mockSmsPayload });
      window.dispatchEvent(customEvent);

      alert(`Your transaction reference ${repaymentCode.trim().toUpperCase()} was submitted successfully. Verification processing wait about 2 to 3 minutes, kindly wait as we process.`);
    }, 1200);
  };

  // Filter historical closed loans to show
  const paidLoans = (() => {
    if (!user) return [];
    try {
      const storedLoans: LoanApplication[] = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
      return storedLoans
        .filter((l) => l.nationalId === user.nationalId && l.status === 'paid')
        .sort((a, b) => b.id.localeCompare(a.id));
    } catch (e) {
      return [];
    }
  })();

  const activeTargetLoan = user ? localActiveLoan : searchedLoan;

  return (
    <div id="repay-view-container" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      
      {/* Header section with CBK alignment */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-orange-700 font-mono uppercase tracking-widest">
          <Landmark className="h-4 w-4 text-orange-600" />
          <span>Lipa na Pochi Quick Repay</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Settle Your Outstanding Credit
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
          Payback on time to automatically increase your credit score limits up to KES 200,000.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT/MAIN WORKSPACE: Accounts & Processing views (width 7 or 12 depending on auth state) */}
        <div className={user ? "lg:col-span-12 space-y-8" : "lg:col-span-7 space-y-8"}>
          
          {user ? (
            // LOGGED IN USER VIEW
            <div className="space-y-8">
              <div id="active-session-repay-card" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase tracking-wider">Client Username</span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">{user.fullName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-extrabold text-slate-400 block uppercase tracking-wider">National ID</span>
                    <span className="text-xs sm:text-sm font-semibold text-orange-600 font-mono">{user.nationalId}</span>
                  </div>
                </div>

                {activeTargetLoan ? (
                  // CASES OF ACTIVE LOAN DETECTED
                  <div className="space-y-6">
                    
                    {/* CONDITION A: AWAITING APPROVAL / PROCESSING VERIFICATION OVERLAYS */}
                    {(activeTargetLoan.status === 'pending_approval' || activeTargetLoan.status === 'pending_repayment') ? (
                      
                      <div className="bg-amber-50/50 border border-amber-250 p-8 sm:p-12 rounded-2xl text-center space-y-6 max-w-2xl mx-auto my-4 shadow-sm animate-pulse-slow">
                        <div className="relative mx-auto flex items-center justify-center h-16 w-16 bg-amber-100 rounded-full text-amber-700 animate-spin border-4 border-dashed border-amber-300">
                          <Hourglass className="h-6 w-6 animate-bounce" />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="text-[11px] font-mono font-black text-amber-700 uppercase tracking-widest bg-amber-100/70 inline-block px-3 py-1 rounded-full border border-amber-200">
                            {activeTargetLoan.status === 'pending_approval' ? 'Deposit Audit Queued' : 'Settlement Audit Queued'}
                          </div>
                          
                          <h4 className="text-sm sm:text-base font-black text-amber-900 leading-snug">
                            verification processing wait about 2 to 3 minutes,kindly wait as we process
                          </h4>
                          
                          <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-md mx-auto">
                            Administrator Frank is actively matching your Lipa na Pochi transaction code <strong className="font-mono text-slate-850 px-1 rounded bg-slate-100">{activeTargetLoan.status === 'pending_approval' ? activeTargetLoan.depositTxCode : activeTargetLoan.repaymentTxCode}</strong> on line <strong>0117051321</strong>. System limits will upgrade immediately on confirmation.
                          </p>
                        </div>

                        {/* Interactive Countdown Progress bar */}
                        <div className="w-full max-w-sm mx-auto bg-amber-200/50 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-600 h-full rounded-full animate-progress" style={{ width: '45%' }}></div>
                        </div>
                        
                        <span className="text-[10px] text-amber-600 font-mono block">Status: Verifying Mobile Money Receipt Ref...</span>
                      </div>

                    ) : (

                      // CONDITION B: ACTIVE LOAN DISBURSED - NEEDS TO REPAY THROUGH SAM FORMULA
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                        
                        {/* Box 1: Left Loan details card (5 spans) */}
                        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl text-left flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">ACTIVE ACCOUNT BALANCE</span>
                              <span className="text-[9px] uppercase font-mono font-black border border-amber-500/30 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Awaiting Repayment</span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs text-slate-400 font-sans block">Total Settlement Due:</span>
                              <div className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                                {formatKES(activeTargetLoan.totalRepay)}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-300 font-mono">
                              <div className="flex justify-between">
                                <span>Principal Overdraft:</span>
                                <span>{formatKES(activeTargetLoan.selectedAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Flat Flat interest:</span>
                                <span>+{formatKES(activeTargetLoan.interest)}</span>
                              </div>
                              <div className="flex justify-between text-orange-400 font-black pt-1 border-t border-slate-850">
                                <span>Total Repay:</span>
                                <span>{formatKES(activeTargetLoan.totalRepay)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-400">
                            Due period is 30 calendar days from activation approval.
                          </div>
                        </div>

                        {/* Box 2: Lipa Na Pochi payback portal formula inputs (7 spans) */}
                        <div className="md:col-span-7 bg-slate-50 border border-slate-200 p-6 rounded-2xl text-left flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-orange-655 block">LIPA NA POCHI PAYBACK METHOD</span>
                            <h4 className="text-sm font-black text-slate-800">Verify Payback via Pochi 0117051321</h4>
                            
                            <p className="text-xs text-slate-500 leading-relaxed font-sans">
                              Open your mobile money menu, elect Send Money / Pay to Pochi using company number <strong className="text-slate-850 font-bold select-all">0117051321</strong>. Pay <strong>{formatKES(activeTargetLoan.totalRepay)}</strong>, paste your settlement code below.
                            </p>

                            <div className="flex gap-2">
                              <button
                                onClick={handleCopyPochi}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-205 hover:bg-slate-100 rounded-lg text-[10px] font-mono text-slate-700 cursor-pointer"
                              >
                                {copiedPochi ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                                <span>{copiedPochi ? 'Copied Number!' : 'Copy Pochi (0117051321)'}</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="space-y-1">
                              <label className="text-[10.5px] uppercase font-mono font-bold text-slate-500">M-Pesa Transaction Reference Code</label>
                              <input
                                type="text"
                                maxLength={12}
                                value={repaymentCode}
                                onChange={(e) => setRepaymentCode(e.target.value.toUpperCase())}
                                placeholder="e.g. SJE3M8A0ZQ"
                                className="w-full px-4 py-3 bg-white border border-slate-205 rounded-xl uppercase font-mono text-sm text-slate-850 focus:outline-none focus:border-orange-500 tracking-wider font-bold"
                              />
                            </div>

                            <button
                              onClick={() => handleRepaySubmit(activeTargetLoan)}
                              disabled={isSubmitting}
                              className="w-full py-3.5 bg-orange-600 hover:bg-orange-550 text-white font-extrabold text-[10px] uppercase tracking-widest font-mono rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
                            >
                              {isSubmitting ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Submit Settlement Notification</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                ) : (
                  // NO ACTIVE LOAN BOX
                  <div id="no-active-loans-box" className="p-8 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-center space-y-3">
                    <div className="h-12 w-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-slate-700">Standing Ledger Clear</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Your standing ledger holds zero outstanding microcredit agreements. Open the Credit Hub loan calculator if you wish to disburse extra overdraft liquidity.
                    </p>
                  </div>
                )}

              </div>

              {/* LOAN HISTORY LEDGER FOR LOGGED IN USERS */}
              {paidLoans.length > 0 && (
                <div className="animate-in fade-in duration-300">
                  <LoanHistory loans={paidLoans} />
                </div>
              )}

            </div>
          ) : (
            // LOGGED OUT VISUAL MODULE
            <div id="query-balance-card" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-slate-900 text-base font-extrabold uppercase tracking-wider font-mono">Registry Account Status Check</h3>
                <p className="text-slate-500 text-xs">Verify current balances on CBK registries securely.</p>
              </div>

              <form onSubmit={handleQueryBalance} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-bold text-slate-550 uppercase font-mono block">National ID / Ticket Number</label>
                  <input
                    id="query-input-id"
                    type="text"
                    required
                    placeholder="e.g. 39401827"
                    value={typedId}
                    onChange={(e) => setTypedId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-500 text-xs transition-colors font-semibold"
                  />
                </div>

                <button
                  id="query-balance-submit"
                  type="submit"
                  className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest font-mono transition-colors cursor-pointer"
                >
                  Retrieve Balance Record
                </button>
              </form>

              {checkedRecord && (
                <div id="query-results-panel" className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                  {searchedUser ? (
                    // ACCOUNT FOUND FOR LOGGED OUT INQUIRY
                    <div className="space-y-4 text-left">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between text-slate-500">
                          <span>Verified Borrower:</span>
                          <span className="font-bold text-slate-800">{searchedUser.fullName}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Active Limit bounds:</span>
                          <span className="font-bold text-slate-800">{formatKES(searchedUser.loanLimit)}</span>
                        </div>
                      </div>

                      {searchedLoan ? (
                        <div className="space-y-4">
                          
                          {/* CASE: SEARCHED LOAN IS PROCESSING OR WAITING VERIFICATION */}
                          {(searchedLoan.status === 'pending_approval' || searchedLoan.status === 'pending_repayment') ? (
                            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2 text-center text-amber-900 leading-snug">
                              <p className="text-sm font-black text-amber-900">
                                verification processing wait about 2 to 3 minutes,kindly wait as we process
                              </p>
                              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                                Transaction reference code <strong className="font-mono text-slate-800 bg-amber-100 px-1 rounded">{searchedLoan.status === 'pending_approval' ? searchedLoan.depositTxCode : searchedLoan.repaymentTxCode}</strong> is in queue on corporate terminal 0117051321.
                              </p>
                            </div>
                          ) : (
                            // DISBURSED / OUTSTANDING LOAN WAITING DEPOSIT
                            <div className="space-y-4">
                              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <span className="text-[10px] font-mono uppercase text-orange-600 block font-bold">Outstanding Credit</span>
                                  <span className="text-xl font-black font-mono text-slate-900 tracking-tight">
                                    {formatKES(searchedLoan.totalRepay)}
                                  </span>
                                </div>
                                <div className="text-right text-xs">
                                  <span className="text-[9px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full inline-block uppercase font-black tracking-wider">Unsettled</span>
                                </div>
                              </div>

                              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                                <p className="text-xs text-slate-500 leading-normal">
                                  Settle balance instantly by sending exact cash payback of <strong>{formatKES(searchedLoan.totalRepay)}</strong> to Lipa na Pochi contact <strong>0117051321</strong>, then enter code:
                                </p>

                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    maxLength={12}
                                    placeholder="Transaction Reference"
                                    value={repaymentCode}
                                    onChange={(e) => setRepaymentCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-2.5 bg-white border border-slate-205 rounded-xl uppercase font-mono text-xs text-slate-850 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleRepaySubmit(searchedLoan)}
                                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg text-xs font-mono uppercase cursor-pointer"
                                  >
                                    Submit Repayment Log
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs text-center font-mono">
                          ✓ Balance clear! No outstanding liability detected on this ticket/handle.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-205 text-slate-500 rounded-xl text-xs text-center font-mono animate-shake">
                      No matching CBK borrowing registry files associated with ID "{typedId}".
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Only rendered for logged out users to provide instructions (width 5) */}
        {!user && (
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-orange-500/10 rounded-full filter blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Smartphone className="h-5 w-5 text-orange-400" />
                <h4 className="font-mono text-xs uppercase text-orange-400 font-extrabold">Instant Repayment Policy</h4>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                PesaSwift operates a fully manual verification settlement formula back-channeled by administrator <strong>Frank Mwangi</strong> on CBK contact shortlines.
              </p>
              <div className="space-y-3 pt-2 text-[11px] font-mono text-slate-400/90 leading-relaxed">
                <div className="flex gap-2 items-start">
                  <span className="text-orange-400">❶</span>
                  <p>Send repayment value to Lipa na Pochi line <strong>0117051321</strong>.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-orange-400">❷</span>
                  <p>Capture and copy reference code from Safari confirmation.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-orange-450">❸</span>
                  <p>Paste the transaction code inside the Universal check and audit queue.</p>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={onOpenAuth}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-2.5 rounded-xl text-xs font-mono uppercase tracking-wide cursor-pointer text-center"
                >
                  Verify Access / Log In
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
