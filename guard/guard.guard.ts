import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Loginservice} from '../services/Login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private Loginservice:Loginservice , private router: Router) {}

  canActivate(): boolean {
    const token = this.Loginservice.getTokenFromLocalStorage();
    const userId = this.Loginservice.getCurrentUser();
    
    if (token && userId) {
      return true; 
    } else {
      this.router.navigateByUrl('/login'); 
      return false;
    }
  } 
}
