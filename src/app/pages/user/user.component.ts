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

  private mapGender(value: number): string {
    switch (value) {
      case 0: return 'male';
      case 1: return 'female';
      case 2: return 'other';
      default: return '';
    }
  }


  ngOnInit(): void {
    this.userService.getUser().subscribe((user: User | null) => {
      if (!user) {
        // Podrías redirigir o mostrar un mensaje
        console.warn('No hay usuario cargado');
        this.router.navigate(['/home']);
        return;
      } else {
        this.userForm = this.fb.group({
          username: [user.username, [Validators.required]],
          email: [user.email, [Validators.required, Validators.email]],
          name: [user.name, [Validators.required]],
          surname: [user.surname, [Validators.required]],
          birthDate: [this.formatDate(user.birthDate), [Validators.required]],
          gender: [this.mapGender(user.gender), [Validators.required]],
          vendor: [!!user.vendor],
          role: [!!user.role],
          oldPassword: [''],
          password: ['', [Validators.minLength(6)]],
          confirmPassword: ['']
        }, { validators: this.passwordMatchValidator });

        this.userForm.disable();
      }
    // Escuchar cambios de tema
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });

    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.isEditMode ? this.userForm.enable() : this.userForm.disable();
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

