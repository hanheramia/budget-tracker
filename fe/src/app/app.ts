import { Component, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, MatTabsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('budget-tracker');

  tabs = [
    { label: 'Add Card', route: '/add-card' },
    { label: 'Add Payment', route: '/form' },
    { label: 'View Payments', route: '/list' },
    { label: 'Scheduled Payments', route: '/schedule' },
    { label: 'Salary Form', route: '/salary-form' },
    { label: 'Salary Summary', route: '/salary-summary' },
    { label: 'Cash Flow Summary', route: '/cashflow-summary' },
    { label: 'Hello', route: '/hello' },
  ];

  selectedIndex = 0;

  constructor(private router: Router) {}

  onTabChange(index: number) {
    this.selectedIndex = index;
    this.router.navigate([this.tabs[index].route]);
  }
}