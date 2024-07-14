import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { RouterLink, RouterModule } from '@angular/router';
import { Loginservice } from '../../../services/Login.service';
import { ParentService } from '../../../services/parent.service';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterLink, CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit {
  profileId: string | null = null;

  isDropdownOpen: { [key: string]: boolean } = {
    children: false // Adjusted for your specific dropdown
  };

  constructor(
    private loginService: Loginservice,
    private parentService: ParentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Example: Get profile ID from URL parameters
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id');
      console.log('ID from params:', this.profileId);
      // Perform any logic with the retrieved ID here
    });
  }

  toggleDropdown(menu: string) {
    this.isDropdownOpen[menu] = !this.isDropdownOpen[menu];
  }

  logout(): void {
    this.loginService.logout();
  }
}