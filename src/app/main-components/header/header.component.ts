import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme/theme.service';
import { CartService } from '../../../services/cart/cart.service';
import { CartItem } from '../../../interface/productos.interface';
import { UserService } from '../../../services/user/user.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  isDarkMode: boolean = false;
  user: any = null; // Cambia esto según tu lógica de usuario
  cart: CartItem[] = [];
  loggedIn: boolean = false; // Cambia esto según tu lógica de autenticación

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService
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

    if (this.userService.isLogged()) {
      // Suscribirse al observable para obtener el usuario
      this.userService.getUser().subscribe(user => {
        this.user = user;
        this.loggedIn = true;  // Marcar como logueado
        console.log(this.user);  // Verifica si el usuario se carga correctamente
      });
    }
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
