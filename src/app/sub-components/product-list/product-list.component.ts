import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { CardsApiService } from '../../../services/api/cards-api.service';
import { SearchService } from '../../../services/search/search.service';
import { Api2Service } from '../../../services/api/api2.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
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
  ) {}

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
        this.loadCards();
      }
    });
  }

  loadCards(): void {
    this.cards = [];
    this.api2Service.getCards().subscribe({
      next: (response) => {
        console.log(response);
        this.cards = response.card  ;
      },
      error: (error) => {
        console.error('Error al cargar las cartas:', error);
      }
    });
  }

  searchCards(query: string): void {
    this.cards = [];
    this.api2Service.getCards().subscribe({
      next: (response) => {
        this.cards = response.data.filter((card: any) =>
          card.deleted === 0 &&
          card.name.toLowerCase().includes(query.toLowerCase())
        );
      },
      error: (error) => {
        console.error('Error al buscar cartas:', error);
      }
    });
  }

  searchCardsFromSet(categoryId: string): void {
    this.cards = [];
    this.api2Service.getCards().subscribe({
      next: (response) => {
        this.cards = response.data.filter((card: any) =>
          card.deleted === 0 &&
          String(card.id_set) === String(categoryId)
        );
      },
      error: (error) => {
        console.error('Error al buscar cartas por categoría:', error);
      }
    });
  }

  selectProduct(card: any): void {
    this.searchService.setCategory(card);
    this.router.navigate(['/products/details', card.id]);
  }
}