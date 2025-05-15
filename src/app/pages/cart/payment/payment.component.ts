import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../main-components/header/header.component';
import { ThemeService } from '../../../../services/theme/theme.service';
import { CartService } from '../../../../services/cart/cart.service';
import { CartItem } from '../../../../interface/productos.interface';
import { Router } from '@angular/router';
import { AddressFormComponent } from "../../../sub-components/address-form/address-form.component";
import { PaymentFormComponent } from '../../../sub-components/payment-form/payment-form.component';
import { Api2Service } from '../../../../services/api/api2.service';
import { UserService } from '../../../../services/user/user.service';
import { OnInit } from '@angular/core';
import { TicketsService } from '../../../../services/tickets/tickets.service';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, AddressFormComponent, PaymentFormComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  isDarkMode = false;
  cart: CartItem[] = [];
  purchaseConfirmed = false;
  user: any;
  lastTicketId: any;

  constructor(
    private cartService: CartService,
    private themeService: ThemeService,
    private router: Router,
    private api2Service: Api2Service,
    private userService: UserService,
    private TicketsService: TicketsService,
  ) {

    // Cart & Theme subscriptions
    this.cartService.cart$.subscribe(c => this.cart = c);
    this.themeService.theme$.subscribe(theme => this.isDarkMode = (theme === 'dark'));
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => {
      this.user = user;
    });
    this.api2Service.getTicketsByUser(this.user.id).subscribe({
      next: (tickets: any[]) => {
        this.lastTicketId = tickets.find(ticket => ticket.completed === 0); // ticket abierto
      },
      error: (err) => {
        console.error('Error al obtener tickets:', err);
      }
    });
  }

  confirmPurchase(): void {
    this.purchaseConfirmed = true;
    this.cartService.clearCart();
    this.api2Service.updateTicket({
      id: this.lastTicketId.id,
      completed: 1  // o true, según cómo manejes el valor
    }).subscribe({
      next: (response) => {
        console.log('Ticket actualizado:', response);
      }
    });

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
