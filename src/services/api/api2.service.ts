import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api2Service {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // 🧑 USERS
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index/user`);
  }

  storeUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/store/user`, data);
  }

  updateUser(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/user`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete/user`, { body: { id } });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/user`, credentials);

  }


  // 💳 CARDS
  getCards(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index/card`);
  }

  storeCard(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/store/card`, data);
  }

  updateCard(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/card`, data);
  }

  deleteCard(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete/card`, { body: { id } });
  }

  // 📦 PRODUCTS
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index/products`);
  }

  storeProduct(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/store/products`, data);
  }

  updateProduct(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/products`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete/products`, { body: { id } });
  }

  // 🗂️ CATEGORIES
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index/categories`);
  }

  storeCategory(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/store/categories`, data);
  }

  updateCategory(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/categories`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete/categories`, { body: { id } });
  }

  // 🏠 ADDRESS
  getAddresses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index/adress`);
  }

  storeAddress(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/store/adress`, data);
  }

  updateAddress(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/adress`, data);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete/adress`, { body: { id } });
  }

  // 🎫 TICKETS
  getTickets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index/tikets`);
  }

  storeTicket(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/store/tikets`, data);
  }

  updateTicket(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/tikets`, data);
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete/tikets`, { body: { id } });
  }

  // ➕ TICKET LINES
  getTicketLines(): Observable<any> {
    return this.http.get(`${this.baseUrl}/index/tiket_lineas`);
  }

  storeTicketLine(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/store/tiket_lineas`, data);
  }

  updateTicketLine(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/tiket_lineas`, data);
  }

  deleteTicketLine(id: number): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete/tiket_lineas`, { body: { id } });
  }
}
