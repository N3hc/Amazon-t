export interface TicketLine {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Ticket {
  id: number;
  total: number;
  completed: boolean;
  deleted: boolean;
  createdAt: string;
  lines: TicketLine[];
}