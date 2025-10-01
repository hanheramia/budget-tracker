import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { PaymentService, CreditCardPayment } from '../services/payment.service';
import { CardService, CardDetail } from '../services/card.service';

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './credit-card-form.html',
  styleUrls: ['./credit-card-form.css']
})
export class CreditCardFormComponent {
  newPayment: CreditCardPayment & { startMonthDate?: Date } = {
    expenseType: 'card',
    cardName: '',
    dueDate: '15',
    type: 'Straight',
    amount: 0,
    startMonth: '',
    description: ''
  };

  payments: CreditCardPayment[] = [];
  cards: CardDetail[] = [];

  constructor(
    private paymentService: PaymentService,
    private cardService: CardService
  ) {
    this.payments = this.paymentService.getPayments();
    this.cards = this.cardService.getCards();
  }

  addPayment() {
    const payment: CreditCardPayment = { ...this.newPayment };

    // Convert Date object → YYYY-MM string
    if (this.newPayment.startMonthDate) {
      const year = this.newPayment.startMonthDate.getFullYear();
      const month = this.newPayment.startMonthDate.getMonth() + 1;
      payment.startMonth = `${year}-${month.toString().padStart(2, '0')}`;
    }

    const { first, last } = this.calculatePaymentDates(
      payment.expenseType,
      payment.startMonth,
      payment.dueDate,
      payment.type,
      payment.months,
      payment.delayMonths
    );

    payment.firstPaymentDate = first;
    payment.lastPaymentDate = last;

    if (payment.type === 'Straight' || payment.expenseType === 'utility') {
      payment.perMonthAmount = payment.amount;
    } else if ((payment.type === 'Installment' || payment.type === 'BNPL') && payment.months) {
      payment.perMonthAmount = this.roundToTwo(payment.amount / payment.months);
    }

    this.paymentService.addPayment(payment);
    this.payments = this.paymentService.getPayments();

    // Reset form
    this.newPayment = {
      expenseType: 'card',
      cardName: '',
      dueDate: '15',
      type: 'Straight',
      amount: 0,
      startMonth: '',
      description: ''
    };
  }

  public chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
    const month = normalizedMonth.getMonth() + 1;
    const year = normalizedMonth.getFullYear();

    this.newPayment.startMonth = `${year}-${month.toString().padStart(2, '0')}`;
    this.newPayment.startMonthDate = normalizedMonth;
    datepicker.close();
  }

  private calculatePaymentDates(
    expenseType: 'utility' | 'card',
    startMonthStr: string,
    due: '15' | '30',
    type: 'BNPL' | 'Straight' | 'Installment',
    months?: number,
    delayMonths?: number,
  ): { first: string; last: string } {
    const [year, month] = startMonthStr.split('-').map((v) => parseInt(v, 10));
    let firstDue: Date;

    if (expenseType === 'card' && type === 'BNPL') {
      const delay = delayMonths ?? 0;
      firstDue = new Date(year, month - 1 + delay, parseInt(due, 10));
    } else {
      firstDue = new Date(year, month - 1, parseInt(due, 10));
    }

    let lastDue = new Date(firstDue);
    if ((type === 'Installment' || type === 'BNPL') && (months && months > 1)) {
      lastDue.setMonth(lastDue.getMonth() + (months - 1));
    }

    if (expenseType === 'utility' && months) {
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
