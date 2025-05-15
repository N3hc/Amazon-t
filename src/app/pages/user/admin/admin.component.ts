import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { Api2Service } from '../../../../services/api/api2.service';
import { UserService } from '../../../../services/user/user.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { User } from '../../../../interface/user.interface';
import { Router } from '@angular/router';
import { Product } from '../../../../interface/productos.interface';
import { Card } from '../../../../interface/carrousel.interface';
import { CardObject } from '../../../../interface/card.interface';
import { forkJoin } from 'rxjs'
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  @Input() userId!: number;
  @Input() isDarkMode: boolean = false;
  @Input() isEditMode: boolean = false;

  product: Product[] | null = null;
  cards: CardObject[] | null = null;
  user: User | null = null;
  temp: number[] = [];


  constructor(
    private userService: UserService,
    private api2Service: Api2Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch user details if userId is provided
    this.userService.getUser().subscribe((user: User | null) => {
      if (!user) {
        console.warn('No hay usuario cargado');
        this.router.navigate(['/home']);
        return;
      }
      this.user = user;
      forkJoin({
        products: this.api2Service.getProductsByUser(this.user.id),
        cards: this.api2Service.getCards()
      }).subscribe({
        next: ({ products, cards }) => {
          // Ordenar productos por id_card (de menor a mayor)
          this.product = products.sort((a:any, b:any) => Number(a.id_card) - Number(b.id_card));

          // Crear conjunto de id_card válidos
          const validIds = new Set(this.product?.map(p => p.id_card) || []);

          // Filtrar solo las cards que tengan un id presente en los id_card
          this.cards = cards.filter((card: CardObject) => validIds.has(card.id));

          console.log('Productos ordenados:', this.product);
          console.log('Cards filtradas:', this.cards);
        },
        error: (err) => {
          console.error('Error al cargar productos o cards:', err);
        },
      });
  }
  )};
  editIndex = signal<number | null>(null);

  startEdit(index: number) {
    this.editIndex.set(index);
  }

  cancelEdit() {
    this.editIndex.set(null);
  }

  saveEdit() {
    // Si quieres guardar cambios a backend, aquí va la lógica
    this.editIndex.set(null);
  }

  deleteCard(index: number) {

  }

  }
