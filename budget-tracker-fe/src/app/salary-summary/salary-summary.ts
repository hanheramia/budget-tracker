import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { SalaryEntry, SalaryService } from '../services/salary.service';

@Component({
  selector: 'salary-summary',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './salary-summary.html',
  styleUrls: ['./salary-summary.css']
})
export class SalarySummaryComponent implements OnInit {
  salaries: SalaryEntry[] = [];
  months: string[] = [];

  displayedColumns: string[] = []; // dynamic columns including 'type'

  constructor(private salaryService: SalaryService) {}

  ngOnInit() {
    this.salaryService.salaries$.subscribe((data) => {
      this.salaries = data;
      this.months = this.getAllMonths(data);
      this.displayedColumns = ['type', ...this.months]; // MUST be in TS
    });
  }

  private getAllMonths(salaries: SalaryEntry[]): string[] {
    const monthSet = new Set<string>();
    salaries.forEach(s => {
      let [year, month] = s.startMonth.split('-').map(Number);
      for (let i = 0; i < s.months; i++) {
        monthSet.add(`${year}-${month.toString().padStart(2,'0')}`);
        month++;
        if(month>12){month=1;year++;}
      }
    });
    return Array.from(monthSet).sort();
  }

  getSalaryMonths(s: SalaryEntry): string[] {
    const months: string[] = [];
    let [year, month] = s.startMonth.split('-').map(Number);
    for(let i=0;i<s.months;i++){
      months.push(`${year}-${month.toString().padStart(2,'0')}`);
      month++;
      if(month>12){month=1;year++;}
    }
    return months;
  }

  getTotalForTypeMonth(type: string, month: string, dueDate: '15'|'30'): number {
    return this.salaries
      .filter(s => s.type === type && s.dueDate === dueDate)
      .map(s => this.getSalaryMonths(s).includes(month)? s.perMonthAmount:0)
      .reduce((a,b)=>a+b,0);
  }

  getTotalMonth(month: string, dueDate: '15'|'30'): number {
    return ['Salary','Bonus'].map(t=>this.getTotalForTypeMonth(t,month,dueDate))
      .reduce((a,b)=>a+b,0);
  }
}
