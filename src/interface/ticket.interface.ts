export interface TicketLine {
  id: number;
  id_ticket: number;
  id_product: number;
  quantity: number;
  price: number;
  deleted: boolean;
  createdAt: string;
}

export interface Ticket {
  id: number;
  id_user: number;
  id_address: number;
  total: number;
  completed: boolean;
  deleted: boolean;
  createdAt: string;
  ticketLines: TicketLine[];
}