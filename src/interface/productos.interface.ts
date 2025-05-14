export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }
  
export interface Product {
    id: string;
    id_user: string;
    id_card: string;
    quantity: number;
    price: number;
    state: string;
    deleted: boolean;
    createdAt: string;
  }