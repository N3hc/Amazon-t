import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, Form } from '@angular/forms';
import { HeaderComponent } from '../../main-components/header/header.component';
import { ThemeService } from '../../../services/theme/theme.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../interface/user.interface';
import { Api2Service } from '../../../services/api/api2.service';
import { PaymentFormComponent } from '../../sub-components/payment-form/payment-form.component';
import { AddressFormComponent } from '../../sub-components/address-form/address-form.component';
import { Ticket } from '../../../interface/ticket.interface';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, PaymentFormComponent, AddressFormComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  showPassword = false;
  showOldPassword = false;
  selectedTicket: Ticket | null = null;
  isDarkMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private themeService: ThemeService,
    private api2Service: Api2Service
  ) { }

    ngOnInit(): void {
    this.userService.getUser().subscribe((user: User | null) => {
      if (!user) {
        console.warn('No hay usuario cargado');
        this.router.navigate(['/home']);
        return;
      }

      this.userForm = this.fb.group({
        id: [user.id],
        name: [user.name, Validators.required],
        surname: [user.surname, Validators.required],
        email: [user.email, [Validators.required, Validators.email]],
        username: [user.username, Validators.required],
        birthDate: [user.birthDate, Validators.required],
        gender: [this.mapGender(user.gender), [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: [user.role],
        vendor: [user.vendor],
      });

      // Tema oscuro
      this.themeService.theme$.subscribe(theme => {
        this.isDarkMode = theme === 'dark';
      });
    });
  }

    private mapGender(value: number): number {
    return value;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    const fieldsToToggle = [
      'username', 'email', 'name', 'surname', 'birthDate',
      'gender', 'vendor', 'password'
    ];

    fieldsToToggle.forEach(field => {
      const control = this.userForm.get(field);
      if (this.isEditMode) {
        control?.enable();
      } else {
        control?.disable();
      }
    });
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData = { ...this.userForm.value };

    // Si no hay contraseña, elimínala antes de enviar
    if (!userData.password) {
      delete userData.password;
    }
    console.log('Datos del formulario:', userData);
    this.userService.updateUser(userData);
    this.api2Service.updateUser(userData).subscribe({
      next: (response) => {
        console.log('Usuario actualizado:', response);
        //this.userService.setUser(userData);
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    });
    this.router.navigate(['/user/profile']);
  }


  cancel(): void {
    this.router.navigate(['/user/profile']);
  }


  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const pwd = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (pwd || confirm) {
      return pwd === confirm ? null : { mismatch: true };
    }
    return null;
  }

    showTicketDetails(ticket: Ticket): void {
    this.selectedTicket = this.selectedTicket?.id === ticket.id ? null : ticket;
  }

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
}