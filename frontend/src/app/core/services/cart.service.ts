  import { Injectable } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';
  import { CartItem } from '../interfaces/productos.interface';
  @Injectable({
    providedIn: 'root'
  })
  export class CartService {
    private cartSubject = new BehaviorSubject<CartItem[]>([]);
    cart$ = this.cartSubject.asObservable();

    constructor() {
      this.loadInitialCart();
    }
    
    // Métodos existentes (no modificados)
    private loadInitialCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartSubject.next(JSON.parse(savedCart));
      }
    }

    private saveCartToLocalStorage(cart: CartItem[]) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    addToCart(item: CartItem) {
      const currentCart = this.cartSubject.value;
      const existingItem = currentCart.find(i => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        currentCart.push({...item});
      }

      this.cartSubject.next([...currentCart]);
      this.saveCartToLocalStorage(currentCart);
    }

    removeFromCart(itemId: string) {
      const updatedCart = this.cartSubject.value.filter(item => item.id !== itemId);
      this.cartSubject.next(updatedCart);
      this.saveCartToLocalStorage(updatedCart);
    }

    // Métodos adicionales requeridos por el componente
    updateQuantity(itemId: string, newQuantity: number): void {
      const updatedCart = this.cartSubject.value.map(item => 
        item.id === itemId ? {...item, quantity: newQuantity} : item
      );
      this.cartSubject.next(updatedCart);
      this.saveCartToLocalStorage(updatedCart);
    }

    clearCart(): void {
      this.cartSubject.next([]);
      localStorage.removeItem('cart');
    }

    // Método auxiliar para calcular el total de items (opcional)
    getTotalItems(): number {
      return this.cartSubject.value.reduce((total, item) => total + item.quantity, 0);
    }
  }