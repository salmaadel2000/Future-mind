import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Loginservice } from '../../../services/Login.service';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule , RouterOutlet , RouterLink ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
 
  constructor(private loginService: Loginservice , private router: Router ) { }

  ngOnInit(): void {
  }

  isDropdownOpen: { [key: string]: boolean } = {
    accounts: false,
    students: false,
  };

  isActive(menu: string): boolean {
    return this.router.url.includes(menu);
  }

  toggleDropdown(menu: string) {
    this.isDropdownOpen[menu] = !this.isDropdownOpen[menu];
  }


  logout(): void {
   
    this.loginService.logout();
    
  }

}
