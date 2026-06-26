import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../../core/services/search.service';
import { Api2Service } from '../../../../core/services/api2.service';

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

  constructor(
    private searchService: SearchService,
    private router: Router,
    private api2Service: Api2Service
  ) { }

  selectCategory(category: string) {
    this.searchService.setCategory(category);
    this.router.navigate(['home/products']);
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
      this.api2Service.getCategories().subscribe({
        next: (categories) => {
          const activeSets = ['xy1', 'sm1', 'swsh1', 'swsh2', 'sv01', 'sv02'];
          this.sets = categories.filter((c: any) => activeSets.includes(c.id_set));
        },
        error: (error) => {
          console.error('Error loading categories:', error);
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

    // If the screen width is less than 768px, we show 3 items
    if (this.screenWidth < 768) {
      numVisibleItems = 3; // Show only 3 items
      //console.log("Mobile Mode")
    } else {
      numVisibleItems = 5; // Show 5 items on larger screens
      //console.log("Desktop Mode")

    }

    // Logic to get indices of visible items
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