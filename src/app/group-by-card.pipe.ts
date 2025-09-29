import { Pipe, PipeTransform } from '@angular/core';
import { CreditCardPayment } from './payment.service';

@Pipe({
  name: 'groupByCard',
  standalone: true
})
export class GroupByCardPipe implements PipeTransform {
  transform(payments: CreditCardPayment[]): { cardName: string; entries: CreditCardPayment[] }[] {
    if (!payments) return [];

    const groups: { [key: string]: CreditCardPayment[] } = {};
    payments.forEach((p) => {
      if (!groups[p.cardName]) groups[p.cardName] = [];
      groups[p.cardName].push(p);
    });

    return Object.keys(groups).map((cardName) => ({
      cardName,
      entries: groups[cardName],
    }));
  }
}
