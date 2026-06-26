import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/interfaces/productos.interface';
import { UserService } from '../../../core/services/user.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isDarkMode: boolean = false;
  user: any = null; // Change this according to your user logic
  cart: CartItem[] = [];
  loggedIn: boolean = false; // Change this according to your authentication logic

  showUserMenu: boolean = false;

  handleClick(): void {
    if (this.loggedIn) {
      this.toggleUserMenu();
    } else {
      this.goToLogin();
    }
  }
  
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  viewProfile(event: Event) {
    event.stopPropagation();
    this.router.navigate(['/user']);
    this.showUserMenu = false;
  }

  logout(event: Event) {
    event.stopPropagation();
    this.userService.clearUser();
    this.loggedIn = false;
    this.user = null;
    this.showUserMenu = false;
    this.router.navigate(['/login']);
  }

  constructor(
    private themeService: ThemeService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    public langService: LanguageService
  ) {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
  }

  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  ngOnInit() {
    // Load the saved theme from localStorage
    this.themeService.theme$.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
    });

    if (this.userService.isLogged()) {
      // Subscribe to the observable to get the user
      this.userService.getUser().subscribe((user) => {
        this.user = user;
        this.loggedIn = true; // Mark as logged in
        //console.log(this.user); // Check if the user is loaded correctly
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
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToCard() {
    this.router.navigate(['/cart']);
  }
}
