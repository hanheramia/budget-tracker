import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { PaymentService, CreditCardPayment } from '../services/payment.service';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'payment-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatTableModule, MatButtonModule],
  templateUrl: './payment-list.html',
  styleUrls: ['./payment-list.css']
})
export class PaymentListComponent {
  displayedColumns: string[] = [
    'cardName',
    'amount',
    'type',
    'months',
    'delay',
    'perMonth',
    'dueDate',
    'startMonth',
    'firstPayment',
    'lastPayment',
    'description',
    'actions'
  ];

  constructor(public paymentService: PaymentService) {}

  clearAllPayments() {
    if (confirm('Are you sure you want to clear all payments?')) {
      this.paymentService.clearPayments();
    }
  }

  /** Returns all months from earliest start to latest last payment */
  getMonths(payments: CreditCardPayment[]): string[] {
    if (!payments || payments.length === 0) return [];
    const monthsSet = new Set<string>();
    payments.forEach((p) => {
      const start = new Date(p.firstPaymentDate!);
      const end = new Date(p.lastPaymentDate!);
      let d = new Date(start);
      while (d <= end) {
        const monthStr = `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        monthsSet.add(monthStr);
        d.setMonth(d.getMonth() + 1);
      }
    });
    return Array.from(monthsSet).sort();
  }

  /** Returns unique credit card names */
  getCardNames(payments: CreditCardPayment[]): string[] {
    return Array.from(new Set(payments.map((p) => p.cardName)));
  }

  /** Sum all payments for a card in a given month with specific due date (15 or 30) */
  getTotalForCardMonth(
    payments: CreditCardPayment[],
    cardName: string,
    month: string,
    dueDate: '15' | '30'
  ): number {
    let total = 0;
    payments.forEach((p) => {
      if (p.cardName === cardName) {
        let d = new Date(p.firstPaymentDate!);
        const end = new Date(p.lastPaymentDate!);
        while (d <= end) {
          const monthStr = `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`;
          if (monthStr === month && p.dueDate === dueDate) {
            total += p.perMonthAmount ?? 0;
          }
          d.setMonth(d.getMonth() + 1);
        }
      }
    });
    return Math.round(total * 100) / 100;
  }

  getMonthTotal(payments: CreditCardPayment[], month: string, dueDate: '15' | '30'): number {
    return this.getCardNames(payments)
      .map(card => this.getTotalForCardMonth(payments, card, month, dueDate))
      .reduce((a, b) => a + b, 0);
  }  

  getCardNamesByDueDate(payments: CreditCardPayment[], dueDate: '15' | '30'): string[] {
    return Array.from(
      new Set(
        payments
          .filter(p => p.dueDate === dueDate)
          .map(p => p.cardName)
      )
    );
  }

  removePayment(payment: CreditCardPayment) {
    if (confirm('Are you sure you want to remove this payment?')) {
      this.paymentService.removePayment(payment);
    }
  }  
}
