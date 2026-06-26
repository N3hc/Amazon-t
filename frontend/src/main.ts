import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { langInterceptor } from './app/core/interceptors/lang.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([langInterceptor])),  
    [provideRouter(routes)]
  ]
}).catch(err => console.error(err));
