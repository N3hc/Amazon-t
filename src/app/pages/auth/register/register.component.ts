import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showPassword2 = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      accountType: ['client', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para que 'password' y 'confirmPassword' coincidan
  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario enviado', this.registerForm.value);
      alert('¡Creacion de cuenta exitosa!');
      this.router.navigate(['/login']);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePassword2(): void {
    this.showPassword2 = !this.showPassword2;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  continueWithoutSession(): void {
    this.router.navigate(['/home']);
  }
}
