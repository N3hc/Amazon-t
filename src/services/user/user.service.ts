import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interface/user.interface'; // Ajusta el path según tu proyecto

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Flag para activar o desactivar el usuario falso
  private useFakeUser = true; // Cambia esta línea para activar/desactivar el usuario falso

  // Puede ser null si no hay sesión iniciada
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    // Inicializar el usuario falso solo si useFakeUser es verdadero
    if (this.useFakeUser) {
      this.initializeFakeUser();
    }
  }

  // Inicializar un usuario falso si no hay ninguno en el localStorage
  private initializeFakeUser() {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      const fakeUser: User = {
        username: 'Admin',
        email: 'admin@admin.com',
        name: 'Admin',
        surname: 'Admin',
        password: '$2y$12$O6geWe0IMztE5TgrhpCNDOBmCc5R7scASF7OcyG6cYpzXTFXTcDsa', // Este es un hash de ejemplo para la contraseña
        oldPassword: '',
        role: 1, // Admin
        birthDate: '2001-01-01',
        vendor: 1, // Vendor
        gender: 1, // Male
      };

      this.userSubject.next(fakeUser);
      localStorage.setItem('user', JSON.stringify(fakeUser));
    }
  }

  // Obtener el usuario como observable
  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  // Obtener el usuario actual (sincrónicamente)
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  // Establecer el usuario completo
  setUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
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
