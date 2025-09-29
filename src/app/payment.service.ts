import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CreditCardPayment {
  expenseType: 'card' | 'utility',
  cardName: string;
  dueDate: '15' | '30';
  type: 'BNPL' | 'Straight' | 'Installment';
  amount: number;
  months?: number;
  delayMonths?: number;
  startMonth: string;
  firstPaymentDate?: string;
  lastPaymentDate?: string;
  perMonthAmount?: number;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private storageKey = 'creditCardPayments';

  // BehaviorSubject holds the current list and notifies subscribers
  private paymentsSubject = new BehaviorSubject<CreditCardPayment[]>(this.getPayments());
  payments$ = this.paymentsSubject.asObservable();

  getPayments(): CreditCardPayment[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  savePayments(payments: CreditCardPayment[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(payments));
    this.paymentsSubject.next(payments); // notify subscribers
  }

  addPayment(payment: CreditCardPayment) {
    const payments = this.getPayments();
    payments.push(payment);
    this.savePayments(payments);
  }

  clearPayments() {
    localStorage.removeItem(this.storageKey);
    this.paymentsSubject.next([]);
  }

  removePayment(paymentToRemove: CreditCardPayment) {
    const payments = this.getPayments().filter(
      p =>
        !(
          p.cardName === paymentToRemove.cardName &&
          p.amount === paymentToRemove.amount &&
          p.type === paymentToRemove.type &&
          p.startMonth === paymentToRemove.startMonth &&
          p.firstPaymentDate === paymentToRemove.firstPaymentDate
        )
    );
    this.savePayments(payments);
  }  
}
