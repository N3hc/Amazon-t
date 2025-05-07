import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interface/user.interface'; // Ajusta el path según tu proyecto

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Puede ser null si no hay sesión iniciada
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {}

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
}
