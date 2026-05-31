import { useState } from 'react';
import { FAQS } from '../data/faqs';
import { HelpCircle, ChevronDown, ChevronUp, Landmark, ShieldCheck, MessageSquare } from 'lucide-react';

export default function FAQsView() {
  const [openId, setOpenId] = useState<string | null>('1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id="faqs-view-container" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200 text-slate-800">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-orange-655 font-sans">
          <HelpCircle className="h-4 w-4 text-orange-600" />
          <span>Instant Answers & Explanations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Frequently Answered Objections
        </h1>
        <p className="text-slate-505 text-sm max-w-xl mx-auto leading-relaxed">
          Need peace of mind? Learn about our CBK Digital Credit Provider license rules, fees structure, and late repayment protection policies.
        </p>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              id={`faq-item-${faq.id}`}
              key={faq.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-205 ${
                isOpen
                  ? 'border-orange-200 bg-orange-50/20 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
              }`}
            >
              <button
                id={`faq-trigger-${faq.id}`}
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left px-5 sm:px-6 py-4.5 flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
              >
                <span className="font-bold text-slate-850 text-sm sm:text-base leading-relaxed">
                  {faq.question}
                </span>
                <span className="text-slate-400 shrink-0">
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-orange-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </span>
              </button>
              
              {isOpen && (
                <div id={`faq-body-${faq.id}`} className="px-5 sm:px-6 pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3 bg-white/70 animate-in slide-in-from-top-1 duration-200">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick support callback footer card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-full pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <h4 className="text-slate-900 text-base font-bold flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-orange-600" />
            <span>Have a direct/special question?</span>
          </h4>
          <p className="text-xs text-slate-500">Our customer support division is active 24/7. Reach us inside seconds.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto font-mono text-[11px] relative z-10">
          <span className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200 text-slate-700">help@pesaswift.co.ke</span>
          <span className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200 text-slate-700">0700 123 456</span>
        </div>
      </div>

    </div>
  );
}
