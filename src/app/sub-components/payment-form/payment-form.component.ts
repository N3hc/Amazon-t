import { Component, Input} from '@angular/core';
import { Payment } from '../../../interface/payment.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { OnInit } from '@angular/core';
import { Api2Service } from '../../../services/api/api2.service';
import { User } from '../../../interface/user.interface';


@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [ReactiveFormsModule, ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})

export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
  addingCard = false;



  @Input() enableSelection: boolean = false;

  selectedCardId: number | null = null;

  onCardSelect(cardId: number) {
    if (this.enableSelection) {
      this.selectedCardId = this.selectedCardId === cardId ? null : cardId;
    }
  }

user: User | null = null;

ngOnInit() {
  this.userService.getUser().subscribe((user: User | null) => {
    console.log('Usuario actual:', user);
    this.user = user;

    if (!user) {
      console.warn('No hay usuario cargado');
      return;
    }

    this.api2service.getPagosByUser(user.id).subscribe((pagos: Payment[]) => {
      this.examplePayments = pagos;
      console.log('Pagos del usuario:', this.examplePayments);
    });
  });
}


   examplePayments: Payment[] = [
    {
      id: 1,
      id_user: 1,
      name: 'Visa',
      number: '4111111111111111',
      expiration_date: '12/25',
      cvv: '123',
      delated: false,
      createdAt: '2024-03-01T10:30:00.000Z'
    },
    {
      id: 2,
      id_user: 1,
      name: 'Mastercard',
      number: '5555555555554444',
      expiration_date: '06/27',
      cvv: '789',
      delated: false,
      createdAt: '2024-02-15T14:45:00.000Z'
    },
    {
      id: 3,
      id_user: 2,
      name: 'Visa',
      number: '4012888888881881',
      expiration_date: '03/26',
      cvv: '456',
      delated: false,
      createdAt: '2024-01-20T09:15:00.000Z'
    },
    {
      id: 4,
      id_user: 3,
      name: 'Mastercard',
      number: '5105105105105100',
      expiration_date: '09/25',
      cvv: '321',
      delated: false,
      createdAt: '2023-12-05T16:20:00.000Z'
    },
    {
      id: 5,
      id_user: 4,
      name: 'Visa',
      number: '4222222222222220',
      expiration_date: '11/28',
      cvv: '999',
      delated: false,
      createdAt: '2023-11-10T08:00:00.000Z'
    }
  ];

  cardTypes = [
    { value: 'Visa', label: 'Visa' },
    { value: 'Mastercard', label: 'Mastercard' }
  ];

  constructor(private fb: FormBuilder, private userService: UserService, private api2service: Api2Service) {
    this.paymentForm = this.fb.group({
      name: ['Visa', [Validators.required]],
      number: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiration_date: ['', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
        this.expirationDateValidator // Añadido validador personalizado
      ]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  // Mejorado el validador de fecha de expiración
  private expirationDateValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const [monthStr, yearStr] = value.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return { invalidFormat: true };
    }

    const expirationDate = new Date(2000 + year, month - 1, 1); // día 1 del mes/año indicado
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignorar hora para comparación de solo fechas

    if (expirationDate < today) {
      return { expired: true };
    }

    return null;
  }

onSubmit() {
  this.userService.getUser().subscribe((user: User | null) => {
    console.log('Usuario actual:', user);

    if (!user) {
      console.warn('No hay usuario cargado');
      return;
    }
  });

  if (this.paymentForm.valid) {
    // Obtener el valor del formulario
    const formValue = this.paymentForm.value;

    // Dividir la fecha MM/YY y añadir el día "01"
    const [month, year] = formValue.expiration_date.split('/');
    const expirationDate = `01/${month}/20${year}`; // Formato DD/MM/YY

    // Crear el nuevo pago con la fecha transformada
    const newPayment: Payment = {
      ...formValue,
      expiration_date: expirationDate,
      user_id: this.user?.id,
    };
    console.log('Nuevo pago:', newPayment);

    this.api2service.storePago(newPayment).subscribe({
      next: (response) => {
        console.log('Tarjeta guardada:', response);
        // Añadir la tarjeta usando la respuesta del servidor (contiene la fecha completa)
        this.examplePayments.push(response);
      },
      error: (error) => {
        console.log('Error al guardar la tarjeta:', newPayment);
        console.error('Error al guardar la tarjeta:', error);
      }
    });
  }
}

  // Generador de nuevos IDs

  // Mejorado el formateo del número de tarjeta
  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 16) {
      value = value.substr(0, 16);
    }

    // Formatear con espacios cada 4 dígitos
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substr(i, 4));
    }

    input.value = parts.join(' ');
    this.paymentForm.get('number')?.setValue(value);
  }

  // Mejorado el formateo de fecha
  formatExpirationDate(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    }

    if (value.length > 5) {
      value = value.substring(0, 5);
    }

    input.value = value;
    this.paymentForm.get('expiration_date')?.setValue(value);
  }

  deleteCard(cardId: number) {
    console.log('Eliminando tarjeta con ID:', cardId);
    this.api2service.updatePago({ id: cardId, deleted: 1 }).subscribe({
      next: () => {
        this.examplePayments = this.examplePayments.filter(card => card.id !== cardId);
        console.log('Tarjeta eliminada correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar la tarjeta:', error);
      }
    });
  }

}
