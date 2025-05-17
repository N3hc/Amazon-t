import { Component } from '@angular/core';
import { HeaderComponent } from "../../main-components/header/header.component";
import { ThemeService } from '../../../services/theme/theme.service';
import { CartItem } from '../../../interface/productos.interface';
import { CartService } from '../../../services/cart/cart.service';
import { Router } from '@angular/router';
import { TicketsService } from '../../../services/tickets/tickets.service';
import { Api2Service } from '../../../services/api/api2.service';
import { UserService } from '../../../services/user/user.service';
import { TicketLine, Ticket } from '../../../interface/ticket.interface';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';


interface TicketWithLines extends Ticket {
  ticketLines: TicketLine[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent],
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
        let lastTicket = tickets.find(ticket => ticket.completed === 0); // ticket abierto
        if (lastTicket) {
          this.userLastTicketId = lastTicket.id;
        } else {
          this.userLastTicketId = null;
        }
      }
    });
    this.userService.getUser().subscribe(user => {
  this.user = user;
  this.loadOpenTicketLines(this.user.id); // 👈 Añadir aquí
});

  }


 private loadOpenTicketLines(userId: number): void {
  this.api2Service.getTicketsByUser(userId).pipe(
    map((tickets: Ticket[]) => tickets.find(t => !t.completed)),  // Solo el ticket abierto
    switchMap((openTicket) => {
      if (!openTicket) {
        console.warn('No hay ticket abierto');
        return of(null); // Retorna null si no hay ticket abierto
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
        console.log('Ticket abierto con líneas:', this.ticketLines);
      } else {
        this.ticketLines = [];
      }
    },
    error: (err) => console.error('Error cargando líneas del ticket abierto:', err)
  });
}



  // Calcula el subtotal sin impuestos ni envío
  getSubtotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Calcula el costo de envío (gratis para compras mayores a $50)
  getShippingCost(): number {
    return this.getSubtotal() > 50 ? 0 : 5;
  }

  // Calcula el total incluyendo impuestos y envío
  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost();
  }

  // Método para proceder al pago
  proceedToCheckout(): void {
    this.router.navigate(['cart/payment']);
  }

  // Aumenta la cantidad de un producto
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
        console.log('Producto añadido al ticket:', response);
        // Actualiza el carrito solo si la API responde bien
        this.cartService.updateQuantity(itemId, newQuantity);
      },
      error: (err) => {
        alert('Has llegado al máximo de número del producto');
        console.error('Error al añadir producto al ticket:', err);

        // Aquí restamos 1 a la cantidad en el carrito (porque no se pudo aumentar en el backend)
        this.cartService.updateQuantity(itemId, item.quantity - 1);
      }
    });

  }

  calculateTotal(lines: TicketLine[]): number {
  return lines.reduce((total, line) => total + (line.price * line.quantity), 0);
}

  // Disminuye la cantidad de un producto
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
          console.log('Cantidad disminuida en el ticket:', response);
          this.cartService.updateQuantity(itemId, newQuantity);
        },
        error: (err) => {
          console.error('Error al disminuir la cantidad en el ticket:', err);
        }
      });
    } else {
      console.warn('Cantidad mínima alcanzada o producto no encontrado');
    }
  }



  // Elimina un producto del carrito
  removeFromCart(itemId: string): void {
    const item = this.cart.find(i => i.id === itemId);

    if (!item) {
      console.warn('Producto no encontrado en el carrito');
      return;
    }

    this.api2Service.deleteTicketLineChenPing(this.userLastTicketId, Number(item.id)).subscribe({
      next: () => {
        console.log('Producto eliminado del ticket correctamente');
        this.cartService.removeFromCart(itemId);
      },
      error: (err) => {
        console.error('Error al eliminar del ticket:', err);
      }
    });

  }


  // Redirige a la página de productos
  continueShopping(): void {
    this.router.navigate(['/home/products']);
  }
}