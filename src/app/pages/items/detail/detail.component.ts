import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../../services/search/search.service';
import { HeaderComponent } from "../../../main-components/header/header.component";
import { ThemeService } from '../../../../services/theme/theme.service';
import { CartService } from '../../../../services/cart/cart.service';
import { CartItem } from '../../../../interface/productos.interface';
import { Api2Service } from '../../../../services/api/api2.service';

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
  cardid: any;
  routes = "assets/energy/";

  constructor(
    private api2Service: Api2Service,
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
          this.cardid = card.id;
          this.card = JSON.parse(card.description);
        } catch (e) {
          console.error('Error al parsear la descripción de la carta:', e);
        }
      } else {
        console.error('No hay carta seleccionada o no tiene descripción.');
      }
    });
    
    this.api2Service.getProductByCardId(this.cardid).subscribe((data: any) => { 
      this.card = data.find((item: any) => item.id === this.card.id);
      console.log('Carta obtenida:', this.card);
    }
    );
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }
  
}
