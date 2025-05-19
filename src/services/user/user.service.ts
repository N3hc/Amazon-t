import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interface/user.interface';
import { Api2Service } from '../api/api2.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Puede ser null si no hay sesión iniciada
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private api2Service: Api2Service) {}

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  getUser(): Observable<User | null> {
    const savedUser = localStorage.getItem('user');
    if (savedUser && !this.userSubject.value) {
      this.userSubject.next(JSON.parse(savedUser));
      return this.userSubject.asObservable();
    }
    return this.userSubject.asObservable();
  }

  // Establecer el usuario completo
  setUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.api2Service.createTicket(user.id, 1).subscribe({
      next: (response) => {
        console.log('Ticket creado:', response);
      },
      error: (error) => {
        console.error('Error al crear el ticket:', error);
      },
    });
  }

  // Actualizar parcialmente los datos del usuario
  updateUser(updatedUser: Partial<User>): void {
    const currentUser = this.userSubject.value;
    if (!currentUser) return;

    this.userSubject.next({ ...currentUser, ...updatedUser });
  }

  // Limpiar usuario (por ejemplo al cerrar sesión)
  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  // Simular cambio de contraseña (solo si ya hay sesión)
  changePassword(oldPassword: string, newPassword: string): boolean {
    const currentUser = this.userSubject.value;
    if (currentUser && currentUser.password === oldPassword) {
      this.userSubject.next({ ...currentUser, password: newPassword });
      return true;
    }
    return false;
  }

  // Función isLogged para verificar si el usuario está logueado
  isLogged(): boolean {
    const savedUser = localStorage.getItem('user');
    return savedUser !== null; // Si el usuario está guardado en localStorage, está logueado
  }
}
