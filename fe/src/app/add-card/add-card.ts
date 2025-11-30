import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CardService, CardDetail } from '../services/card.service';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-card.html',
  styleUrls: ['./add-card.css']
})
export class AddCardComponent {
  newCard: CardDetail = {
    id: '',
    cardName: '',
    type: '',
    last4: '',
    dueDate: '15',
    cutoff: ''
  };

  cards: CardDetail[] = [];

  constructor(private cardService: CardService) {
    this.cards = this.cardService.getCards();
  }

  addCard() {
    this.newCard.id = crypto.randomUUID();
    this.cardService.addCard(this.newCard);
    this.cards = this.cardService.getCards();

    this.newCard = { id: '', cardName: '', type: '', last4: '', dueDate: '15', cutoff: '' };
  }

  removeCard(id: string) {
    this.cardService.removeCard(id);
    this.cards = this.cardService.getCards();
  }
}
