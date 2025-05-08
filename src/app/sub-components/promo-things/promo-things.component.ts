import { Component } from '@angular/core';
import { CardsApiService } from '../../../services/api/cards-api.service';
import { Card } from '../../../interface/carrousel.interface';

@Component({
  selector: 'app-promo-things',
  standalone: true,
  imports: [],
  templateUrl: './promo-things.component.html',
  styleUrl: './promo-things.component.css'
})
export class PromoThingsComponent {
  anterior: number = 0;
  actual: number = 1;
  siguiente: number = 2;

  

  Cards: Card[] = [
    {
      id: 'dp5-98',
      name: 'Glaceon',
      image: 'https://images.pokemontcg.io/dp5/98.png',
      setName: 'Majestic Dawn'
    },
    {
      id: 'sv2-222',
      name: 'Tyranitar',
      image: 'https://images.pokemontcg.io/sv2/222.png',
      setName: 'Paldea Evolved'
    },
    {
      id: 'pl2-109',
      name: 'Luxray GL',
      image: 'https://images.pokemontcg.io/pl2/109.png',
      setName: 'Rising Rivals'
    },
    {
      id: 'sm75-78',
      name: 'Ultra Necrozma GX',
      image: 'https://images.pokemontcg.io/sm75/78.png',
      setName: 'Dragon Majesty'
    },
    {
      id: 'sm12-249',
      name: 'Venusaur & Snivy-GX',
      image: 'https://images.pokemontcg.io/sm12/249.png',
      setName: 'Cosmic Eclipse'
    },
    {
      id:'swsh10tg-TG23',
      name:'Garchomp V',
      image:'https://images.pokemontcg.io/swsh10tg/TG23.png',
      setName:'Astral Radiance'
    },
    {
      id:'sv7-173',
      name:'Terapagos Ex',
      image:'https://images.pokemontcg.io/sv7/170.png',
      setName:'Stellar  Crown'
    },
    {
      id:'xy4-65a',
      name:'Aegislash Ex',
      image:'https://images.pokemontcg.io/xy4/65a.png',
      setName:'Phantom Forces'
    },
    {
      id:'neo4-10',
      name:'Dark Typhlosion',
      image:'https://images.pokemontcg.io/neo4/10.png',
      setName:'Neo Destiny'
    },
    {
      id:'pl4-SH11',
      name:'Rapidash',
      image:'https://images.pokemontcg.io/pl4/SH11.png',
      setName:'Arceus'
    },
    {
      id:'sm11-71',
      name:'Mewtwo & Mew GX',
      image:'https://images.pokemontcg.io/sm11/71.png',
      setName:'Unified Minds'
    },
    {
      id:'col1-33',
      name:'Snorlax',
      image:'https://images.pokemontcg.io/col1/33.png',
      setName:'Call of Legends'
    },
    {
      id:'sv4-248',
      name:'Iron Hands Ex',
      image:'https://images.pokemontcg.io/sv4/248.png',
      setName:'Parados Rift'
    },
    {
      id:'swsh7-14',
      name:'Trevenant VMAX',
      image:'https://images.pokemontcg.io/swsh7/14.png',
      setName:'Evolving Skies'
    },
    {
      id:'neo1-14',
      name:'Slowking',
      image:'https://images.pokemontcg.io/neo1/14.png',
      setName:'Unseen Forces'
    },
    {
      id:'bw4-72',
      name:'Shiftry',
      image:'https://images.pokemontcg.io/bw4/72.png',
      setName:'Next Destinies'
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
  sets:any [] = [];
  any = 0;
  series: string[] = [];
  ids: string[] = [];

    constructor(private cardsApiService: CardsApiService
    ) {}

    loadSets(): void {

      this.cardsApiService.getPokemonAllSets().subscribe({
        next: (sets) => {
          const set = sets.data;

          this.sets = set;
          this.setOri = set;

          // Usar un Set para obtener valores únicos
          const seriesSet = new Set<string>();
          const seriesSet2 = new Set<string>();
          this.sets.forEach((set) => seriesSet.add(set.series));
          this.sets.forEach((set) => seriesSet2.add(set.id));

          // Convertir el Set de nuevo a un array
          this.series = Array.from(seriesSet);
          this.ids = Array.from(seriesSet2);

          //console.log(sets);
          //console.log(this.series);
          //console.log(this.ids);
        },
        error: (error) => {
          console.error('Error al cargar los sets:', error);
        }
      });
    }

    ngOnInit(): void {
      this.loadSets();
    }

    SearchTime(): void {
      this.sets = this.sets.sort((a: any, b: any) => a.releaseDate.localeCompare(b.releaseDate));
      this.any = 1;
    }

    totalSearchSets(): void {
      this.sets = this.sets.sort((a: any, b: any) => a.total - b.total);
      this.any = 1;
    }

    originalPos(): void {
      this.sets = this.setOri;
      this.any = 0;
    }

}
