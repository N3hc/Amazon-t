import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../main-components/header/header.component';
import { CarrouselComponent } from '../../../main-components/carrousel/carrousel.component';
import { PromoThingsComponent } from '../../../sub-components/promo-things/promo-things.component';
import { FooterComponent } from "../../../main-components/footer/footer.component";
import { ThemeService } from '../../../../services/theme/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CarrouselComponent, FooterComponent, PromoThingsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }
}
