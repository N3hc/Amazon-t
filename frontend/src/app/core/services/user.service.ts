import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Api2Service } from './api2.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Can be null if no session is started
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

  // Set the complete user
  setUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.api2Service.createTicket(user.id, 1).subscribe({
      next: (response) => {
        console.log('Ticket created:', response);
      },
      error: (error) => {
        console.error('Error creating ticket:', error);
      },
    });
  }

  // Partially update user data
  updateUser(updatedUser: Partial<User>): void {
    const currentUser = this.userSubject.value;
    if (!currentUser) return;

    this.userSubject.next({ ...currentUser, ...updatedUser });
  }

  // Clear user (for example on logout)
  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  // Simulate password change (only if there is a session)
  changePassword(oldPassword: string, newPassword: string): boolean {
    const currentUser = this.userSubject.value;
    if (currentUser && currentUser.password === oldPassword) {
      this.userSubject.next({ ...currentUser, password: newPassword });
      return true;
    }
    return false;
  }

  // isLogged function to check if the user is logged in
  isLogged(): boolean {
    const savedUser = localStorage.getItem('user');
    return savedUser !== null; // If the user is saved in localStorage, they are logged in
  }
}
