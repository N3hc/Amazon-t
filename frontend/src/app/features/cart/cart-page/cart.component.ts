import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ThemeService } from '../../../core/services/theme.service';
import { CartItem } from '../../../core/interfaces/productos.interface';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';
import { TicketsService } from '../../../core/services/tickets.service';
import { Api2Service } from '../../../core/services/api2.service';
import { UserService } from '../../../core/services/user.service';
import { TicketLine, Ticket } from '../../../core/interfaces/ticket.interface';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';


interface TicketWithLines extends Ticket {
  ticketLines: TicketLine[];
}

import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, TranslatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  isDarkMode = false;
  cart: CartItem[] = [];
  user: any;
  userLastTicketId: any;
  openTicket: TicketWithLines | null = null;
  ticketLines: TicketLine[] = [];


  constructor(
    private cartService: CartService,
    private themeService: ThemeService,
    private router: Router,
    private ticketsService: TicketsService,
    private api2Service: Api2Service,
    private userService: UserService
  ) {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
    });
  }

  ngOnInit() {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
    this.userService.getUser().subscribe(user => {
      this.user = user;
    }
    );
    this.api2Service.getTicketsByUser(this.user.id).subscribe({
      next: (tickets: any[]) => {
        let lastTicket = tickets.find(ticket => ticket.completed === 0); // open ticket
        if (lastTicket) {
          this.userLastTicketId = lastTicket.id;
        } else {
          this.userLastTicketId = null;
        }
      }
    });
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.loadOpenTicketLines(this.user.id); // 👈 Add here
    });

  }


 private loadOpenTicketLines(userId: number): void {
  this.api2Service.getTicketsByUser(userId).pipe(
    map((tickets: Ticket[]) => tickets.find(t => !t.completed)),  // Only the open ticket
    switchMap((openTicket) => {
      if (!openTicket) {
        console.warn('No open ticket');
        return of(null); // Returns null if no open ticket
      }

      return this.api2Service.getTicketLinesByTicket(openTicket.id).pipe(
        map(lines => ({
          ...openTicket,
          ticketLines: lines,
          total: this.calculateTotal(lines)
        }) as TicketWithLines)
      );
    })
  ).subscribe({
    next: (ticketData) => {
      if (ticketData) {
        this.openTicket = ticketData;
        this.ticketLines = ticketData.ticketLines;
        console.log('Open ticket with lines:', this.ticketLines);
      } else {
        this.ticketLines = [];
      }
    },
    error: (err) => console.error('Error loading lines of the open ticket:', err)
  });
}



  // Calculate the subtotal without taxes or shipping
  getSubtotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Calculate shipping cost (free for purchases over $50)
  getShippingCost(): number {
    return this.getSubtotal() > 50 ? 0 : 5;
  }

  // Calculate total including taxes and shipping
  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  // Method to proceed to payment
  proceedToCheckout(): void {
    this.router.navigate(['cart/payment']);
  }

  // Increase the quantity of a product
  increaseQuantity(itemId: string): void {
    const item = this.cart.find(item => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + 1;

    this.api2Service.storeProductToTicketLine({
      id_ticket: this.userLastTicketId,
      id_producto: item.id,
      quantity: newQuantity
    }).subscribe({
      next: (response) => {
        console.log('Product added to ticket:', response);
        // Only update the cart if the API responds successfully
        this.cartService.updateQuantity(itemId, newQuantity);
      },
      error: (err) => {
        alert('You have reached the maximum quantity for this product');
        console.error('Error adding product to ticket:', err);

        // Here we subtract 1 from the quantity in the cart (because it could not be increased in the backend)
        this.cartService.updateQuantity(itemId, item.quantity - 1);
      }
    });

  }

  calculateTotal(lines: TicketLine[]): number {
  return lines.reduce((total, line) => total + (line.price * line.quantity), 0);
}

  // Decrease the quantity of a product
  decreaseQuantity(itemId: string): void {
    const item = this.cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;

      const ticketLineData = {
        id_ticket: this.userLastTicketId,
        id_producto: item.id,
        quantity: newQuantity
      };

      this.api2Service.storeProductToTicketLine(ticketLineData).subscribe({
        next: (response) => {
          console.log('Quantity decreased in the ticket:', response);
          this.cartService.updateQuantity(itemId, newQuantity);
        },
        error: (err) => {
          console.error('Error decreasing quantity in the ticket:', err);
        }
      });
    } else {
      console.warn('Minimum quantity reached or product not found');
    }
  }



  // Remove a product from the cart
  removeFromCart(itemId: string): void {
    const item = this.cart.find(i => i.id === itemId);

    if (!item) {
      console.warn('Product not found in the cart');
      return;
    }

    this.api2Service.deleteTicketLineChenPing(this.userLastTicketId, Number(item.id)).subscribe({
      next: () => {
        console.log('Product removed from ticket successfully');
        this.cartService.removeFromCart(itemId);
      },
      error: (err) => {
        console.error('Error deleting from ticket:', err);
      }
    });

  }


  // Redirects to the products page
  continueShopping(): void {
    this.router.navigate(['/home/products']);
  }
}