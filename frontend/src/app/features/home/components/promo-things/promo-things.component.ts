import { Component, OnInit } from '@angular/core';
import { Api2Service } from '../../../../core/services/api2.service';
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
      id: 'base1-1',
      name: 'Alakazam',
      image: 'https://assets.tcgdex.net/en/base/base1/1/low.webp',
      setName: 'Base Set'
    },
    {
      id: 'base1-4',
      name: 'Charizard',
      image: 'https://assets.tcgdex.net/en/base/base1/4/low.webp',
      setName: 'Base Set'
    },
    {
      id: 'base1-2',
      name: 'Blastoise',
      image: 'https://assets.tcgdex.net/en/base/base1/2/low.webp',
      setName: 'Base Set'
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

  constructor(private api2Service: Api2Service) {}

  ngOnInit(): void {
    this.loadSets();
  }

  loadSets(): void {
    this.api2Service.getCategories().subscribe({
      next: (categories: any[]) => {
        // Map set IDs to series names for classic Pokémon sets
        const seriesMap: { [key: string]: string } = {
          'base1': 'Base',
          'base2': 'Base',
          'base3': 'Base',
          'neo1': 'Neo',
          'ex1': 'EX',
          'swsh1': 'Sword & Shield',
          'sv01': 'Scarlet & Violet'
        };

        const mappedSets = categories.map((cat: any) => {
          return {
            id: cat.id_set,
            name: cat.name,
            series: seriesMap[cat.id_set] || 'Other Series',
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
