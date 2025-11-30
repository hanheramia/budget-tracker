import { Injectable } from '@angular/core';

export interface CardDetail {
  id: string;        // unique id
  cardName: string;  // display name, e.g. "BDO Mastercard"
  type: string;      // Visa / Mastercard / Amex
  last4: string;     // last 4 digits
  dueDate: '15' | '30';
  cutoff: string;    // cutoff date, e.g. "05"
}

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private storageKey = 'creditCards';

  getCards(): CardDetail[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveCards(cards: CardDetail[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(cards));
  }

  addCard(card: CardDetail) {
    const cards = this.getCards();
    cards.push(card);
    this.saveCards(cards);
  }

  removeCard(id: string) {
    const cards = this.getCards().filter(c => c.id !== id);
    this.saveCards(cards);
  }
}
