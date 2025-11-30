import { Routes, provideRouter} from '@angular/router';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form';
import { PaymentListComponent } from './payment-list/payment-list';
import { PaymentScheduledComponent } from './payment-scheduled/payment-scheduled';
import { HelloComponent } from './hello/hello';
import { SalaryComponent } from './salary/salary';
import { SalarySummaryComponent } from './salary-summary/salary-summary';
import { CashFlowComponent } from './cashflow-summary/cashflow-summary';
import { AddCardComponent } from './add-card/add-card';

export const routes: Routes = [
  { path: 'add-card', component: AddCardComponent },
  { path: 'form', component: CreditCardFormComponent }, // form page
  { path: 'list', component: PaymentListComponent }, // payment list page
  { path: 'schedule', component: PaymentScheduledComponent },
  { path: 'salary-form', component: SalaryComponent}, 
  { path: 'salary-summary', component: SalarySummaryComponent},
  { path: 'cashflow-summary', component: CashFlowComponent},
  { path: 'hello', component: HelloComponent },
  { path: '', redirectTo: 'form', pathMatch: 'full' }, // default route
];

export const appConfig = {
  providers: [provideRouter(routes)]
};
