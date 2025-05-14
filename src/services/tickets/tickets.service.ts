import { Injectable } from '@angular/core';
import { Ticket, TicketLine } from '../../interface/ticket.interface';
import { Api2Service } from '../api/api2.service';
@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(
    private api2Service: Api2Service
  ) { }

addProductToTicket(productId: number, quantity: number, price: number, userId: number): void {
  // Obtiene el ticket más reciente y abierto
  this.api2Service.getTicketsByUser(userId).subscribe({
    next: (tickets: any[]) => {
      const lastTicket = tickets.find(ticket => ticket.completed === 0); // ticket abierto

      if (!lastTicket) {
        console.error('No hay ticket abierto disponible');
        return;
      }

      // Asegúrate de que lastTicket.id es un número válido
      const ticketLineData = {
        id_tiket: lastTicket.id,
        id_producto: productId,
        price: price,
        quantity: quantity
      };
      console.log('Datos del ticket:', ticketLineData);

      // Llama a la API para agregar el producto al ticket
      this.api2Service.storeProductToTicketLine(ticketLineData).subscribe({
        next: (response) => {
          console.log('Producto añadido al ticket:', response);
        },
        error: (err) => {
          console.error('Error al añadir producto al ticket:', err);
        }
      });
    },
    error: (err) => {
      console.error('Error al obtener tickets del usuario:', err);
    }
  });
}

/** 
getUserLastTicketId(userId: number): void {
  // Obtener las direcciones del usuario
  this.api2Service.getDireccionesByUser(userId).subscribe({
    next: (direcciones: any[]) => {
      // Seleccionamos solo la primera dirección
      const firstAddress = direcciones.length > 0 ? direcciones[0] : null;

      if (!firstAddress) {
        console.log('No se encontraron direcciones para el usuario.');
        return;
      }

      // Obtener los tickets del usuario
      this.api2Service.getTicketsByUser(userId).subscribe({
        next: (tickets: Ticket[]) => {
          const lastTicket = tickets.length > 0 ? tickets[tickets.length - 1] : null;

          if (lastTicket && lastTicket.completed === true) {
            console.log('El último ticket está completo.');
            // Crear un nuevo ticket con la primera dirección
            this.createNewTicket(userId, 1);
          } else if (!lastTicket) {
            console.log('No hay tickets, creando uno nuevo...');
            // Crear un nuevo ticket con la primera dirección
            this.createNewTicket(userId, 1);
          } else {
            console.log('El último ticket está abierto.');
          }
        },
        error: (err) => {
          console.error('Error al obtener tickets:', err);
        }
      });
    },
    error: (err) => {
      console.error('Error al obtener direcciones:', err);
    }
  });
}
  */

getUserLastTicketId(userId: number): void {
  const defaultAddressId = 1;

  this.api2Service.getTicketsByUser(userId).subscribe({
    next: (tickets: Ticket[]) => {
      const lastTicket = tickets.length > 0 ? tickets[tickets.length - 1] : null;

      if (!lastTicket || lastTicket.completed === true) {
        console.log('No hay tickets abiertos. Creando uno nuevo...');
        this.createNewTicket(userId, defaultAddressId);
      } else {
        console.log('Ya existe un ticket abierto. ID:', lastTicket.id);
      }
    },
    error: (err) => {
      console.error('Error al obtener tickets:', err);
    }
  });
}


// Función para crear un ticket nuevo
createNewTicket(userId: number, addressId: number): void {
  const newTicketData = {
    id_user: userId,
    id_adress: addressId, // Usamos la primera dirección
    total: 0, // Total inicial del ticket (puedes modificar esto)
    completed: false // El ticket recién creado está incompleto
  };

  this.api2Service.storeTicketWithUserid(newTicketData).subscribe({
    next: (response) => {
      console.log('Nuevo ticket creado:', response);
    },
    error: (err) => {
      console.error('Error al crear ticket:', err);
    }
  });
}



}
