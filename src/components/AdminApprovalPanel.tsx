import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, RefreshCw, XCircle, FileText, Landmark, User, Smartphone, DollarSign, ArrowUpRight } from 'lucide-react';
import { formatKES } from '../utils/loanUtils';
import { LoanApplication } from '../types';

interface AdminApprovalPanelProps {
  onApprovalUpdate: () => void;
  triggerSms: (message: string) => void;
  onClose?: () => void;
}

export default function AdminApprovalPanel({ onApprovalUpdate, triggerSms, onClose }: AdminApprovalPanelProps) {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'disbursed' | 'all'>('pending');

  const loadLoansData = () => {
    setLoading(true);
    const stored = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
    setLoans(stored);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    loadLoansData();
  }, []);

  const handleApprove = (loanId: string) => {
    const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
    let targetLoan: LoanApplication | null = null;

    const updated = storedLoans.map((l: LoanApplication) => {
      if (l.id === loanId) {
        targetLoan = { ...l, status: 'disbursed', appliedAt: new Date().toLocaleDateString('en-KE') };
        return targetLoan;
      }
      return l;
    });

    localStorage.setItem('pesaswift_loans', JSON.stringify(updated));
    loadLoansData();
    onApprovalUpdate();

    if (targetLoan) {
      // Trigger instant disbursement SMS confirmation
      const mpesaCode = `MP${Math.floor(100000 + Math.random() * 900000)}`;
      triggerSms(
        `${mpesaCode} Confirmed. KES ${(targetLoan as LoanApplication).selectedAmount.toLocaleString()} disbursed to your Safaricom line from PESASWIFT escrow. Processing fee of KES ${(targetLoan as LoanApplication).processingFee.toLocaleString()} verified (Pochi Ref: ${(targetLoan as LoanApplication).depositTxCode}). Please repay KES ${(targetLoan as LoanApplication).totalRepay.toLocaleString()} on or before ${(targetLoan as LoanApplication).dueDate}.`
      );
      alert(`🎉 Loan ${loanId} successfully approved! Notification dispatched.`);
    }
  };

  const handleApproveRepayment = (loanId: string) => {
    const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
    let targetLoan: LoanApplication | null = null;

    const updated = storedLoans.map((l: LoanApplication) => {
      if (l.id === loanId) {
        targetLoan = { ...l, status: 'paid', completedAt: new Date().toLocaleDateString('en-KE') };
        return targetLoan;
      }
      return l;
    });

    localStorage.setItem('pesaswift_loans', JSON.stringify(updated));

    if (targetLoan) {
      // Upgrade borrowing capacity
      const storedUsers = JSON.parse(localStorage.getItem('pesaswift_users') || '[]');
      const userToUpdate = storedUsers.find((u: any) => u.nationalId === (targetLoan as LoanApplication).nationalId);
      if (userToUpdate) {
        const newLimit = Math.min(200000, (userToUpdate.loanLimit || 20000) + 25000);
        userToUpdate.loanLimit = newLimit;
        localStorage.setItem('pesaswift_users', JSON.stringify(storedUsers));

        const activeUserStr = localStorage.getItem('pesaswift_active_user');
        if (activeUserStr) {
          const activeUser = JSON.parse(activeUserStr);
          if (activeUser.nationalId === userToUpdate.nationalId) {
            activeUser.loanLimit = newLimit;
            localStorage.setItem('pesaswift_active_user', JSON.stringify(activeUser));
          }
        }
      }

      // Trigger repayment confirmation SMS
      const mpesaCode = `MPP${Math.floor(100000 + Math.random() * 900000)}`;
      triggerSms(
        `${mpesaCode} Confirmed. KES ${(targetLoan as LoanApplication).totalRepay.toLocaleString()} paid to PESASWIFT via Lipa na Pochi. (Pochi code: ${(targetLoan as LoanApplication).repaymentTxCode}). Your loan balance is KES 0. Your borrowing limit has increased!`
      );
      alert(`🎉 Repayment for Loan ${loanId} successfully approved!`);
    }

    loadLoansData();
    onApprovalUpdate();
  };

  const handleReject = (loanId: string) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;

    const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
    const updated = storedLoans.map((l: LoanApplication) => {
      if (l.id === loanId) {
        return { ...l, status: 'rejected' };
      }
      return l;
    });

    localStorage.setItem('pesaswift_loans', JSON.stringify(updated));
    loadLoansData();
    onApprovalUpdate();
    alert(`❌ Loan proposal rejected.`);
  };

  // Filter lists
  const filteredLoans = loans.filter((l) => {
    if (filter === 'pending') return l.status === 'pending_approval' || l.status === 'pending_repayment';
    if (filter === 'disbursed') return l.status === 'disbursed';
    return true;
  });

  const pendingCount = loans.filter(l => l.status === 'pending_approval' || l.status === 'pending_repayment').length;
  const disbursedCount = loans.filter(l => l.status === 'disbursed').length;

  return (
    <div className="bg-[#FFFDF0] border border-amber-200 rounded-3xl p-6 shadow-xl space-y-6 text-slate-800">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-100 border border-red-200 rounded-full text-[10px] font-bold text-red-800 uppercase tracking-wider font-mono">
            <ShieldCheck className="h-3 w-3" />
            <span>Root Administrator Deck Locked to frankjanal89@gmail.com</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="h-5 w-5 text-amber-700" />
            PesaSwift Cash Loan Approval Desk
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Review incoming processing fee transactions sent to Lipa na Pochi <strong>0117051321</strong>. Approve verifying real credit lines instantly.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadLoansData}
            title="Refresh Ledger"
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-950 cursor-pointer text-xs flex items-center justify-center gap-1 font-mono font-bold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Resync</span>
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-850 transition-colors uppercase font-mono font-bold tracking-wider text-[10px]"
            >
              Close Panel
            </button>
          )}
        </div>
      </div>

      {/* Summary Tracker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-yellow-250 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-widest">PENDING APPROVALS</span>
            <span className="text-2xl font-black font-mono text-amber-700">{pendingCount}</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-sans text-xs font-bold">
            !
          </div>
        </div>

        <div className="p-4 bg-white border border-emerald-250 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-widest">ACTIVE PORTFOLIO</span>
            <span className="text-2xl font-black font-mono text-emerald-700">{disbursedCount}</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-250 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block tracking-widest">TOTAL VALUE POOL</span>
            <span className="text-2xl font-black font-mono text-slate-800">
              {formatKES(loans.reduce((acc, curr) => curr.status === 'disbursed' ? acc + curr.selectedAmount : acc, 0))}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Lists Tab Toggle Filter */}
      <div className="flex border-b border-amber-255 gap-1 pt-2 font-mono text-[10px]">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-t-xl transition-all font-bold tracking-wider uppercase border-t border-x ${
            filter === 'pending'
              ? 'bg-white border-amber-200 text-amber-800 border-b-white translate-y-[1px] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🔍 Review Queue ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('disbursed')}
          className={`px-4 py-2 rounded-t-xl transition-all font-bold tracking-wider uppercase border-t border-x ${
            filter === 'disbursed'
              ? 'bg-white border-amber-200 text-emerald-800 border-b-white translate-y-[1px] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          ✔ Disbursed Ledger ({disbursedCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-t-xl transition-all font-bold tracking-wider uppercase border-t border-x ${
            filter === 'all'
              ? 'bg-white border-amber-200 text-slate-800 border-b-white translate-y-[1px] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Applications ({loans.length})
        </button>
      </div>

      {/* Requests table / List */}
      <div className="space-y-4">
        {filteredLoans.length === 0 ? (
          <div className="bg-white border border-slate-150 p-8 rounded-2xl text-center text-slate-400 text-xs font-sans">
            <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p>No loan records match the selected filter configuration.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLoans.map((loan) => (
              <div
                key={loan.id}
                className={`p-5 rounded-2xl bg-white border transition-all ${
                  (loan.status === 'pending_approval' || loan.status === 'pending_repayment')
                    ? 'border-amber-300 shadow-[0_4px_12px_rgba(230,160,30,0.06)]'
                    : 'border-slate-205'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Loan Summary stats */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-850 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {loan.id}
                      </span>
                      <span className={`text-[9px] uppercase font-mono font-black px-2 py-0.5 rounded border ${
                        loan.status === 'pending_approval'
                          ? 'bg-yellow-50 text-amber-700 border-yellow-200'
                          : loan.status === 'pending_repayment'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : loan.status === 'disbursed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {loan.status === 'pending_approval' ? 'Pending Deposit Ref Check' : loan.status === 'pending_repayment' ? 'Pending Repayment Ref Check' : loan.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Applied: {loan.appliedAt}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 p-3.5 border border-slate-100 rounded-xl text-left">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Borrower ID</span>
                        <span className="font-bold text-slate-800 text-xs font-mono">{loan.nationalId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Principal Amount</span>
                        <span className="font-bold text-slate-800 text-xs font-mono">{formatKES(loan.selectedAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Required Upfront (10%)</span>
                        <span className="font-bold text-orange-655 text-xs font-mono font-black">{formatKES(loan.processingFee)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">Repayment (105%)</span>
                        <span className="font-black text-slate-900 text-xs font-mono">{formatKES(loan.totalRepay)}</span>
                      </div>
                    </div>

                    {/* Mpesa Transaction Ref Checker */}
                    {loan.status === 'pending_approval' && (
                      <div className="bg-amber-50/50 border border-amber-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-amber-700" />
                          <span className="font-medium">
                            Submitted entry activation code for KES {loan.processingFee.toLocaleString()}:
                          </span>
                        </div>
                        <div className="font-mono bg-amber-100/80 border border-amber-200 text-amber-900 font-black px-3 py-1 rounded text-sm uppercase select-all tracking-wider font-bold">
                          {loan.depositTxCode || 'MISSING_REF'}
                        </div>
                      </div>
                    )}

                    {loan.status === 'pending_repayment' && (
                      <div className="bg-rose-50/50 border border-rose-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-rose-700" />
                          <span className="font-medium font-sans text-rose-900">
                            Submitted payback settlement code for KES {loan.totalRepay.toLocaleString()}:
                          </span>
                        </div>
                        <div className="font-mono bg-rose-100/80 border border-rose-200 text-rose-900 font-black px-3 py-1 rounded text-sm uppercase select-all tracking-wider font-bold">
                          {loan.repaymentTxCode || 'MISSING_REF'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Approval Action Buttons */}
                  {loan.status === 'pending_approval' && (
                    <div className="flex sm:flex-col lg:flex-row gap-2 lg:pl-4 justify-end">
                      <button
                        onClick={() => handleReject(loan.id)}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold uppercase rounded-xl text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 font-mono"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Deny Request</span>
                      </button>
                      <button
                        onClick={() => handleApprove(loan.id)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase rounded-xl text-[10px] tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1 font-mono"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-100" />
                        <span>Approve & Disburse</span>
                      </button>
                    </div>
                  )}

                  {loan.status === 'pending_repayment' && (
                    <div className="flex sm:flex-col lg:flex-row gap-2 lg:pl-4 justify-end">
                      <button
                        onClick={() => handleReject(loan.id)}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold uppercase rounded-xl text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 font-mono"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Deny Request</span>
                      </button>
                      <button
                        onClick={() => handleApproveRepayment(loan.id)}
                        className="flex-1 px-6 py-2.5 bg-emerald-650 hover:bg-emerald-500 text-white font-extrabold uppercase rounded-xl text-[10px] tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1 font-mono"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-100" />
                        <span>Approve Settlement</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
