import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../interface/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  private users: User[] = [
    { email: 'test@example.com', password: 'password123' },
    { email: 'usuario@demo.com', password: 'demo1234' }
  ];

  constructor(private router: Router) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      const userFound = this.users.find(user => user.email === email && user.password === password);
  
      if (userFound) {
        console.log('Inicio de sesión exitoso:', email);
        alert('¡Inicio de sesión exitoso!');
        this.router.navigate(['/home']);
      } else {
        console.error('Credenciales incorrectas');
        alert('Correo o contraseña incorrectos');
      }
    } else {
      console.log('Formulario inválido');
    }
  }

  continueWithoutSession(): void {
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
