import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../interface/productos.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable(); // Observable del carrito

  constructor() {
    this.loadCart(); // Cargar datos guardados
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
  }

  addToCart(item: CartItem) {
    const index = this.cart.findIndex((p) => p.id === item.id);
    if (index !== -1) {
      this.cart[index].quantity += item.quantity;
    } else {
      this.cart.push(item);
    }
    this.cartSubject.next([...this.cart]);
    this.saveCart();
  }

  removeFromCart(itemId: string) {
    this.cart = this.cart.filter((item) => item.id !== itemId);
    this.cartSubject.next([...this.cart]);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.cartSubject.next([]);
    localStorage.removeItem('cart');
  }
}