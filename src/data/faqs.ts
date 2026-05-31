/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FAQItem } from '../types';

export const FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'What’s the interest rate?',
    answer: 'Flat 5% on the loan amount you select. If you pick KES 10,000, interest is KES 500 total. There is no compound interest or daily accumulating penalties if you pay on time.'
  },
  {
    id: '2',
    question: 'Why is there a 10% processing fee?',
    answer: 'It covers credit check automation, M-Pesa transaction costs charged by Safaricom, and fraud prevention measures. It’s deducted upfront from your selected loan amount. For example, if you choose KES 20,000, we disburse KES 18,000, and you repay KES 21,000 (the selected KES 20,000 + KES 1,000 interest).'
  },
  {
    id: '3',
    question: 'Who qualifies for a PesaSwift loan?',
    answer: 'To qualify, you must be a Kenyan citizen of 18+ years, with a valid National ID and an active Safaricom M-Pesa line that has been registered and in active use for at least 6 months.'
  },
  {
    id: '4',
    question: 'When and how do I repay my loan?',
    answer: 'During application, you select a repayment period ranging from 7 days to 6 months. The exact due date is displayed clearly before you accept. You repay via Safaricom Lipa na M-Pesa Paybill 123456 using your National ID as the Account Number or directly in the PesaSwift dashboard.'
  },
  {
    id: '5',
    question: 'What if I pay late?',
    answer: 'We believe in fairness. If you are stuck, please contact us before your due date to arrange an extension. If a loan remains unpaid for more than 30 days without communication, we are legally required to report the default to licensed Credit Reference Bureaus (CRBs), which affects your ability to get future loans in Kenya.'
  },
  {
    id: '6',
    question: 'Is PesaSwift licensed?',
    answer: 'Yes. PesaSwift is fully authorized and licensed by the Central Bank of Kenya (CBK) under the Digital Credit Providers Regulations, 2022. Our CBK License Number is DCP/XXX/2026. We operate strictly in compliance with all Kenyan consumer protection and privacy laws.'
  },
  {
    id: '7',
    question: 'Can I increase my credit limit?',
    answer: 'Absolutely. Every customer starts with a custom limit determined during their first credit check. Repay your loans on time 3 times, and your limit will automatically grow step-by-step up to our maximum of KES 200,000.'
  }
];
