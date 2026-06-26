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
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { LanguageService } from '../../../core/services/language.service';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [HeaderComponent, FormsModule, TranslatePipe],
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
  rawCard: any;

  energyMap: { [key: string]: string } = {
    // English
    'colorless': 'Colorless',
    'darkness': 'Darkness',
    'dragon': 'Dragon',
    'fairy': 'Fairy',
    'fighting': 'Fighting',
    'fire': 'Fire',
    'grass': 'Grass',
    'lightning': 'Lightning',
    'metal': 'Metal',
    'psychic': 'Psychic',
    'water': 'Water',
    
    // Spanish translations from TCGdex API
    'incolora': 'Colorless',
    'incoloro': 'Colorless',
    'oscuridad': 'Darkness',
    'dragón': 'Dragon',
    'hada': 'Fairy',
    'lucha': 'Fighting',
    'fuego': 'Fire',
    'planta': 'Grass',
    'rayo': 'Lightning',
    'metalica': 'Metal',
    'metálica': 'Metal',
    'psíquico': 'Psychic',
    'psiquico': 'Psychic',
    'psíquica': 'Psychic',
    'psiquica': 'Psychic',
    'agua': 'Water'
  };

  getEnergyImage(energy: string): string {
    const key = energy.toLowerCase().trim();
    const mapped = this.energyMap[key] || energy;
    return `${this.routes}${mapped}.png`;
  }

  handleImageError(event: any): void {
    if (this.rawCard && this.rawCard.image_large_en && event.target.src !== this.rawCard.image_large_en) {
      event.target.src = this.rawCard.image_large_en;
    }
  }

  constructor(
    private api2Service: Api2Service,
    private themeService: ThemeService,
    private searchService: SearchService,
    private router: Router,
    private cartService: CartService,
    private ticketsService: TicketsService,
    private userService: UserService,
    private langService: LanguageService,
    private route: ActivatedRoute
  ) { }

  addToCart(product: any) {
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
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

  loadProductDetails(): void {
    if (!this.cardid) return;
    this.api2Service.getProductByCardId(this.cardid).subscribe((data: any) => {
      this.ProductCard = data;
      if (data && data.length > 0) {
        this.selectedProduct = data[0];
      }
      console.log('Card retrieved:', this.ProductCard);
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.cardid = id;
        
        // First try to get card from searchService
        let hasLoadedFromService = false;
        this.searchService.selectedCard$.subscribe(card => {
          if (card && String(card.id) === String(id) && card.description) {
            try {
              this.rawCard = card;
              this.card = JSON.parse(card.description);
              hasLoadedFromService = true;
              this.loadProductDetails();
            } catch (e) {
              console.error('Error parsing card description:', e);
            }
          }
        });

        // If not loaded from searchService, fetch from backend API
        if (!hasLoadedFromService) {
          this.api2Service.getCardsById(id).subscribe({
            next: (response: any) => {
              if (response) {
                this.rawCard = response;
                this.card = JSON.parse(response.description);
                this.searchService.setCard(response);
                this.loadProductDetails();
              }
            },
            error: (err) => {
              console.error('Error fetching card by ID:', err);
            }
          });
        }
      }
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
      case 0: return this.langService.translate('poor');
      case 1: return this.langService.translate('fair');
      case 2: return this.langService.translate('good');
      case 3: return this.langService.translate('very_good');
      case 4: return this.langService.translate('excellent');
      default: return 'Unknown';
    }
  }


}