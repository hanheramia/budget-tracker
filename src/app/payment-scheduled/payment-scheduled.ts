import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService, CreditCardPayment } from '../services/payment.service';

@Component({
  selector: 'payment-scheduled',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatTableModule, MatButtonModule],
  templateUrl: './payment-scheduled.html',
  styleUrls: ['./payment-scheduled.css'],
})
export class PaymentScheduledComponent {
  displayedColumns15: string[] = [];
  displayedColumns30: string[] = [];
  months15: string[] = [];
  months30: string[] = [];

  constructor(public paymentService: PaymentService) {}

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

  /** Returns unique credit card names by due date */
  getCardNamesByDueDate(payments: CreditCardPayment[], dueDate: '15' | '30'): string[] {
    return Array.from(
      new Set(
        payments
          .filter((p) => p.dueDate === dueDate)
          .map((p) => p.cardName)
      )
    );
  }

  /** Convert card names into row objects for Material Table */
  getCardRows(payments: CreditCardPayment[], dueDate: '15' | '30') {
    return this.getCardNamesByDueDate(payments, dueDate).map((name) => ({ cardName: name }));
  }

  /** Sum all payments for a card in a given month with specific due date */
  getTotalForCardMonth(
    payments: CreditCardPayment[],
    cardName: string,
    month: string,
    dueDate: '15' | '30'
  ): number {
    let total = 0;
    payments.forEach((p) => {
      if (p.cardName === cardName && p.dueDate === dueDate) {
        let d = new Date(p.firstPaymentDate!);
        const end = new Date(p.lastPaymentDate!);
        while (d <= end) {
          const monthStr = `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`;
          if (monthStr === month) {
            total += p.perMonthAmount ?? 0;
          }
          d.setMonth(d.getMonth() + 1);
        }
      }
    });
    return Math.round(total * 100) / 100;
  }

  /** Sum total for all cards per month */
  getMonthTotal(payments: CreditCardPayment[], month: string, dueDate: '15' | '30'): number {
    return this.getCardNamesByDueDate(payments, dueDate)
      .map((card) => this.getTotalForCardMonth(payments, card, month, dueDate))
      .reduce((a, b) => a + b, 0);
  }

  /** Remove a single payment */
  removePayment(payment: CreditCardPayment) {
    if (confirm('Are you sure you want to remove this payment?')) {
      this.paymentService.removePayment(payment);
    }
  }
}
