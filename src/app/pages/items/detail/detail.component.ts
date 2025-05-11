import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../../services/search/search.service';
import { HeaderComponent } from "../../../main-components/header/header.component";
import { ThemeService } from '../../../../services/theme/theme.service';
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
    private themeService: ThemeService,
    private searchService: SearchService,
    private router: Router,
    private cartService: CartService
  ) { }

  addToCart(product: any) {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.cardmarket.prices.averageSellPrice,
      image: product.images.small,
      quantity: 1
    };
    //console.log(item)
    this.cartService.addToCart(item);
  }

  backToProducts() {
    if (this.card && this.card.id_set) {
      this.searchService.setCategory(this.card.id_set); // Emitimos el ID del set
    }
    this.router.navigate(['/home/products']);
  }

  ngOnInit(): void {
    this.searchService.selectedCard$.subscribe(card => {
      if (card && card.description) {
        try {
          this.card = JSON.parse(card.description);
          console.log('Carta parseada:', this.card);
        } catch (e) {
          console.error('Error al parsear la descripción de la carta:', e);
        }
      } else {
        console.error('No hay carta seleccionada o no tiene descripción.');
      }
    });
  
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }
  
}
