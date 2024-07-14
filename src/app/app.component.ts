import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponentComponent } from './Components/layout/footer-component/footer-component.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/login.interceptor'; 
import { Loginservice  } from './services/Login.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponentComponent,
  ],
  providers: [
    Loginservice ,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-project';
}
