export interface Payment {
    id: number;
    id_user: number;
    name: string;
    number: string;
    expiration_date: string;
    cvv: string;
    delated: boolean;
    createdAt: string;
}