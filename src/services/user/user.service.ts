import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../../interface/user.interface'; // Asegúrate de que el path sea correcto

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>({
    username: 'juanperez',
    email: 'juan.perez@example.com',
    name: 'Juan',
    surname: 'Pérez',
    password: '',
    oldPassword: '',
    role: false,
    birthDate: new Date(1990, 4, 15),
    vendor: false,
    gender: 'male'
  });

  constructor() {}

  // Obtener el usuario como observable
  getUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  // Actualizar los datos del usuario
  updateUser(updatedUser: Partial<User>): void {
    const currentUser = this.userSubject.value;
    this.userSubject.next({ ...currentUser, ...updatedUser });
  }

  // (Opcional) Simular cambio de contraseña
  changePassword(oldPassword: string, newPassword: string): boolean {
    const currentUser = this.userSubject.value;
    if (currentUser.password === oldPassword) {
      this.userSubject.next({ ...currentUser, password: newPassword });
      return true;
    }
    return false;
  }
}
