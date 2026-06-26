import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, Form } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ThemeService } from '../../../core/services/theme.service';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user.interface';
import { Api2Service } from '../../../core/services/api2.service';
import { PaymentFormComponent } from '../../../shared/components/payment-form/payment-form.component';
import { AddressFormComponent } from '../../../shared/components/address-form/address-form.component';
import { Ticket, TicketLine } from '../../../core/interfaces/ticket.interface';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { VendorComponent } from '../vendor-panel/vendor.component';
import { StatisticsComponent } from '../components/statistics/statistics.component';
import { AdminComponent } from '../admin-panel/admin.component';
import { Observable } from 'rxjs';

interface TicketWithLines extends Ticket {
  ticketLines: TicketLine[];
}

import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, PaymentFormComponent, AddressFormComponent, VendorComponent, AdminComponent, StatisticsComponent, TranslatePipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  showPassword = false;
  showOldPassword = false;
  selectedTicket: TicketWithLines | null = null;
  isDarkMode = false;
userTickets: TicketWithLines[] = [];

  


  completedTicketLines: TicketLine[] = [
    {
      id: 1,
      id_ticket: 1,
      id_product: 101,
      quantity: 2,
      price: 25.99,
      deleted: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      id_ticket: 12345,
      id_product: 205,
      quantity: 1,
      price: 95.52,
      deleted: false,
      createdAt: new Date().toISOString()
    }
  ];

  completedTickets: TicketWithLines[] = [
    {
      id: 1,
      id_user: 123,
      id_address: 456,
      total: 149.99,
      completed: true,
      deleted: false,
      createdAt: new Date('2024-03-15').toISOString(),
      ticketLines: [  // Add this property
        {
          id: 1,
          id_ticket: 1,
          id_product: 101,
          quantity: 2,
          price: 25.99,
          deleted: false,
          createdAt: new Date().toISOString()
        }
      ]
    },
  ];

  ngOnInit(): void {
    this.userService.getUser().subscribe((user: User | null) => {
      if (!user) {
        console.warn('No user loaded');
        this.router.navigate(['/home']);
        return;
      }

      this.loadUserTickets(user.id);

      this.userForm = this.fb.group({
        id: [user.id],
        name: [user.name, Validators.required],
        surname: [user.surname, Validators.required],
        email: [user.email, [Validators.required, Validators.email]],
        username: [user.username, Validators.required],
        birthDate: [user.birthDate, Validators.required],
        gender: [this.mapGender(user.gender), [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: [user.role],
        vendor: [user.vendor],
      });

      // Dark theme
      this.themeService.theme$.subscribe(theme => {
        this.isDarkMode = theme === 'dark';
      });
    });
  }

  /**private loadUserTickets(userId: number): void {
    this.api2Service.getTicketsByUser(userId).pipe(
      switchMap((tickets: Ticket[]) => {
        const ticketRequests = tickets.map(ticket =>
          this.api2Service.getTicketLinesByTicket(ticket.id).pipe(
            map(lines => ({
              ...ticket,
              ticketLines: lines,
              total: this.calculateTotal(lines)
            } as TicketWithLines))  // Change the type here
          )
        );
        return forkJoin(ticketRequests);
      })
    ).subscribe({
      next: (completeTickets: TicketWithLines[]) => {  // Update the type here
        this.completedTickets = completeTickets;
        console.log('Complete tickets:', this.completedTickets);
      },
      error: (err) => console.error('Error loading tickets:', err)
    });
  }*/

private loadUserTickets(userId: number): void {
  this.api2Service.getTicketsByUser(userId).subscribe((tickets: Ticket[]) => {
    const observables = tickets.map(ticket =>
      this.api2Service.getTicketLinesByTicket(ticket.id).pipe(
        map((lines: TicketLine[]) => {
          const filteredLines = lines.filter(line => line.id_ticket === ticket.id);
          return { ...ticket, ticketLines: filteredLines } as TicketWithLines;
        })
      )
    );

    forkJoin(observables).subscribe((ticketsWithLines: TicketWithLines[]) => {
      this.completedTickets = ticketsWithLines;
      
      // Extract all lines into a single array
      this.completedTicketLines = ticketsWithLines.flatMap(t => t.ticketLines);

      console.log('Completed Tickets:', this.completedTickets);
      console.log('Completed Ticket Lines:', this.completedTicketLines);
    });
  });
}





  private calculateTotal(lines: TicketLine[]): number {
    return lines.reduce((acc, line) => acc + (line.price * line.quantity), 0);
  }



  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private themeService: ThemeService,
    private api2Service: Api2Service
  ) { }

  private mapGender(value: number): number {
    return value;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    const fieldsToToggle = [
      'username', 'email', 'name', 'surname', 'birthDate',
      'gender', 'vendor', 'password'
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

    // If there is no password, delete it before sending
    if (!userData.password) {
      delete userData.password;
    }
    console.log('Form data:', userData);
    this.userService.updateUser(userData);
    this.api2Service.updateUser(userData).subscribe({
      next: (response) => {
        console.log('Updated user:', response);
        //this.userService.setUser(userData);
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
    this.router.navigate(['/user/profile']);
  }


  cancel(): void {
    this.router.navigate(['/user/profile']);
  }


  passwordMatchValidator(group: AbstractControl): { [key: string]: any } | null {
    const pwd = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (pwd || confirm) {
      return pwd === confirm ? null : { mismatch: true };
    }
    return null;
  }

  showTicketDetails(ticket: TicketWithLines): void {
    if (this.selectedTicket?.id === ticket.id) {
      this.selectedTicket = null;
    } else {
      const fullTicket = this.completedTickets.find(t => t.id === ticket.id);
      this.selectedTicket = fullTicket || null;
    }
  }


}