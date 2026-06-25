import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchService } from '../../../core/services/search.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ThemeService } from '../../../core/services/theme.service';
import { ProductListComponent } from '../components/product-list-grid/product-list.component';
import { CarrouselComponent } from '../../home/components/carrousel/carrousel.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, ProductListComponent, CarrouselComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
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
