import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
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
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
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
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas",
    "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
    "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
    "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba",
    "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark",
    "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia",
    "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
    "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
    "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino",
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
    "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
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

    // Valor por defecto: primera dirección guardada
    this.paymentForm.get('selectedAddress')!.setValue(this.savedAddresses[0].id);
    // Escuchamos cambios en dirección
    this.paymentForm.get('selectedAddress')!.valueChanges
      .subscribe(val => this.onAddressSelectionChange(val));
    // Inicializamos estado
    this.onAddressSelectionChange(this.paymentForm.get('selectedAddress')!.value);

    // Suscripciones estándar
    this.cartService.cart$.subscribe(c => this.cart = c);
    this.themeService.theme$.subscribe(theme => this.isDarkMode = (theme === 'dark'));
  }

  private onAddressSelectionChange(value: number | 'new-address'): void {
    const addrGroup = this.paymentForm.get('newAddress') as FormGroup;
    if (value === 'new-address') {
      this.showNewAddress = true;
      Object.values(addrGroup.controls).forEach(ctrl => ctrl.enable({ emitEvent: false }));
    } else {
      this.showNewAddress = false;
      Object.values(addrGroup.controls).forEach(ctrl => ctrl.disable({ emitEvent: false }));
    }
    addrGroup.updateValueAndValidity({ emitEvent: false });
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

  private onCardSelectionChange(value: number | 'new-card'): void {
    const newCardGroup = this.paymentForm.get('newCard') as FormGroup;

    if (value === 'new-card') {
      // Mostrar y activar validadores
      this.showNewCard = true;
      Object.values(newCardGroup.controls).forEach(ctrl => ctrl.enable({ emitEvent: false }));
    } else {
      // Ocultar y desactivar validadores
      this.showNewCard = false;
      Object.values(newCardGroup.controls).forEach(ctrl => ctrl.disable({ emitEvent: false }));
    }
    newCardGroup.updateValueAndValidity({ emitEvent: false });
  }

  onSubmit(): void {
    console.log('Submit button clicked');
      console.log('Formulario válido:', this.paymentForm.value);
      this.purchaseConfirmed = true;
      this.cartService.clearCart();
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
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() > 50 ? 0 : 5;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  confirmPurchase() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  toggleAddressForm() {
    this.showNewAddress = !this.showNewAddress;
    if (this.showNewAddress) this.paymentForm.patchValue({ selectedAddress: '' });
  }

  toggleCardForm() {
    this.showNewCard = !this.showNewCard;
    if (this.showNewCard) this.paymentForm.patchValue({ selectedCard: '' });
  }
}