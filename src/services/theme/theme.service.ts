import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(localStorage.getItem('theme') || 'light');
  theme$ = this.themeSubject.asObservable(); // Exponer un observable

  constructor() {
    this.setTheme(this.themeSubject.value);
  }

  toggleTheme() {
    const newTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme); // Notificar a los suscriptores del cambio
  }

  isDarkTheme(): boolean {
    return this.themeSubject.value === 'dark';
  }
}
