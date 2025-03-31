import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  isDarkMode: boolean = false;

  constructor(
    private themeService: ThemeService, 
    private router: Router
  ) {}


  ngOnInit() {
    // Cargar el tema guardado desde localStorage
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  goToHome(){
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToCard() {
    this.router.navigate(['/cart'])
  }
}
