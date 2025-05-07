import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Api2Service } from '../services/api/api2.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PokemonTV2';
  constructor(private api2Service: Api2Service) {
    this.api2Service.getUsers().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
/**
    this.api2Service.getProducts().subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any)=>{
        console.error('Error fetching products:', error);
      }
    });

    this.api2Service.getCategories().subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any)=>{
        console.error('Error fetching categories:', error);
      }
    });

    this.api2Service.getCards().subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error: any)=>{
        console.error('Error fetching cards:', error);
      }
    });
    */
  }



}
