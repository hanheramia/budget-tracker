import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryEntry, SalaryService } from '../services/salary.service';

@Component({
  selector: 'salary-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary.html',
})
export class SalaryComponent {
  newSalary: Partial<SalaryEntry> = {
    amount: 0,
    months: 1,
    startMonth: '',
    dueDate: '15',
    type: 'Salary',
    description: '',
  };

  constructor(public salaryService: SalaryService) {}

  addSalary() {
    if (!this.newSalary.startMonth || !this.newSalary.amount || !this.newSalary.months) return;

    const perMonthAmount = this.newSalary.amount;

    const salary: SalaryEntry = {
      amount: this.newSalary.amount!,
      months: this.newSalary.months!,
      startMonth: this.newSalary.startMonth!,
      perMonthAmount,
      dueDate: this.newSalary.dueDate as '15' | '30',
      type: this.newSalary.type as 'Salary' | 'Bonus',
      description: this.newSalary.description || '',
    };

    this.salaryService.addSalary(salary);

    // Reset form
    this.newSalary = { amount: 0, months: 1, startMonth: '', dueDate: '15', type: 'Salary', description: '' };
  }

  clearAll() {
    if (confirm('Clear all salary entries?')) {
      this.salaryService.clearSalaries();
    }
  }

  removeSalary(salary: SalaryEntry) {
    if (confirm('Remove this salary entry?')) {
      this.salaryService.removeSalary(salary);
    }
  }

  /** Generate array of months based on startMonth and months */
  getMonths(salary: SalaryEntry): string[] {
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
}
