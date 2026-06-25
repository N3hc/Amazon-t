import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardObject } from '../interfaces/card.interface';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private selectedCategory = new BehaviorSubject<string | null>(null);
  selectedCategory$ = this.selectedCategory.asObservable();

  private selectedCard = new BehaviorSubject<CardObject | null>(null);
  selectedCard$ = this.selectedCard.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  setCategory(category: string) {
    this.selectedCategory.next(category);
  }

  setCard(card: CardObject) {
    this.selectedCard.next(card);
  }
}
