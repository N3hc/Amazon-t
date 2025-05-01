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

  constructor(private api: Api2Service) {
    this.api.getUsers().subscribe((data) => {
      console.log(data);
    });
  } 
}
