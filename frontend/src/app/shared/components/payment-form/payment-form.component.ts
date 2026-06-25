import { Component, Input} from '@angular/core';
import { Payment } from '../../../core/interfaces/payment.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { OnInit } from '@angular/core';
import { Api2Service } from '../../../core/services/api2.service';
import { User } from '../../../core/interfaces/user.interface';


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
    console.log('Current user:', user);
    this.user = user;

    if (!user) {
      console.warn('No user loaded');
      return;
    }

    this.api2service.getPagosByUser(user.id).subscribe((pagos: Payment[]) => {
      this.examplePayments = pagos;
      console.log('User payments:', this.examplePayments);
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
        this.expirationDateValidator // Custom validator added
      ]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  // Improved expiration date validator
  private expirationDateValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const [monthStr, yearStr] = value.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return { invalidFormat: true };
    }

    const expirationDate = new Date(2000 + year, month - 1, 1); // day 1 of the indicated month/year
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time for date-only comparison

    if (expirationDate < today) {
      return { expired: true };
    }

    return null;
  }

onSubmit() {
  this.userService.getUser().subscribe((user: User | null) => {
    console.log('Current user:', user);

    if (!user) {
      console.warn('No user loaded');
      return;
    }
  });

  if (this.paymentForm.valid) {
    // Get the form value
    const formValue = this.paymentForm.value;

    // Split MM/YY date and add day "01"
    const [month, year] = formValue.expiration_date.split('/');
    const expirationDate = `01/${month}/20${year}`; // Format DD/MM/YY

    // Create the new payment with the transformed date
    const newPayment: Payment = {
      ...formValue,
      expiration_date: expirationDate,
      user_id: this.user?.id,
    };
    console.log('New payment:', newPayment);

    this.api2service.storePago(newPayment).subscribe({
      next: (response) => {
        console.log('Saved card:', response);
        // Add card using server response (contains full date)
        this.examplePayments.push(response);
        this.addingCard = false; // Hide form after saving
      },
      error: (error) => {
        console.log('Error saving card:', newPayment);
        console.error('Error saving card:', error);
      }
    });
  }
}

  // Generador de nuevos IDs

  // Improved card number formatting
  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 16) {
      value = value.substr(0, 16);
    }

    // Format with spaces every 4 digits
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substr(i, 4));
    }

    input.value = parts.join(' ');
    this.paymentForm.get('number')?.setValue(value);
  }

  // Improved date formatting
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
    console.log('Deleting card with ID:', cardId);
    this.api2service.updatePago({ id: cardId, deleted: 1 }).subscribe({
      next: () => {
        this.examplePayments = this.examplePayments.filter(card => card.id !== cardId);
        console.log('Card deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting card:', error);
      }
    });
  }

}
