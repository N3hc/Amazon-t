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
  temp: number[] = [];


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
        this.user = user;

        this.api2Service.getProductsUserOnlyIdCard(this.user.id).subscribe((response: any) => {
          const idCardString = response.id_card;
          console.log('User:', this.user);
          console.log(this.product);

          response.id_cards = idCardString
            .split(',')
            .map((id: string) => Number(id))

            this.temp = response;
            console.log('Product:', this.temp);



            if (this.product && Array.isArray(this.product.id_card)) {
              for (let id_card of this.product.id_card) {
                console.log('ID Card:', id_card);
                // Aquí puedes hacer algo con cada id_card, como almacenarlo en un array o procesarlo
              }
            } else {
              console.warn('Product is null or id_cards is not an array.');
            }

        }, (error) => {
          console.error('Error fetching product:', error);
        });

      });
    }

}
