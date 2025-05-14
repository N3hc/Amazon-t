import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../main-components/header/header.component";
import { ThemeService } from '../../../services/theme/theme.service';
import { CartItem } from '../../../interface/productos.interface';
import { Router } from '@angular/router';
import { TicketsService } from '../../../services/tickets/tickets.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  isDarkMode = false;
  cart: CartItem[] = [];
  userId: number | null = null;

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private ticketsService: TicketsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Tema oscuro
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });

    // Obtener usuario y cargar carrito
    this.userService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.userId = user.id;
          console.log('Usuario cargado:', user);
          this.loadCart(); // Solo cargamos carrito si hay usuario
        } else {
          console.log('No hay usuario en el localStorage');
        }
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err);
      }
    });
  }

  loadCart() {
    const savedCart = localStorage.getItem('cart');
    this.cart = savedCart ? JSON.parse(savedCart) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  syncItemToTicket(item: CartItem) {
    if (!this.userId) return;

    this.ticketsService.getUserLastTicketId(this.userId); // Asegura que haya ticket
    this.ticketsService.addProductToTicket(+item.id, item.quantity, item.price, this.userId);
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    const item = this.cart.find(i => i.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
      this.syncItemToTicket(item);
    }
  }

  increaseQuantity(itemId: string): void {
    const item = this.cart.find(item => item.id === itemId);
    if (item) {
      item.quantity += 1;
      this.saveCart();
      this.syncItemToTicket(item);
    }
  }

  decreaseQuantity(itemId: string): void {
    const item = this.cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.saveCart();
      this.syncItemToTicket(item);
    }
  }

  removeFromCart(itemId: string): void {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveCart();
    // Aquí podrías también eliminar del ticket si tienes el ID de línea
  }

  getSubtotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() > 50 ? 0 : 5;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  proceedToCheckout(): void {
    this.router.navigate(['cart/payment']);
  }

  continueShopping(): void {
    this.router.navigate(['/home/products']);
  }
}
