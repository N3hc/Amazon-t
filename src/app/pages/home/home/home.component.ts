import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../main-components/header/header.component';
import { CarrouselComponent } from '../../../main-components/carrousel/carrousel.component';
import { PromoThingsComponent } from '../../../sub-components/promo-things/promo-things.component';
import { FooterComponent } from "../../../main-components/footer/footer.component";
import { ThemeService } from '../../../../services/theme/theme.service';
import { SearchService } from '../../../../services/search/search.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CarrouselComponent, FooterComponent, PromoThingsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isDarkMode = false;

  selectedProduct: any = null;
  selectedCategory: any = null;

  onProductSelected(product: any) {
    this.selectedProduct = product;
  }

  constructor(private themeService: ThemeService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
    this.searchService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category;
    });
  }

   isEditing = false;
  
  user = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  orders = [
    { id: '1234', date: new Date(), total: 89.99, status: 'Delivered' },
    { id: '5678', date: new Date(), total: 149.99, status: 'Pending' }
  ];

  paymentMethods = [
    { id: 1, last4: '4242', expiry: '12/25' },
    { id: 2, last4: '3579', expiry: '03/27' }
  ];

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    // Lógica para guardar los cambios
    this.isEditing = false;
  }
}
