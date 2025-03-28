import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { CardsApiService } from '../../../services/api/cards-api.service';
import { SearchService } from '../../../services/search/search.service';
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

  selectProduct(card: any) {
    this.searchService.setCategory(card); // Guarda la carta seleccionada
    this.router.navigate(['/products/details', card.id]); // Redirige al detalle
    console.log(card);
  }
  cards: any[] = [];
  categories: any[] = [];

  constructor(private cardsApiService: CardsApiService,
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
        console.log("paso 1")
      } else if (category) {
        
        this.searchCardsFromSet(category);
        console.log("paso 2")
      } else {
        this.loadCards();
        console.log("paso 3")
      }
    });
  }

  loadCards(): void {
    this.cards = [];
    this.cardsApiService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards.data;
        console.log(cards);
      },
      error: (error) => {
        console.error('Error al cargar los sets:', error);
      }
    });
  }

  searchCards(query: string): void {
    this.cards = [];

    this.cardsApiService.getUniquePokemon(query).subscribe({
      next: (cards) => {
        this.cards = cards.data;
        console.log(cards);
      },
      error: (error) => {
        console.error('Error al buscar cartas:', error);
      }
    });
  }

  searchCardsFromSet(query: string): void {
    this.cards = [];

    this.cardsApiService.getPokemonsFromSets(query).subscribe({
      next: (cards) => {
        this.cards = cards.data;
        console.log(cards);
      },
      error: (error) => {
        console.error('Error al buscar cartas:', error);
      }
    });
  }

}
