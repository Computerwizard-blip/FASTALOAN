/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageId = 'home' | 'how-it-works' | 'calculator' | 'faqs' | 'repay' | 'legal-help';

export interface UserSession {
  nationalId: string;
  fullName: string;
  phone: string;
  loanLimit: number; // Keep for fallback compatibility
  isLoggedIn: boolean;
  email?: string;
}

export interface LoanApplication {
  id: string;
  nationalId: string;
  selectedAmount: number;
  processingFee: number; // 10%
  disbursedAmount: number; // 90%
  interest: number; // 5%
  totalRepay: number; // 105%
  repaymentPeriodDays: number;
  dueDate: string;
  status: 'pending_approval' | 'disbursed' | 'paid' | 'overdue' | 'rejected' | 'pending_repayment';
  appliedAt: string;
  completedAt?: string;
  depositTxCode?: string;
  repaymentTxCode?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CreditCheckState {
  nationalId: string;
  phone: string;
  status: 'idle' | 'checking' | 'approved' | 'rejected';
  calculatedLimit: number;
  message?: string;
}
