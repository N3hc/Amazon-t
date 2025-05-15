import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { Api2Service } from '../../../../services/api/api2.service';
import { UserService } from '../../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../../interface/user.interface';
import { Router } from '@angular/router';
import { Product } from '../../../../interface/productos.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  @Input() userId!: number;
  @Input() isDarkMode: boolean = false;
  @Input() isEditMode: boolean = false;

  product: Product | null = null;
  user: User | null = null;
  addresses: any[] = [];

  
    constructor(
      private userService: UserService,
      private api2Service: Api2Service,
      private router: Router
    ) { }

  ngOnInit(): void {
    // Fetch user details if userId is provided
    this.userService.getUser().subscribe((user: User | null) => {
      if (!user) {
        console.warn('No hay usuario cargado');
        this.router.navigate(['/home']);
        return;
      }
      
      this.api2Service.getProductsByUser(user.id).subscribe((product: Product) => {
        this.product =  product;
        console.log('User:', user);
        console.log(this.product);
      });
  });
  
}
}
