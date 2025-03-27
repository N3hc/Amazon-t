import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private selectedCategory = new BehaviorSubject<string | null>(null);
  selectedCategory$ = this.selectedCategory.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  setCategory(category: string) {
    this.selectedCategory.next(category);
  }
}
