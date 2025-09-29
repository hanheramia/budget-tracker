import { Routes, provideRouter} from '@angular/router';
import { CreditCardFormComponent } from './credit-card-form/credit-card-form';
import { PaymentListComponent } from './payment-list/payment-list';
import { PaymentScheduledComponent } from './payment-scheduled/payment-scheduled';
import { HelloComponent } from './hello/hello';

export const routes: Routes = [
  { path: 'form', component: CreditCardFormComponent }, // form page
  { path: 'list', component: PaymentListComponent }, // payment list page
  { path: 'schedule', component: PaymentScheduledComponent },
  { path: 'hello', component: HelloComponent },
  { path: '', redirectTo: 'form', pathMatch: 'full' }, // default route
];

export const appConfig = {
  providers: [provideRouter(routes)]
};