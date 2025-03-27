import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; 
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { CardsApiService } from './services/api/cards-api.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  
    CardsApiService,
    [provideRouter(routes)]
  ]
}).catch(err => console.error(err));
