import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CarrouselComponent } from '../components/carrousel/carrousel.component';
import { PromoThingsComponent } from '../components/promo-things/promo-things.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/services/theme.service';
import { SearchService } from '../../../core/services/search.service';

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
}
