import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api2Service } from '../../../../core/services/api2.service';
import { SearchService } from '../../../../core/services/search.service';
import { Card } from '../../../../core/interfaces/carrousel.interface';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-promo-things',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './promo-things.component.html',
  styleUrl: './promo-things.component.css'
})
export class PromoThingsComponent implements OnInit {
  anterior: number = 0;
  actual: number = 1;
  siguiente: number = 2;

  // Fallback initial cards before local database cards are loaded
  Cards: Card[] = [
    {
      id: 'sv01-001',
      name: 'Pineco',
      image: 'https://assets.tcgdex.net/es/sv/sv01/001/low.webp',
      setName: 'Escarlata y Púrpura'
    },
    {
      id: 'sv01-002',
      name: 'Heracross',
      image: 'https://assets.tcgdex.net/es/sv/sv01/002/low.webp',
      setName: 'Escarlata y Púrpura'
    },
    {
      id: 'sv01-004',
      name: 'Breloom',
      image: 'https://assets.tcgdex.net/es/sv/sv01/004/low.webp',
      setName: 'Escarlata y Púrpura'
    }
  ];

  siguienteProducto() {
    this.anterior = this.actual;
    this.actual = this.siguiente;
    this.siguiente = (this.siguiente + 1) % this.Cards.length;
  }

  anteriorProducto() {
    this.siguiente = this.actual;
    this.actual = this.anterior;
    this.anterior = (this.anterior - 1 + this.Cards.length) % this.Cards.length;
  }

  setOri: any[] = [];
  sets: any[] = [];
  any = 0;
  series: string[] = [];
  ids: string[] = [];

  constructor(
    private api2Service: Api2Service,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSets();
  }

  selectCategory(category: any): void {
    this.searchService.setCategory(category);
    this.router.navigate(['home/products']);
  }

  loadSets(): void {
    this.api2Service.getCategories().subscribe({
      next: (categories: any[]) => {
        // Map set IDs to series names for classic Pokémon sets dynamically
        const seriesMap: { [key: string]: string } = {
          'base': 'Original Series',
          'neo': 'Neo Series',
          'ecard': 'E-Card Series',
          'ex': 'EX Series',
          'dp': 'Diamond & Pearl',
          'pl': 'Platinum',
          'hgss': 'HeartGold & SoulSilver',
          'col': 'Call of Legends',
          'bw': 'Black & White',
          'xy': 'XY Series',
          'sm': 'Sun & Moon',
          'swsh': 'Sword & Shield',
          'sv': 'Scarlet & Violet',
          'pop': 'POP Series',
          'np': 'Nintendo Promos'
        };

        const mappedSets = categories.map((cat: any) => {
          let seriesId = 'other';
          if (cat.logo) {
            const parts = cat.logo.split('/');
            if (parts.length >= 6) {
              seriesId = parts[4].toLowerCase();
            }
          }
          if (seriesId === 'other' && cat.id_set) {
            const match = cat.id_set.match(/^([a-zA-Z]+)/);
            if (match) {
              seriesId = match[1].toLowerCase();
            }
          }

          const seriesName = seriesMap[seriesId] || (seriesId.toUpperCase() + ' Series');

          return {
            id: cat.id,
            name: cat.name,
            series: seriesName,
            releaseDate: cat.release_date || 'N/A',
            total: cat.total_cards || 0,
            images: {
              symbol: cat.symbol || '',
              logo: cat.logo || ''
            },
            legalities: {
              unlimited: cat.legal === 1 ? 'Legal' : 'Banned'
            }
          };
        });

        this.sets = mappedSets;
        this.setOri = mappedSets;

        // Use a Set to obtain unique series names for grouping
        const seriesSet = new Set<string>();
        const seriesSet2 = new Set<string>();
        this.sets.forEach((set) => seriesSet.add(set.series));
        this.sets.forEach((set) => seriesSet2.add(set.id));

        this.series = Array.from(seriesSet);
        this.ids = Array.from(seriesSet2);

        // Load cards from our local database to display in the slideshow
        this.loadSlideshowCards(categories);
      },
      error: (error) => {
        console.error('Error loading sets:', error);
      }
    });
  }

  loadSlideshowCards(categories: any[]): void {
    this.api2Service.getCards().subscribe({
      next: (cards: any[]) => {
        if (cards && cards.length > 0) {
          // Index sets by their database ID for quick name lookup
          const setMap = new Map<number, string>();
          categories.forEach(c => setMap.set(c.id, c.name));

          // Filter cards that have images, select the first 16, and map them
          const slideshowCards = cards
            .filter(c => c.image_large || c.image_small)
            .slice(0, 16)
            .map((c: any) => {
              return {
                id: c.id_card,
                name: c.name,
                image: c.image_large || c.image_small,
                setName: setMap.get(c.id_set) || 'Pokémon Set'
              };
            });

          if (slideshowCards.length > 0) {
            this.Cards = slideshowCards;
            // Reset slideshow navigation indices
            this.anterior = 0;
            this.actual = Math.min(1, slideshowCards.length - 1);
            this.siguiente = Math.min(2, slideshowCards.length - 1);
          }
        }
      },
      error: (err) => {
        console.error('Error loading local cards for slideshow:', err);
      }
    });
  }

  SearchTime(): void {
    this.sets = [...this.sets].sort((a: any, b: any) => a.releaseDate.localeCompare(b.releaseDate));
    this.any = 1;
  }

  totalSearchSets(): void {
    this.sets = [...this.sets].sort((a: any, b: any) => a.total - b.total);
    this.any = 1;
  }

  originalPos(): void {
    this.sets = this.setOri;
    this.any = 0;
  }
}
