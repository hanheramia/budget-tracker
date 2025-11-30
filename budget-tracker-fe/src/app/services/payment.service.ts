import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CreditCardPayment {
  id?: string; // unique identifier
  expenseType: 'card' | 'utility';
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

  private paymentsSubject = new BehaviorSubject<CreditCardPayment[]>(this.getPayments());
  payments$ = this.paymentsSubject.asObservable();

  /** Generate unique id */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  getPayments(): CreditCardPayment[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  savePayments(payments: CreditCardPayment[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(payments));
    this.paymentsSubject.next(payments);
  }

  addPayment(payment: Omit<CreditCardPayment, 'id'>) {
    const payments = this.getPayments();
    const paymentWithId: CreditCardPayment = {
      ...payment,
      id: this.generateId(),
    };
    payments.push(paymentWithId);
    this.savePayments(payments);
  }

  clearPayments() {
    localStorage.removeItem(this.storageKey);
    this.paymentsSubject.next([]);
  }

  removePayment(paymentToRemove: CreditCardPayment) {
    const payments = this.getPayments().filter(
      p => p.id !== paymentToRemove.id // 👈 now remove by unique id
    );
    this.savePayments(payments);
  }
}
