import { PageId, UserSession } from '../types';
import { ShieldCheck, LogOut, Menu, X, Landmark } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  user: UserSession | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Header({
  currentPage,
  setCurrentPage,
  user,
  onLogout,
  onOpenAuth,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Credit Hub' },
    { id: 'repay', label: 'My Loans' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'faqs', label: 'FAQs' },
  ];

  const handleNav = (pageId: PageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header id="header-container" className="sticky top-0 z-40 w-full bg-white/90 border-b border-slate-200/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-7">
            <button 
              id="logo-button"
              onClick={() => handleNav('home')} 
              className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-l tracking-wider select-none hover:opacity-95 transition-opacity"
            >
              <div className="h-9 w-9 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span>PESA<span className="text-orange-500">SWIFT</span></span>
            </button>

            {/* Desktop Navigation */}
            <nav id="desktop-nav" className="hidden lg:flex items-center gap-1.5 pt-0.5">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    id={`nav-item-${item.id}`}
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-650 border border-orange-500/25'
                        : 'text-slate-500 hover:text-orange-650 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Desktop Auth / Action Panel */}
          <div id="desktop-actions" className="hidden lg:flex items-center gap-4">
            {/* Cert Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-mono text-slate-600 font-bold uppercase tracking-wider">
              <Landmark className="h-3.5 w-3.5 text-orange-650" />
              <span>CBK Registered</span>
            </div>

            {user && user.isLoggedIn ? (
              <div className="flex items-center gap-3.5">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{user.fullName.split(' ')[0]}</span>
                  <span className="text-[10px] text-orange-600 font-mono font-bold uppercase tracking-widest mt-0.5">
                    LIMIT: KES {(user.loanLimit ?? 0).toLocaleString()}
                  </span>
                </div>
                <button
                  id="header-logout-button"
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-full transition-all cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
                <button
                  id="header-shortcut-apply"
                  onClick={() => handleNav('repay')}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-4.5 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  My Credits
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-login-button"
                  onClick={onOpenAuth}
                  className="text-slate-600 hover:text-orange-600 text-xs font-bold uppercase tracking-wider px-4 py-2 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  id="header-cta-getloan"
                  onClick={onOpenAuth}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  Check Credit Score
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-3">
            {user && user.isLoggedIn && (
              <span className="text-[10.5px] text-orange-600 font-mono font-black bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 uppercase tracking-widest animate-pulse-slow">
                KES {(user.loanLimit ?? 0).toLocaleString()} Limit
              </span>
            )}
            
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-orange-500 hover:bg-slate-50 border border-slate-200 active:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-nav-panel" className="lg:hidden border-t border-slate-150 bg-white px-4 pt-2 pb-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  id={`mobile-nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-655 border border-orange-500/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-orange-500'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200">
            {user && user.isLoggedIn ? (
              <div className="space-y-3">
                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{user.fullName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Approved Limit Level 1</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-[#707070] uppercase font-mono">My Credit Limit</div>
                    <div className="text-sm font-mono font-black text-orange-600">KES {(user.loanLimit ?? 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="mobile-logout-button"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold uppercase hover:bg-slate-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                  <button
                    id="mobile-apply-button"
                    onClick={() => {
                      handleNav('repay');
                      setMobileMenuOpen(false);
                    }}
                    className="py-3 bg-orange-600 text-white rounded-xl text-xs text-center font-bold uppercase hover:bg-orange-500 cursor-pointer shadow-md"
                  >
                    <span>My Loans</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2">
                <button
                  id="mobile-login-button"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 border border-slate-200 rounded-xl text-slate-600 text-center text-xs font-bold uppercase hover:bg-slate-50 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  id="mobile-getloan-button"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="py-3 bg-orange-600 text-white rounded-xl text-center text-xs font-bold uppercase hover:bg-orange-500 cursor-pointer shadow-md"
                >
                  Get Approved
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
