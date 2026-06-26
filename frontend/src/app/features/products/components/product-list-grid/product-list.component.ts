import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../../core/services/search.service';
import { Api2Service } from '../../../../core/services/api2.service';
import { CardObject } from '../../../../core/interfaces/card.interface';
import { combineLatest } from 'rxjs';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  @Output() productSelected = new EventEmitter<any>();

  cards: any[] = [];
  categories: any[] = [];

  constructor(
    private api2Service: Api2Service,
    private searchService: SearchService,
    private router: Router
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.searchService.searchTerm$,
      this.searchService.selectedCategory$
    ]).subscribe(([query, category]) => {
      if (query) {
        this.searchCards(query);
      } else if (category) {
        this.searchCardsFromSet(category);
      } else {
        this.loadCards("1");  // Here you would load a default set, for example "base1"
      }
    });
  }

  // Load cards of a set
  loadCards(idset: any): void {
    this.cards = [];
    this.api2Service.getCardsFromSet(idset).subscribe({
      next: (response) => {
        // Make sure 'response.card' has the expected data
        this.cards = response;  // Changed 'response.card' to 'response.data'
        console.log(this.cards);
      },
      error: (error) => {
        console.error('Error loading cards:', error);
      }
    });
  }

  // Search cards by query term
  searchCards(query: string): void {
    this.cards = [];
    this.api2Service.getCards().subscribe({
      next: (response: any[]) => {
        this.cards = response.filter((card: any) =>
          card.deleted === 0 &&
          card.name.toLowerCase().includes(query.toLowerCase())
        );
      },
      error: (error) => {
        console.error('Error searching cards:', error);
      }
    });
  }

  // Search cards by a set (category)
  searchCardsFromSet(idset: any): void {
    this.cards = [];
    this.api2Service.getCardsFromSet(idset).subscribe({
      next: (response) => {
        this.cards = response; 
        console.log(this.cards);
      },
      error: (error) => {
        console.error('Error searching cards by category:', error);
      }
    });
  }

  // Select a product (card) to view more details
  selectProduct(card: CardObject): void {
    this.searchService.setCard(card);  // 👈 passes the complete object
    this.router.navigate(['/products/details', card.id]);
  }
  
}