import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form';
import { PaymentListComponent } from './payment-list/payment-list';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('budget-tracker');
}
