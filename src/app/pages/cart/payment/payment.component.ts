import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../main-components/header/header.component';
import { ThemeService } from '../../../../services/theme/theme.service';
import { CartService } from '../../../../services/cart/cart.service';
import { CartItem } from '../../../../interface/productos.interface';
import { Router } from '@angular/router';

interface Address {
  id: number;
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CreditCard {
  id: number;
  cardNumber: string;
  holderName: string;
  expiration: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ HeaderComponent, ReactiveFormsModule ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentForm!: FormGroup;

  savedAddresses: Address[] = [
    { id: 1, fullName: 'Juan Pérez', email: 'juan@mail.com', street: 'Calle Falsa 123', city: 'Madrid', state: 'Madrid', zip: '28001', country: 'Spain' },
    { id: 2, fullName: 'María Gómez', email: 'maria@mail.com', street: 'Av. Siempre Viva 742', city: 'Barcelona', state: 'Cataluña', zip: '08001', country: 'Spain' }
  ];

  savedCards: CreditCard[] = [
    { id: 1, cardNumber: '4111111111111111', holderName: 'Juan Pérez', expiration: '12/24' },
    { id: 2, cardNumber: '5500000000000004', holderName: 'María Gómez', expiration: '10/25' }
  ];

  countries: string[] = [
    /* ... lista de países ... */
  ];

  isDarkMode = false;
  cart: CartItem[] = [];
  purchaseConfirmed = false;
  showNewAddress = false;
  showNewCard = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private themeService: ThemeService,
    private router: Router
  ) {
    this.initializeForm();

    // Desactivar subformularios nuevos por defecto
    this.paymentForm.get('newAddress')!.disable({ emitEvent: false });
    this.paymentForm.get('newCard')!.disable({ emitEvent: false });

    // Dirección seleccionada
    this.paymentForm.get('selectedAddress')!.valueChanges
      .subscribe(val => this.onAddressSelectionChange(val));
    this.onAddressSelectionChange(this.paymentForm.get('selectedAddress')!.value);

    // Tarjeta seleccionada
    this.paymentForm.get('selectedCard')!.valueChanges
      .subscribe(val => this.onCardSelectionChange(val));
    this.onCardSelectionChange(this.paymentForm.get('selectedCard')!.value);

    // Cart & Theme subscriptions
    this.cartService.cart$.subscribe(c => this.cart = c);
    this.themeService.theme$.subscribe(theme => this.isDarkMode = (theme === 'dark'));
  }

  private initializeForm(): void {
    this.paymentForm = this.fb.group({
      selectedAddress: ['', Validators.required],
      selectedCard: ['', Validators.required],
      newAddress: this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        country: ['', Validators.required]
      }),
      newCard: this.fb.group({
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        holderName: ['', Validators.required],
        expiration: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
        cvc: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
      })
    });
  }

  private onAddressSelectionChange(value: number | 'new-address'): void {
    const addrGroup = this.paymentForm.get('newAddress') as FormGroup;

    if (value === 'new-address') {
      this.showNewAddress = true;
      addrGroup.enable({ emitEvent: false });
    } else {
      this.showNewAddress = false;
      addrGroup.disable({ emitEvent: false });
    }

    addrGroup.updateValueAndValidity({ emitEvent: false });
  }

  private onCardSelectionChange(value: number | 'new-card'): void {
    const cardGroup = this.paymentForm.get('newCard') as FormGroup;

    if (value === 'new-card') {
      this.showNewCard = true;
      cardGroup.enable({ emitEvent: false });
    } else {
      this.showNewCard = false;
      cardGroup.disable({ emitEvent: false });
    }

    cardGroup.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.markAllAsTouched();
      return;
    }
    this.purchaseConfirmed = true;
    this.cartService.clearCart();
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  private markAllAsTouched(): void {
    Object.values(this.paymentForm.controls).forEach(ctrl => {
      if (ctrl instanceof FormGroup) {
        Object.values(ctrl.controls).forEach(c => c.markAsTouched());
      } else {
        ctrl.markAsTouched();
      }
    });
  }

  getSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() > 50 ? 0 : 5;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }
}
