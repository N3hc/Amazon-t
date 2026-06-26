import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api2Service } from '../../../core/services/api2.service';
import { User } from '../../../core/interfaces/user.interface';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showPassword2 = false;
  user: User | null = null;


  constructor(private fb: FormBuilder, private router: Router, private api2Service : Api2Service) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      vendor: ['0', Validators.required],
      gender: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to ensure 'password' and 'confirmPassword' match
  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.user = this.registerForm.value;
      console.log(this.registerForm.value);
      this.api2Service.storeUser(this.registerForm.value).subscribe(
        response => {
          console.log('Registration successful', response);
          alert('Account creation successful!');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Registration error', error);
          alert('Error creating account. Please try again.');
        }
      );
      console.log('Form submitted', this.registerForm.value);
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
