import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme/theme.service';
import { CartService } from '../../../services/cart/cart.service';
import { CartItem } from '../../../interface/productos.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isDarkMode: boolean = false;
  cart: CartItem[] = [];
  loggedIn: boolean = true; // Cambia esto según tu lógica de autenticación

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private cartService: CartService
  ) {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
  }

  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }


  ngOnInit() {
    // Cargar el tema guardado desde localStorage
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToLogin() {
    if (this.loggedIn) {
      this.router.navigate(['/user'])
    } else {
      this.router.navigate(['/login'])
    };
  }

  goToCard() {
    this.router.navigate(['/cart'])
  }

}
