import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ThemeService } from '../../../core/services/theme.service';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/interfaces/productos.interface';
import { Api2Service } from '../../../core/services/api2.service';
import { TicketsService } from '../../../core/services/tickets.service';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [HeaderComponent, FormsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent {

  selectedProduct: { id: number, price: number } = { id: 0, price: 0 };

  selectedPrice: number = 0;
  isDarkMode = false;
  card: any;
  cardid: any;
  ProductCard: any;
  user: any;
  routes = "assets/energy/";

  constructor(
    private api2Service: Api2Service,
    private themeService: ThemeService,
    private searchService: SearchService,
    private router: Router,
    private cartService: CartService,
    private ticketsService: TicketsService,
    private userService: UserService,
  ) { }

  addToCart(product: any) {
    const item: CartItem = {
      id: String(this.selectedProduct.id),
      name: product.name,
      price: this.selectedProduct.price,
      image: product.images.small,
      quantity: 1
    };
    //console.log(item)
    this.cartService.addToCart(item);
    this.ticketsService.addProductToTicket(this.selectedProduct.id, 1, this.selectedProduct.price,this.user.id);
  }

  backToProducts() {
    if (this.card && this.card.id_set) {
      this.searchService.setCategory(this.card.id_set); // Emit the set ID
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
          console.error('Error parsing card description:', e);
        }
      } else {
        console.error('No card selected or card has no description.');
      }
    });

    this.api2Service.getProductByCardId(this.cardid).subscribe((data: any) => {
      this.ProductCard = data;
      console.log('Card retrieved:', this.ProductCard);
    });
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        if (user) {
          console.log('User loaded:', user);
        } else {
          console.log('No user in localStorage');
        }
      },
      error: (err) => {
        console.error('Error retrieving user:', err);
      }
    });
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  getStateLabel(state: number): string {
    switch (state) {
      case 0: return 'Poor';
      case 1: return 'Fair';
      case 2: return 'Good';
      case 3: return 'Very Good';
      case 4: return 'Excellent';
      default: return 'Unknown';
    }
  }


}