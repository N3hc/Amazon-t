import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../interface/user.interface';
import { CommonModule } from '@angular/common';
import { Api2Service } from '../../../../services/api/api2.service'; // Ajusta el path según tu estructura
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword: boolean = false;
  constructor(private api2service : Api2Service, private router: Router, private userService: UserService) {}

  User: User = {
    username: '',
    email: '',
    name: '',
    surname: '',
    password: '',
    oldPassword: '',
    role: 0,
    birthDate: new Date(),
    vendor: 0,
    gender: 0
  };

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      console.error('Formulario inválido');
      return;
    }
  
    this.api2service.login(this.loginForm.value).subscribe({
      next: (user: any) => {
        this.User = user;
        this.userService.setUser(user);
  
        console.log('Usuario actualizado en el servicio:', this.User);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Error al autenticar:', err);
      }
    });
  }
  

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  continueWithoutSession(): void {
    this.router.navigate(['/home']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
