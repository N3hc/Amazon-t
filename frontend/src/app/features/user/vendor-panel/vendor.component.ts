import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Api2Service } from '../../../core/services/api2.service';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';

interface Category {
  id: string;
  id_set: string;
  name: string;
  total_cards: string;
  logo: string;
  release_date: string;
}

interface Card {
  id: number;
  id_card: number;
  name: string;
  image_small: string;
  id_set: string;
}

interface ProductForm {
  quantity: number;
  price: number;
  state: number;
}

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  private apiService = inject(Api2Service);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  // Signals
  currentStep = signal(0);
  searchTerm = signal('');
  selectedSet = signal<Category | null>(null);
  selectedCard = signal<Card | null>(null);
  sets = signal<Category[]>([]);
  cards = signal<Card[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  currentUser = signal<any>(null);

  // Filtrado reactivo
  filteredSets = signal<Category[]>([]);

  // Formulario
  productForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      state: ['Nuevo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: any | null) => {
      this.currentUser.set(user);
      if (user) {
        this.loadCategories();
      }
    });
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.apiService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.sets.set(categories);
        this.filteredSets.set(categories);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error cargando los sets Pokémon');
        console.error(error);
        this.isLoading.set(false);
      }
    });
  }

loadCardsBySet(setId: string): void {
  this.isLoading.set(true);
  this.apiService.getCardsFromSet(setId).subscribe({
    next: (cards: Card[]) => {
      console.log('Cartas recibidas:', cards); // ← Añade esto para debug
      this.cards.set(cards);
      this.isLoading.set(false);
    },
    error: (error) => {
      console.error('Error en la API:', error); // ← Mejor logging
      this.errorMessage.set('Error cargando las cartas del set');
      this.isLoading.set(false);
    }
  });
}

  filterSets(search: string): void {
    this.searchTerm.set(search);
    const filtered = this.sets().filter(set =>
      set.name.toLowerCase().includes(search.toLowerCase()) ||
      set.id_set.toLowerCase().includes(search.toLowerCase())
    );
    this.filteredSets.set(filtered);
  }

  selectSet(set: Category): void {
    this.selectedSet.set(set);
    this.loadCardsBySet(set.id);
    this.nextStep();
  }

  selectCard(card: Card): void {
    this.selectedCard.set(card);
    this.nextStep();
  }

  nextStep(): void {
    this.currentStep.update(val => Math.min(val + 1, 2));
  }

  prevStep(): void {
    this.currentStep.update(val => Math.max(val - 1, 0));
  }

  canProceed(): boolean {
    switch (this.currentStep()) {
      case 0: return this.selectedSet() !== null;
      case 1: return this.selectedCard() !== null;
      case 2: return this.productForm.valid;
      default: return false;
    }
  }

  submitProduct(): void {
    if (!this.productForm.valid || !this.selectedCard() || !this.selectedSet()) return;
    console.log('Formulario enviado:', this.productForm.value); // ← Añade esto para debug

    const productData = {
      id_user: this.currentUser()?.id,
      id_card: this.selectedCard()?.id,
      ...this.productForm.value
    };

    this.apiService.storeProduct(productData).subscribe({
      next: () => {
        // Resetear formulario
        this.currentStep.set(0);
        this.selectedSet.set(null);
        this.selectedCard.set(null);
        this.productForm.reset({
          quantity: 1,
          price: null,
          state: 'Nuevo'
        });
        this.errorMessage.set('');
      },
      error: (error) => {
        this.errorMessage.set('Error publicando el producto');
        console.error(error);
      }
    });
  }

  // Helper para acceder fácil a los controles del formulario
  get f() {
    return this.productForm.controls;
  }
}