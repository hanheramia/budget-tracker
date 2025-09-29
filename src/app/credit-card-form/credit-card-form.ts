import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, CreditCardPayment } from '../payment.service';
import { PaymentListComponent } from "../payment-list/payment-list";

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentListComponent],
  templateUrl: './credit-card-form.html',
  styleUrls: ['./credit-card-form.css'],
})
export class CreditCardFormComponent {
  newPayment: CreditCardPayment = {
    cardName: '',
    dueDate: '15',
    type: 'Straight',
    amount: 0,
    startMonth: '',
  };

  payments: CreditCardPayment[] = [];

  constructor(private paymentService: PaymentService) {
    this.payments = this.paymentService.getPayments();
  }

  addPayment() {
    const payment: CreditCardPayment = { ...this.newPayment };

    const { first, last } = this.calculatePaymentDates(
      payment.startMonth,
      payment.dueDate,
      payment.type,
      payment.months,
      payment.delayMonths
    );

    payment.firstPaymentDate = first;
    payment.lastPaymentDate = last;

    if (payment.type === 'Straight') {
      payment.perMonthAmount = payment.amount;
    } else if ((payment.type === 'Installment' || payment.type === 'BNPL') && payment.months) {
      payment.perMonthAmount = this.roundToTwo(payment.amount / payment.months);
    }

    this.paymentService.addPayment(payment);
    this.payments = this.paymentService.getPayments();

    this.newPayment = {
      cardName: '',
      dueDate: '15',
      type: 'Straight',
      amount: 0,
      startMonth: '',
    };
  }

  private calculatePaymentDates(
    startMonthStr: string,
    due: '15' | '30',
    type: 'BNPL' | 'Straight' | 'Installment',
    months?: number,
    delayMonths?: number
  ): { first: string; last: string } {
    const [year, month] = startMonthStr.split('-').map((v) => parseInt(v, 10));

    let firstDue: Date;

    if (type === 'BNPL') {
      const delay = delayMonths ?? 0;
      firstDue = new Date(year, month - 1 + delay, parseInt(due, 10));
    } else {
      firstDue = new Date(year, month - 1, parseInt(due, 10));
    }

    let lastDue = new Date(firstDue);
    if ((type === 'Installment' || type === 'BNPL') && months && months > 1) {
      lastDue.setMonth(lastDue.getMonth() + (months - 1));
    }

    return {
      first: firstDue.toISOString().split('T')[0],
      last: lastDue.toISOString().split('T')[0],
    };
  }

  private roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
  }
}