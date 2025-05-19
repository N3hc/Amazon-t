import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Api2Service } from '../../../../services/api/api2.service';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../interface/user.interface';
import { Router } from '@angular/router';
import { Product } from '../../../../interface/productos.interface';
import { CardObject } from '../../../../interface/card.interface';
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
    // Si quieres guardar cambios a backend, aquí va la lógica
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
        console.log('Producto actualizado:', this.product[index]);
        this.api2Service.updateProduct(this.product[index]).subscribe({
          next: (response) => {
            console.log('Producto actualizado en el backend:', response);
          },
          error: (error) => {
            console.error('Error al actualizar el producto:', error);
          }
        });
      }
    } else {
      console.log('Formulario inválido');
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
          console.log('Card eliminada:', response);
        },
        error: (error) => {
          console.error('Error al eliminar la card:', error);
        }
      });

      // Elimina del arreglo de cards
      this.cards.splice(index, 1);

      // También elimina el producto correspondiente
      this.product = this.product.filter(p => p.id_card !== cardIdToDelete);
    }
  }


  }
