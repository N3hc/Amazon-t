import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardsApiService {

  private apiUrl = 'https://api.pokemontcg.io/v2';
  private apiToken = '0de19d2a-b166-429a-ab0d-a6c0f576d138';

  constructor(private http: HttpClient) { }

  private callApi<T>(endpoint: string, params: any): Observable<T> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`
    });
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { headers, params });
  }

  private handleApiResponse<T>(observable: Observable<T>, operation: string, defaultResult: T): Observable<T> {
    return observable.pipe(
      catchError(error => {
        if (error.status === 404) {
          console.warn(`${operation} retornó 404 en ${error.url}. Se devuelve el valor por defecto.`);
          return of(defaultResult);
        } else {
          console.error(`${operation} falló: ${error.message}`);
          return of(defaultResult);
        }
      })
    );
  }

  getCards(): Observable<any> {
    const params = {
      q: 'set.id:sv3pt5',
      orderBy: 'number'
    };
    return this.handleApiResponse(this.callApi<any>('/cards', params), 'getCards', []);
  }

  getUniquePokemon(name: string): Observable<any> {
    const params = {
      q: `name:${name}`,
      orderBy: 'number'
    };  
    return this.handleApiResponse(this.callApi<any>('/cards', params), 'getUniquePokemon', {});
  }

  getPokemonsFromSets(set: string): Observable<any> {
    const params = {
      q: `set.id:${set}`,
      orderBy: 'number'
    };
    
    return this.handleApiResponse(this.callApi<any>('/cards', params), 'getPokemonsFromSets', []);
  }

  getPokemonAllSets(): Observable<any> {
    const params = {};
    return this.handleApiResponse(this.callApi<any>('/sets', params), 'getPokemonAllSets', []);
  }
}
