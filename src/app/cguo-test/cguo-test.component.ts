import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentComponent } from '../pages/cart/payment/payment.component';
import { User } from '../../interface/user.interface';
import { Ticket } from '../../interface/ticket.interface';
import { PaymentFormComponent } from "../sub-components/payment-form/payment-form.component";
import { AddressFormComponent } from '../sub-components/address-form/address-form.component';

@Component({
  selector: 'app-cguo-test',
  standalone: true,
  imports: [ReactiveFormsModule, PaymentComponent, PaymentFormComponent, AddressFormComponent],
  templateUrl: './cguo-test.component.html',
  styleUrl: './cguo-test.component.css'
})
export class CguoTestComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  showPassword = false;
  showOldPassword = false;
  selectedTicket: Ticket | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: [this.User.name, Validators.required],
      surname: [this.User.surname, Validators.required],
      email: [this.User.email, [Validators.required, Validators.email]],
      username: [this.User.username, Validators.required],
      birthDate: [this.User.birthDate, Validators.required],
      gender: [this.User.gender, Validators.required],
      password: [this.User.password, [Validators.required, Validators.minLength(6)]],
      oldPassword: [this.User.oldPassword, Validators.required],
      role: this.User.role,
      vendor: this.User.vendor,
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Formulario enviado:', this.userForm.value);
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  User: User = {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    name: 'John',
    surname: 'Doe',
    password: '',
    oldPassword: '',
    role: 1,
    birthDate: '1990-01-01',
    vendor: 0,
    gender: 1,
    createdAt: '2024-01-01'
  };

  completedTickets: Ticket[] = [
    {
      id: 1,
      id_user: 123,
      id_address: 456,
      total: 149.99,
      completed: true,
      deleted: false,
      createdAt: new Date('2024-03-15').toISOString(),
      ticketLines: [
        {
          id: 1,
          id_ticket: 1,
          id_product: 101,
          quantity: 2,
          price: 25.99,
          deleted: false,
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 12345,
      id_user: 987,
      id_address: 456,
      total: 147.50,
      completed: true,
      deleted: false,
      createdAt: new Date().toISOString(),
      ticketLines: [
        {
          id: 1,
          id_ticket: 12345,
          id_product: 101,
          quantity: 2,
          price: 25.99,
          deleted: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          id_ticket: 12345,
          id_product: 205,
          quantity: 1,
          price: 95.52,
          deleted: false,
          createdAt: new Date().toISOString()
        }
      ]
    },
  ];


  paymentMethods = [
    { id: 1, last4: '4242', expiry: '12/25' },
    { id: 2, last4: '3579', expiry: '03/27' }
  ];

  showTicketDetails(ticket: Ticket): void {
    this.selectedTicket = this.selectedTicket?.id === ticket.id ? null : ticket;
  }

  parseDate(dateString: string | Date): Date {
    return new Date(dateString);
  }

  // Función para formatear moneda manualmente
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  }

}
