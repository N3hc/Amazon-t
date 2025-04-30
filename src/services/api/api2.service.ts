import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Api2Service {

  private baseUrl = "http://localhost:8000/api"

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(`${this.baseUrl}/index/user`);
  }
  getAllProducts() {
    return this.http.get(`${this.baseUrl}/index/products`);
  }

  getAllCategories() {
    return this.http.get(`${this.baseUrl}/index/categories`);
  }

  getAllCards() {
    return this.http.get(`${this.baseUrl}/index/card`);
  }
  getAllAdresses() {
    return this.http.get(`${this.baseUrl}/index/adress`);
  }
  getAllTikets() {
    return this.http.get(`${this.baseUrl}/index/tikets`);
  }
  getAllTiket_Lines() {
    return this.http.get(`${this.baseUrl}/index/tiket_lineas`);
  }
}
