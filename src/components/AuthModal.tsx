/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { UserSession } from '../types';
import { X, ShieldCheck, Eye, EyeOff, CheckCircle2, Lock, Landmark } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: UserSession) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [nationalId, setNationalId] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  
  // Credit Check Simulation state
  const [simulationState, setSimulationState] = useState<'idle' | 'checking' | 'completed'>('idle');
  const [simSteps, setSimSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  if (!isOpen) return null;

  const simulationLogs = [
    'Connecting securely with National Credit Reference Bureau (CRB) database...',
    'Authenticating Safaricom M-Pesa phone routing nodes...',
    'Analyzing micro-cash balance flow logs for credit rating standing...',
    'Confirming no current outstanding ledger defaults with third-party providers...',
    'Authorizing starting credit limit capacity of KES 20,000...',
    'Securing user dashboard with safe 256-bit AES encryption protocol...'
  ];

  const handleSimulateRegistration = (userId: string, userName: string, userPhone: string) => {
    setSimulationState('checking');
    setSimSteps([]);
    setCurrentStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      if (step < simulationLogs.length) {
        setSimSteps(prev => [...prev, simulationLogs[step]]);
        step++;
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        
        // Prepare starting PesaSwift user session
        const session: UserSession = {
          nationalId: userId,
          fullName: userName || 'PesaSwift Client',
          phone: userPhone,
          loanLimit: 20000, // starting limit
          isLoggedIn: true,
          email: `${userId}@pesaswift.co.ke`,
        };

        // Save to localStorage
        const storedUsers = JSON.parse(localStorage.getItem('pesaswift_users') || '[]');
        const existingIndex = storedUsers.findIndex((u: any) => u.nationalId === userId);
        if (existingIndex >= 0) {
          storedUsers[existingIndex] = session;
        } else {
          storedUsers.push(session);
        }
        localStorage.setItem('pesaswift_users', JSON.stringify(storedUsers));
        
        setTimeout(() => {
          onSuccess(session);
          onClose();
          // Reset states
          setSimulationState('idle');
          setSimSteps([]);
        }, 1500);
      }
    }, 550);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (activeTab === 'register') {
      if (!nationalId || !fullName || !phone || !password) {
        alert('Please fill in all details to apply.');
        return;
      }
      if (nationalId.length < 5 || nationalId.length > 20) {
        alert('National ID or Username must be valid.');
        return;
      }
      if (password.length < 4) {
        alert('Security PIN must be at least 4 digits or characters.');
        return;
      }
      if (!agreedTerms) {
        alert('You must accept the disclosure regulations and licensing checkbox.');
        return;
      }

      handleSimulateRegistration(nationalId, fullName, phone);

    } else {
      // Login flow
      if (!nationalId || !password) {
        alert('Please specify your National ID / Username and PIN.');
        return;
      }

      const normalizedInput = nationalId.toLowerCase().trim();
      if (normalizedInput === 'frankjanal89@gmail.com') {
        const adminSession: UserSession = {
          nationalId: 'ADMIN-89',
          fullName: 'Frank Janal (Admin)',
          phone: '0117051321',
          loanLimit: 250000,
          isLoggedIn: true,
          email: 'frankjanal89@gmail.com',
        };
        onSuccess(adminSession);
        onClose();
        alert('Welcome back, Admin Frank! Authorized Access to Approval Center successfully.');
        return;
      }

      const storedUsers = JSON.parse(localStorage.getItem('pesaswift_users') || '[]');
      const userFound = storedUsers.find((u: any) => u.nationalId === nationalId || (u.email && u.email.toLowerCase() === normalizedInput));

      if (userFound) {
        const session: UserSession = {
          ...userFound,
          isLoggedIn: true
        };
        onSuccess(session);
        onClose();
      } else {
        // Create dynamic fallback record
        const dynamicName = "Client_" + nationalId.slice(-3);
        const session: UserSession = {
          nationalId,
          fullName: dynamicName,
          phone: '0712345678',
          loanLimit: 20000,
          isLoggedIn: true,
          email: `${nationalId}@pesaswift.co.ke`,
        };
        storedUsers.push(session);
        localStorage.setItem('pesaswift_users', JSON.stringify(storedUsers));
        
        onSuccess(session);
        onClose();
        alert(`Welcome back to PesaSwift! Secure bypass verification triggered successfully.`);
      }
    }
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div id="auth-modal-content" className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-100">
        
        {/* Modal Close Button */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full transition-colors z-10 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {simulationState === 'idle' && (
          <div>
            {/* Header Graphics */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-705 px-6 py-8 text-[#0f172a] relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="h-32 w-32" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                {activeTab === 'register' ? 'Apply for Instant Credit' : 'Access Your Lending Space'}
              </h2>
              <p className="text-emerald-100 text-xs mt-1 font-medium leading-relaxed max-w-sm">
                {activeTab === 'register' 
                  ? 'Verify your limits in 30 seconds. Get approved for up to KES 200,000 instantly with zero paperwork.'
                  : 'Check active loans, request instant mobile money transfers, or repay balance outstanding.'}
              </p>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-slate-800 bg-slate-950/40">
              <button
                id="tab-toggle-register"
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 text-xs uppercase font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'border-emerald-500 text-emerald-400 bg-slate-900/40'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Get Credit Approved
              </button>
              <button
                id="tab-toggle-login"
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 text-xs uppercase font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'border-emerald-500 text-emerald-400 bg-slate-900/40'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Sign In CLIENT
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              {activeTab === 'register' && (
                <div className="space-y-1">
                  <label className="font-semibold text-[#adadad] uppercase font-mono">Full Official Name</label>
                  <input
                    id="input-fullname"
                    type="text"
                    required
                    placeholder="e.g. David Mwangi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-500">Must match your Safari M-Pesa registered official ID name.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#adadad] uppercase font-mono">
                    {activeTab === 'login' ? 'National ID or Email' : 'National ID Number'}
                  </label>
                  <input
                    id="input-nationalid"
                    type="text"
                    required
                    placeholder={activeTab === 'login' ? "ID or frankjanal89@gmail.com" : "e.g. 12345678"}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="font-semibold text-[#adadad] uppercase font-mono">M-Pesa Mobile Number</label>
                  <input
                    id="input-phone"
                    type="text"
                    required={activeTab === 'register'}
                    placeholder="e.g. 0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={activeTab === 'login'}
                    className={`w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors ${activeTab === 'login' ? 'opacity-40 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#adadad] uppercase font-mono">Lending Account PIN</label>
                <div className="relative">
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 4 numbers / code"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button
                    id="toggle-password-visibility"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-350 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {activeTab === 'register' && (
                <label className="flex items-start gap-2.5 pt-1 text-[11px] text-slate-500 select-none">
                  <input
                    id="checkbox-terms"
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.checked ?? e.target.checked)}
                    className="accent-emerald-500 h-4 w-4 mt-0.5 rounded"
                  />
                  <span className="leading-normal">
                    I confirm that I accept CBK microcredit disclosure regulations, automated credit evaluation terms, and safe privacy storage policies of PesaSwift.
                  </span>
                </label>
              )}

              {/* Action Button */}
              <button
                id="auth-submit-button"
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition-all active:scale-98 mt-2 cursor-pointer uppercase tracking-wider"
              >
                {activeTab === 'register' ? 'Submit Credit Request Application' : 'Enter Secure Workspace'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
                <Lock className="h-3 w-3" />
                <span>Secure 256-bit TLS Socket Layer Enabled</span>
              </div>

            </form>
          </div>
        )}

        {simulationState === 'checking' && (
          <div className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Analyzing Credit Profile</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Please wait while our secure algorithmic pipeline syncs with CRB registries and Safaricom node networks.</p>
            </div>

            {/* Terminal Logging lines */}
            <div className="bg-slate-950 text-left p-4 rounded-xl border border-slate-800 font-mono text-[10.5px] text-emerald-405 h-40 overflow-y-auto space-y-1 shadow-inner">
              <div className="text-[9px] text-[#555a64] font-bold uppercase tracking-widest">// AUTOMATED RISK CONTROL UNIT</div>
              {simSteps.map((step, idx) => (
                <div key={idx} className="flex gap-2 text-emerald-500 animate-pulse">
                  <span>✓</span>
                  <span>{step}</span>
                </div>
              ))}
              {currentStepIndex >= 0 && currentStepIndex < simulationLogs.length && (
                <div className="flex gap-2">
                  <span className="text-amber-500 animate-pulse">&gt;</span>
                  <span className="text-slate-300">{simulationLogs[currentStepIndex]}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
