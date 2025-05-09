import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, Form } from '@angular/forms';
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
  userFormEdit! :FormGroup;
  showPassword = false;
  showOldPassword = false;
  isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  private mapGender(value: number): number {
    return value;
  }


    paymentHistory = [
    { date: '2025-05-01', amount: 50, status: 'Completado' },
    { date: '2025-04-15', amount: 30, status: 'Pendiente' },
    { date: '2025-03-20', amount: 100, status: 'En Proceso' },
    { date: '2025-02-10', amount: 25, status: 'Completado' },
  ];


  ngOnInit(): void {
    this.userService.getUser().subscribe((user: User | null) => {
      if (!user) {
        console.warn('No hay usuario cargado');
        this.router.navigate(['/home']);
        return;
      }

      this.userForm = this.fb.group({
        username: [{ value: user.username, disabled: true }, [Validators.required]],
        email: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
        name: [{ value: user.name, disabled: true }, [Validators.required]],
        surname: [{ value: user.surname, disabled: true }, [Validators.required]],
        birthDate: [{ value: this.formatDate(user.birthDate), disabled: true }, [Validators.required]],
        gender: [{ value: this.mapGender(user.gender), disabled: true }, [Validators.required]],
        vendor: [{ value: !!user.vendor, disabled: true }],
        role: [{ value: !!user.role, disabled: true }],
        oldPassword: [{ value: '', disabled: true }, [Validators.minLength(6)]],
        password: [{ value: '', disabled: true }, [Validators.minLength(6)]],
        confirmPassword: [{ value: '', disabled: true }]
      }, { validators: this.passwordMatchValidator });

      // Tema oscuro
      this.themeService.theme$.subscribe(theme => {
        this.isDarkMode = theme === 'dark';
      });
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    const fieldsToToggle = [
      'username', 'email', 'name', 'surname', 'birthDate',
      'gender', 'vendor', 'oldPassword', 'password', 'confirmPassword'
    ];

    fieldsToToggle.forEach(field => {
      const control = this.userForm.get(field);
      if (this.isEditMode) {
        control?.enable();
      } else {
        control?.disable();
      }
    });
  }


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const { confirmPassword, ...userData } = this.userForm.value;
      console.log('Datos del formulario:', userData);
      this.userService.updateUser(userData);
      this.router.navigate(['/user/profile']);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/user/profile']);
  }

  // Asegura que birthDate siempre sea una string en formato yyyy-MM-dd
  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const pwd = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (pwd || confirm) {
      return pwd === confirm ? null : { mismatch: true };
    }
    return null;
  }
}