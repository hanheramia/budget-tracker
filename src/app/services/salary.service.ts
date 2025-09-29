import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SalaryEntry {
  amount: number;
  months: number; // how many months to receive
  startMonth: string; // e.g., '2025-09'
  perMonthAmount: number;
  dueDate: '15' | '30';
  type: 'Salary' | 'Bonus';
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  private storageKey = 'salaryEntries';
  private salarySubject = new BehaviorSubject<SalaryEntry[]>(this.getSalaries());
  salaries$ = this.salarySubject.asObservable();

  getSalaries(): SalaryEntry[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveSalaries(salaries: SalaryEntry[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(salaries));
    this.salarySubject.next(salaries);
  }

  addSalary(salary: SalaryEntry) {
    const salaries = this.getSalaries();
    salaries.push(salary);
    this.saveSalaries(salaries);
  }

  removeSalary(salaryToRemove: SalaryEntry) {
    const salaries = this.getSalaries().filter(
      s =>
        !(
          s.startMonth === salaryToRemove.startMonth &&
          s.amount === salaryToRemove.amount &&
          s.dueDate === salaryToRemove.dueDate &&
          s.type === salaryToRemove.type &&
          s.description === salaryToRemove.description
        )
    );
    this.saveSalaries(salaries);
  }

  clearSalaries() {
    localStorage.removeItem(this.storageKey);
    this.salarySubject.next([]);
  }
}
