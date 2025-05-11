import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../main-components/header/header.component';
import { CarrouselComponent } from '../../../main-components/carrousel/carrousel.component';
import { PromoThingsComponent } from '../../../sub-components/promo-things/promo-things.component';
import { FooterComponent } from "../../../main-components/footer/footer.component";
import { ThemeService } from '../../../../services/theme/theme.service';
import { SearchService } from '../../../../services/search/search.service';
import { CguoTestComponent } from '../../../cguo-test/cguo-test.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CarrouselComponent, FooterComponent, PromoThingsComponent, CguoTestComponent],
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
