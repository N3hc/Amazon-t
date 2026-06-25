import { Injectable } from '@angular/core';
import { Ticket, TicketLine } from '../interfaces/ticket.interface';
import { Api2Service } from './api2.service';
@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(
    private api2Service: Api2Service
  ) { }

  addProductToTicket(productId: number, quantity: number, price: number, userId: number): void {
    this.api2Service.getTicketsByUser(userId).subscribe({
      next: (tickets: any[]) => {
        let lastTicket = tickets.find(ticket => ticket.completed === 0); // open ticket

        if (lastTicket) {
          // There is already an open ticket
          const ticketLineData = {
            id_Ticket: lastTicket.id,    // ✅ corrected
            id_producto: productId,
            price: price,
            quantity: quantity
          };

          console.log('Ticket data:', ticketLineData);

          // Call API to add product to ticket
          this.api2Service.storeProductToTicketLine(ticketLineData).subscribe({
            next: (response) => {
              console.log('Product added to ticket:', response);
            },
            error: (err) => {
              console.error('Error adding product to ticket:', err);
            }
          });
        } else {
          // No open ticket, create one
          this.api2Service.createTicket(userId, 1).subscribe({
            next: (newTicket) => {
              console.log('New ticket created:', newTicket);
              // Once ticket is created, add the product
              const ticketLineData = {
                id_Ticket: newTicket.id,     // ✅ Corrected
                id_producto: productId,
                price: price,
                quantity: quantity
              };

              this.api2Service.storeProductToTicketLine(ticketLineData).subscribe({
                next: (response) => {
                  console.log('Product added to ticket:', response);
                },
                error: (err) => {
                  console.error('Error adding product to ticket:', err);
                }
              });
            },
            error: (err) => {
              console.error('Error creating new ticket:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error getting user tickets:', err);
      }
    });
  }



  /** 
  getUserLastTicketId(userId: number): void {
    // Get user addresses
    this.api2Service.getDireccionesByUser(userId).subscribe({
      next: (direcciones: any[]) => {
        // Select only the first address
        const firstAddress = direcciones.length > 0 ? direcciones[0] : null;
  
        if (!firstAddress) {
          console.log('No addresses found for the user.');
          return;
        }
  
        // Get user tickets
        this.api2Service.getTicketsByUser(userId).subscribe({
          next: (tickets: Ticket[]) => {
            const lastTicket = tickets.length > 0 ? tickets[tickets.length - 1] : null;
  
            if (lastTicket && lastTicket.completed === true) {
              console.log('The last ticket is complete.');
              // Create a new ticket with the first address
              this.createNewTicket(userId, 1);
            } else if (!lastTicket) {
              console.log('No tickets, creating a new one...');
              // Create a new ticket with the first address
              this.createNewTicket(userId, 1);
            } else {
              console.log('The last ticket is open.');
            }
          },
          error: (err) => {
            console.error('Error getting tickets:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error getting addresses:', err);
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
          console.log('No open tickets. Creating a new one...');
          this.createNewTicket(userId, defaultAddressId);
        } else {
          console.log('An open ticket already exists. ID:', lastTicket.id);
        }
      },
      error: (err) => {
        console.error('Error getting tickets:', err);
      }
    });
  }


  // Function to create a new ticket
  createNewTicket(userId: number, addressId: number): void {
    const newTicketData = {
      id_user: userId,
      id_address: addressId, // Use the first address
      total: 0, // Initial ticket total (can be modified)
      completed: false // The newly created ticket is incomplete
    };

    this.api2Service.storeTicketWithUserid(newTicketData).subscribe({
      next: (response) => {
        console.log('New ticket created:', response);
      },
      error: (err) => {
        console.error('Error creating ticket:', err);
      }
    });
  }



}
