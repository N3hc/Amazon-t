import { Component } from '@angular/core';
import { HeaderComponent } from "../../main-components/header/header.component";
import { ThemeService } from '../../../services/theme/theme.service';
import { CartItem } from '../../../interface/productos.interface';
import { CartService } from '../../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  isDarkMode = false;

  constructor(private cartService: CartService,
    private themeService: ThemeService
  ) {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  cart: CartItem[] = [];


  removeFromCart(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }
}
