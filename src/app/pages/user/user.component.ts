import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../main-components/header/header.component';
import { ThemeService } from '../../../services/theme/theme.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../interface/user.interface';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  isDarkMode = false;
  userForm!: FormGroup;
  showPassword = false;
  showOldPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Tema oscuro
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });

    // Cargar datos de usuario y crear formulario reactivo
    this.userService.getUser().subscribe((user: User) => {
      this.userForm = this.fb.group({
        username: [user.username, [Validators.required]],
        email: [user.email, [Validators.required, Validators.email]],
        name: [user.name, [Validators.required]],
        surname: [user.surname, [Validators.required]],
        birthDate: [user.birthDate.toISOString().substring(0,10), [Validators.required]],
        gender: [user.gender, [Validators.required]],
        vendor: [user.vendor],
        role: [user.role],
        oldPassword: ['', []],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: ['']
      }, { validators: this.passwordMatchValidator });
    });
  }

  // Validador para que password y confirmPassword coincidan
  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const pwd = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (pwd || confirm) {
      return pwd === confirm ? null : { mismatch: true };
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const val = this.userForm.value;
      // Eliminar confirmPassword antes de enviar
      delete val.confirmPassword;
      this.userService.updateUser(val);
      this.router.navigate(['/user/profile']);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/user/profile']);
  }
}

