import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, Form } from '@angular/forms';
import { HeaderComponent } from '../../main-components/header/header.component';
import { ThemeService } from '../../../services/theme/theme.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../interface/user.interface';
import { Api2Service } from '../../../services/api/api2.service';

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
    private themeService: ThemeService,
    private api2Service: Api2Service
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
        id: [user.id],
        username: [user.username, [Validators.required]],
        email: [user.email, [Validators.required, Validators.email]],
        name: [user.name, [Validators.required]],
        surname: [user.surname, [Validators.required]],
        birthDate: [this.formatDate(user.birthDate), [Validators.required]],
        gender: [this.mapGender(user.gender), [Validators.required]],
        vendor: [!!user.vendor],
        role: [!!user.role],
        password: ['', [Validators.minLength(6)]]
      });


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
      'gender', 'vendor','password'
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
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }

  const userData = { ...this.userForm.value };

  // Si no hay contraseña, elimínala antes de enviar
  if (!userData.password) {
    delete userData.password;
  }
  console.log('Datos del formulario:', userData);
  this.userService.updateUser(userData);
  this.api2Service.updateUser(userData).subscribe({
    next: (response) => { 
      console.log('Usuario actualizado:', response);
      //this.userService.setUser(userData);
    },
    error: (error) => {
      console.error('Error al actualizar el usuario:', error);
    }
  });
  this.router.navigate(['/user/profile']);
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