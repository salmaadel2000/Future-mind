import { Component , OnInit } from '@angular/core';
import { Loginservice } from '../../../services/Login.service'; 
import { RouterOutlet ,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar-component.component.html',
  styleUrls: ['./navbar-component.component.css'],
  imports: [
    RouterOutlet,
    CommonModule,RouterLink,RouterModule 
  ],
})
export class NavbarComponent implements OnInit {

  constructor(private loginService: Loginservice) { }
  parentId: string | null = null;

  ngOnInit() {
    this.parentId = localStorage.getItem('parentId');
  }

  isLoggedIn(): boolean {
    return this.loginService.getTokenFromLocalStorage() !== null;
  }

  logout(): void {
    this.loginService.logout();
  }

}