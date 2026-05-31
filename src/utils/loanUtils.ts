/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LoanCalculations {
  selectedAmount: number;
  processingFee: number; // 10% of selected
  disbursedAmount: number; // selected - 10%
  interest: number; // 5% of selected
  totalRepay: number; // selected + 5%
  dueDate: string;
}

/**
 * Calculates loan numbers according to PesaSwift standards.
 * Upfront processing fee is 10%, interest is 5% flat.
 */
export function calculateLoanDetails(amount: number, days: number): LoanCalculations {
  const processingFee = Math.round(amount * 0.10);
  const interest = Math.round(amount * 0.05);
  const disbursedAmount = amount - processingFee;
  const totalRepay = amount + interest;

  // Calculate due date based on current date (2026-05-30 as starter or actual timestamp)
  const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  
  // Format due date elegantly
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const dueDate = date.toLocaleDateString('en-KE', options);

  return {
    selectedAmount: amount,
    processingFee,
    disbursedAmount,
    interest,
    totalRepay,
    dueDate
  };
}

/**
 * Formats a number as KES currency
 */
export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}
