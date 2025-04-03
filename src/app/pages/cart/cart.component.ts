import { Component } from '@angular/core';
import { HeaderComponent } from "../../main-components/header/header.component";
import { ThemeService } from '../../../services/theme/theme.service';
import { CartItem } from '../../../interface/productos.interface';
import { CartService } from '../../../services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  isDarkMode = false;
  cart: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private themeService: ThemeService,
    private router: Router
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

  // Calcula el subtotal sin impuestos ni envío
  getSubtotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Calcula el costo de envío (gratis para compras mayores a $50)
  getShippingCost(): number {
    return this.getSubtotal() > 50 ? 0 : 5;
  }

  // Calcula el total incluyendo impuestos y envío
  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  // Método para proceder al pago
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  // Aumenta la cantidad de un producto
  increaseQuantity(itemId: string): void {
    const item = this.cart.find(item => item.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  // Disminuye la cantidad de un producto
  decreaseQuantity(itemId: string): void {
    const item = this.cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  // Elimina un producto del carrito
  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  // Redirige a la página de productos
  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}