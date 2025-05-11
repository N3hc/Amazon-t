import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CardsApiService } from '../../../services/api/cards-api.service';
import { SearchService } from '../../../services/search/search.service';
import { Api2Service } from '../../../services/api/api2.service';
import { CardObject } from '../../../interface/card.interface';
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
        this.loadCards("1");  // Aquí cargarías un set por defecto, por ejemplo "base1"
      }
    });
  }

  // Cargar las cartas de un set
  loadCards(idset: any): void {
    this.cards = [];
    this.api2Service.getCardsFromSet(idset).subscribe({
      next: (response) => {
        // Asegúrate de que 'response.card' tenga los datos esperados
        this.cards = response;  // Cambié 'response.card' por 'response.data'
        console.log(this.cards);
      },
      error: (error) => {
        console.error('Error al cargar las cartas:', error);
      }
    });
  }

  // Buscar cartas con un término
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

  // Buscar cartas por un set (categoría)
  searchCardsFromSet(idset: any): void {
    this.cards = [];
    this.api2Service.getCardsFromSet(idset).subscribe({
      next: (response) => {
        this.cards = response; 
        console.log(this.cards);
      },
      error: (error) => {
        console.error('Error al buscar cartas por categoría:', error);
      }
    });
  }

  // Seleccionar un producto (carta) para ver más detalles
  selectProduct(card: CardObject): void {
    this.searchService.setCard(card);  // 👈 pasa el objeto completo
    this.router.navigate(['/products/details', card.id]);
  }
  
}