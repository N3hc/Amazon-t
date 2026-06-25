import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Api2Service } from '../../../core/services/api2.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user.interface';
import { Router } from '@angular/router';
import { Product } from '../../../core/interfaces/productos.interface';
import { CardObject } from '../../../core/interfaces/card.interface';
import { forkJoin } from 'rxjs'


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  @Input() userId!: number;
  @Input() isDarkMode: boolean = false;
  @Input() isEditMode: boolean = false;

    productoForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.min(0)]),
    cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
  });

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
        console.warn('No user loaded');
        this.router.navigate(['/home']);
        return;
      }
      this.user = user;
      forkJoin({
        products: this.api2Service.getProductsByUser(this.user.id),
        cards: this.api2Service.getCards()
      }).subscribe({
        next: ({ products, cards }) => {
          // Sort products by id_card (ascending)
          this.product = products.sort((a:any, b:any) => Number(a.id_card) - Number(b.id_card));

          // Create a set of valid id_cards
          const validIds = new Set(this.product?.map(p => p.id_card) || []);

          // Filter only cards that have an id present in id_card
          this.cards = cards.filter((card: CardObject) => validIds.has(card.id));

          console.log('Filtered cards:', this.cards);
        },
        error: (err) => {
          console.error('Error loading products or cards:', err);
        },
      });
  }
  )};
  editIndex = signal<number | null>(null);

  startEdit(index: number) {
    if (this.product && this.product[index]) {
      this.productoForm.setValue({
        id: this.product[index].id.toString(),
        precio: this.product[index].price.toString(),
        cantidad: this.product[index].quantity.toString()
      });
      this.editIndex.set(index);
    }
  }


  cancelEdit() {
    this.editIndex.set(null);
  }

  saveEdit() {
    // If you want to save changes to the backend, the logic goes here
    this.editIndex.set(null);
  }

  onSubmit() {
    if (this.productoForm.valid) {
      const formValue = this.productoForm.value;
      const index = this.editIndex();

      if (index !== null && this.product && formValue) {
        this.product[index] = {
          ...this.product[index],
          price: Number(formValue.precio),
          quantity: Number(formValue.cantidad)
        };
        this.cancelEdit();
        console.log('Updated product:', this.product[index]);
        this.api2Service.updateProduct(this.product[index]).subscribe({
          next: (response) => {
            console.log('Product updated in backend:', response);
          },
          error: (error) => {
            console.error('Error updating product:', error);
          }
        });
        
      }

      } else {
      console.log('Invalid form');
    }
  }


  deleteCard(index: number) {
    if (this.product && this.cards) {
      const cardIdToDelete = this.product[index].id;

              this.product[index] = {
          ...this.product[index],
          deleted: 1,
        };

      this.api2Service.updateProduct(this.product[index]).subscribe({
        next: (response) => {
          console.log('Card deleted:', response);
        },
        error: (error) => {
          console.error('Error deleting card:', error);
        }
      });

      // Remove from the cards array
      this.cards.splice(index, 1);

      // Also delete the corresponding product
      this.product = this.product.filter(p => p.id_card !== cardIdToDelete);
    }
  }


  }
