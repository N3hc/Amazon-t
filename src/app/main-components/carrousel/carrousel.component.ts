import { Component, HostListener, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from '../../../services/search/search.service';
import { CardsApiService } from '../../../services/api/cards-api.service';

@Component({
  selector: 'app-carrousel',
  standalone: true,
  imports: [],
  templateUrl: './carrousel.component.html',
  styleUrl: './carrousel.component.css'
})
export class CarrouselComponent implements OnInit {
  isDarkMode: boolean = false;
  sets: any[] = [];
  currentIndex = 0;
  screenWidth: number = window.innerWidth;

  constructor(private cardsApiService: CardsApiService,
    private searchService: SearchService
  ) { }

  selectCategory(category: string) {
    this.searchService.setCategory(category);
  }


  ngOnInit(): void {
    this.loadSets();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      this.isDarkMode = false;
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  loadSets(): void {
    this.cardsApiService.getPokemonAllSets().subscribe({
      next: (sets) => {
        this.sets = this.shuffleArray(sets.data);
        console.log(sets)
      },
      error: (error) => {
        console.error('Error al cargar los sets:', error);
      }
    });
  }


  move(direction: number): void {
    const totalItems = this.sets.length;
    this.currentIndex = (this.currentIndex + direction + totalItems) % totalItems;
  }

  getVisibleIndices(): number[] {
    const totalItems = this.sets.length;
    const visibleIndices = [];
    let numVisibleItems: number;

    // Si el ancho de la pantalla es menor que 768px, mostramos 1 o 2 elementos
    if (this.screenWidth < 768) {
      numVisibleItems = 3; // Mostrar solo 1 elemento
      console.log("Modo Movil")
    } else {
      numVisibleItems = 5; // Mostrar 5 elementos en pantallas más grandes
      console.log("Modo Ordenador")

    }

    // Lógica para obtener los índices de los elementos visibles
    for (let i = -(numVisibleItems - 1) / 2; i <= (numVisibleItems - 1) / 2; i++) {
      const index = (this.currentIndex + i + totalItems) % totalItems;
      visibleIndices.push(index);
    }

    return visibleIndices;
  }

  trackByIndex(index: number): number {
    return index;
  }

  shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = window.innerWidth;
  }
}