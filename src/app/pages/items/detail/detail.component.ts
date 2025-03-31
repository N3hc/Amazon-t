import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SearchService } from '../../../../services/search/search.service';
import { HeaderComponent } from "../../../main-components/header/header.component";
import { ThemeService } from '../../../../services/theme/theme.service';
import { CardsApiService } from '../../../../services/api/cards-api.service';
import { CartService } from '../../../../services/cart/cart.service';
import { CartItem } from '../../../../interface/productos.interface';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {

  isDarkMode = false;
  card: any;
  routes = "assets/energy/";

  constructor(
    private route: ActivatedRoute,
    private cardsApiService: CardsApiService,
    private themeService: ThemeService,
    private searchService: SearchService,
    private router: Router,
    private cartService: CartService
  ) {}

  addToCart(product: any) {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.cardmarket.prices.averageSellPrice,
      image: product.images.small,
      quantity: 1
    };
    console.log(item)
    this.cartService.addToCart(item);
  }

  backToProducts() {
    // Emitimos el set de la carta (suponiendo que `card.set.id` contiene el ID del set)
    if (this.card && this.card.set && this.card.set.id) {
      this.searchService.setCategory(this.card.set.id); // Emitimos el ID del set
    }
      this.router.navigate(['/products']);
  }
  

  ngOnInit(): void {
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.cardsApiService.getCardById(cardId).subscribe(response => {
        this.card = response.data; // La API devuelve un objeto con `data`
        console.log("Carta cargada:", this.card);
      });
    }

    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }
}
