import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SalaryEntry, SalaryService } from '../services/salary.service';

@Component({
  selector: 'salary-summary',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './salary-summary.html',
})
export class SalarySummaryComponent implements OnInit {
  salaries: SalaryEntry[] = [];
  months: string[] = [];

  constructor(private salaryService: SalaryService) {}

  ngOnInit() {
    this.salaryService.salaries$.subscribe((data) => {
      this.salaries = data;
      this.months = this.getAllMonths(data);
    });
  }

  /** Generate all months that have at least one payment */
  private getAllMonths(salaries: SalaryEntry[]): string[] {
    const monthSet = new Set<string>();
    salaries.forEach((s) => {
      let [year, month] = s.startMonth.split('-').map(Number);
      for (let i = 0; i < s.months; i++) {
        monthSet.add(`${year}-${month.toString().padStart(2, '0')}`);
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }
    });
    return Array.from(monthSet).sort();
  }

  /** Return months for a salary entry */
  getSalaryMonths(salary: SalaryEntry): string[] {
    const months: string[] = [];
    let [year, month] = salary.startMonth.split('-').map(Number);
    for (let i = 0; i < salary.months; i++) {
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
    return months;
  }

  /** Sum of perMonthAmount for given type, month, and dueDate */
  getTotalForTypeMonth(type: string, month: string, dueDate: '15' | '30'): number {
    return this.salaries
      .filter((s) => s.type === type && s.dueDate === dueDate)
      .map((s) => (this.getSalaryMonths(s).includes(month) ? s.perMonthAmount : 0))
      .reduce((a, b) => a + b, 0);
  }

  /** Total per month including all types */
  getTotalMonth(month: string, dueDate: '15' | '30'): number {
    return ['Salary', 'Bonus'].map((t) => this.getTotalForTypeMonth(t, month, dueDate)).reduce((a, b) => a + b, 0);
  }
}
