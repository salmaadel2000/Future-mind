import { Component } from '@angular/core';
import { Loginservice } from '../../../services/Login.service'; 
import { RouterOutlet ,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParentService } from '../../../services/parent.service';
import { RouterModule } from '@angular/router'; 
@Component({
  selector: 'app-parent-nav',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,RouterLink,RouterModule
  ],
  templateUrl: './parent-nav.component.html',
  styleUrl: './parent-nav.component.css'
})
export class ParentNavComponent {
  constructor(private loginService: Loginservice ,private ParentService:ParentService) { }

  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.loginService.getTokenFromLocalStorage() !== null;
  }

  logout(): void {
   
    this.loginService.logout();
    
  }
  getProfileIdFromLocalStorage(): string | null {
    return this.ParentService.getProfileIdFromLocalStorage();
  }
}