import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SalaryService, SalaryEntry } from '../services/salary.service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTable, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'salary-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTable,
    MatButtonModule,
    MatButton
  ],
  templateUrl: './salary.html',
  styleUrls: ['./salary.css']
})
export class SalaryComponent {
  newSalary: SalaryEntry & { startMonthDate?: Date } = {
    type: 'Salary',
    description: '',
    amount: 0,
    months: 1,
    startMonth: '',
    dueDate: '15',
    perMonthAmount: 0
  };

  displayedColumns: string[] = [
    'type',
    'description',
    'amount',
    'months',
    'startMonth',
    'dueDate',
    'actions'
  ];
  
  constructor(public salaryService: SalaryService) {}

  addSalary() {
    const salary: SalaryEntry = { ...this.newSalary };

    // Calculate per-month amount
    salary.perMonthAmount = salary.amount;

    this.salaryService.addSalary(salary);

    // Reset form
    this.newSalary = {
      type: 'Salary',
      description: '',
      amount: 0,
      months: 1,
      startMonth: '',
      dueDate: '15',
      perMonthAmount: 0
    };
  }

  removeSalary(salary: SalaryEntry) {
    this.salaryService.removeSalary(salary);
  }

  clearAll() {
    this.salaryService.clearSalaries();
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
    const month = normalizedMonth.getMonth() + 1;
    const year = normalizedMonth.getFullYear();
    this.newSalary.startMonth = `${year}-${month.toString().padStart(2, '0')}`;
    this.newSalary.startMonthDate = normalizedMonth;
    datepicker.close();
  }

  getMonths(salary: SalaryEntry): string[] {
    const months: string[] = [];
    const [year, month] = salary.startMonth.split('-').map(v => parseInt(v, 10));
    for (let i = 0; i < salary.months; i++) {
      const d = new Date(year, month - 1 + i, parseInt(salary.dueDate, 10));
      months.push(d.toISOString().split('T')[0]);
    }
    return months;
  }

  private roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
  }
}
