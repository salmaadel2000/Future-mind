import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loginservice } from '../services/Login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: Loginservice) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.loginService.getTokenFromLocalStorage()
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next.handle(authReq);
  }
}
