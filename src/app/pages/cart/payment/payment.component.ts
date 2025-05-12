import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../main-components/header/header.component';
import { ThemeService } from '../../../../services/theme/theme.service';
import { CartService } from '../../../../services/cart/cart.service';
import { CartItem } from '../../../../interface/productos.interface';
import { Router } from '@angular/router';
import { AddressFormComponent } from "../../../sub-components/address-form/address-form.component";
import { PaymentFormComponent } from '../../../sub-components/payment-form/payment-form.component';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, AddressFormComponent, PaymentFormComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {

  isDarkMode = false;
  cart: CartItem[] = [];
  purchaseConfirmed = false;

  constructor(
    private cartService: CartService,
    private themeService: ThemeService,
    private router: Router
  ) {

    // Cart & Theme subscriptions
    this.cartService.cart$.subscribe(c => this.cart = c);
    this.themeService.theme$.subscribe(theme => this.isDarkMode = (theme === 'dark'));
  }


  confirmPurchase(): void {
    this.purchaseConfirmed = true;
    this.cartService.clearCart();
  }



  continueShopping(): void {
    this.router.navigate(['/products']);
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
