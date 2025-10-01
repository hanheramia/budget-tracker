import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CreditCardPayment, PaymentService } from '../services/payment.service';
import { SalaryEntry, SalaryService } from '../services/salary.service';

@Component({
  selector: 'cashflow-summary',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './cashflow-summary.html'
})
export class CashFlowComponent implements OnInit {
  creditPayments: CreditCardPayment[] = [];
  salaries: SalaryEntry[] = [];
  months: string[] = [];

  displayedColumns15: string[] = [];
  displayedColumns30: string[] = [];

  constructor(
    private paymentService: PaymentService,
    private salaryService: SalaryService
  ) {}

  ngOnInit() {
    this.paymentService.payments$.subscribe((data) => {
      this.creditPayments = data;
      this.updateMonths();
    });
    this.salaryService.salaries$.subscribe((data) => {
      this.salaries = data;
      this.updateMonths();
    });
  }

  private updateMonths() {
    const monthSet = new Set<string>();

    this.salaries.forEach((s) => {
      let [year, month] = s.startMonth.split('-').map(Number);
      for (let i = 0; i < s.months; i++) {
        monthSet.add(`${year}-${month.toString().padStart(2, '0')}`);
        month++;
        if (month > 12) { month = 1; year++; }
      }
    });

    this.creditPayments.forEach((c) => {
      if (!c.firstPaymentDate) return;
      let [year, month] = c.firstPaymentDate.split('-').map(Number);
      let monthsCount = c.months ?? 1;
      for (let i = 0; i < monthsCount; i++) {
        monthSet.add(`${year}-${month.toString().padStart(2, '0')}`);
        month++;
        if (month > 12) { month = 1; year++; }
      }
    });

    this.months = Array.from(monthSet).sort();

    // Columns: first column + all months
    this.displayedColumns15 = ['category', ...this.months];
    this.displayedColumns30 = ['category', ...this.months];
  }

  /** Salary totals */
  getSalaryMonthTotal(month: string, dueDate: '15' | '30'): number {
    return this.salaries
      .filter((s) => s.dueDate === dueDate)
      .map((s) => this.getSalaryMonths(s).includes(month) ? s.perMonthAmount : 0)
      .reduce((a, b) => a + b, 0);
  }

  getSalaryMonths(s: SalaryEntry): string[] {
    const months: string[] = [];
    let [year, month] = s.startMonth.split('-').map(Number);
    for (let i = 0; i < s.months; i++) {
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
      month++;
      if (month > 12) { month = 1; year++; }
    }
    return months;
  }

  /** Credit totals */
  getCreditMonthTotal(month: string, dueDate: '15' | '30'): number {
    return this.creditPayments
      .filter((c) => c.dueDate === dueDate)
      .map((c) => this.getCreditMonths(c).includes(month) ? c.perMonthAmount ?? 0 : 0)
      .reduce((a, b) => a + b, 0);
  }

  getCreditMonths(c: CreditCardPayment): string[] {
    if (!c.firstPaymentDate) return [];
    const months: string[] = [];
    let [year, month] = c.firstPaymentDate.split('-').map(Number);
    const monthsCount = c.months ?? 1;
    for (let i = 0; i < monthsCount; i++) {
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
      month++;
      if (month > 12) { month = 1; year++; }
    }
    return months;
  }

  /** Net cash flow */
  getNetMonth(month: string, dueDate: '15' | '30'): number {
    return this.getSalaryMonthTotal(month, dueDate) - this.getCreditMonthTotal(month, dueDate);
  }
}
