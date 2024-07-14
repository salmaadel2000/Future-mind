import { Component } from '@angular/core';
import { Loginservice } from '../../services/Login.service';
import { Router } from '@angular/router';
import { Login, Auth } from '../../models/Register.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignInAlt, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule, RouterLink],
})
export class LoginComponent {
  Login: Login = new Login("", "");
  errorMessage: string | null = null;

  constructor(
    private loginService: Loginservice,
    private router: Router
  ) {}

  login(LoginForm: NgForm): void {
    if (LoginForm.invalid) {
      return;
    }

    this.loginService.login(this.Login).subscribe(
      (response: Auth) => {
        console.log('Full Response:', response);

        if (response.access_token) {
          try {
            localStorage.setItem('access_token', response.access_token);
            console.log('Token stored successfully');
          } catch (e) {
            console.error('Error storing token:', e);
          }
        } else {
          console.error('Access token is missing in the response');
        }

        if (response.user && response.user.id) {
          console.log('User:', response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('id', response.user.id.toString());
          localStorage.setItem('role', JSON.stringify(response.user.role));

          // Check if user is a parent and navigate accordingly
          if (response.user.role === 'parent') {
            if (response.additional_data && response.additional_data.parent !== undefined) {
              const isParent = response.additional_data.parent;
              if (isParent) {
                // Update parentId in local storage
                localStorage.setItem('parentId', response.user.id.toString());
                
                // Navigate to parent dashboard with parent ID
                const parentId = localStorage.getItem('parentId');
                if (parentId) {
                  this.router.navigateByUrl(`/parent-dashboard/${parentId}`);
                } else {
                  console.error('Parent ID not found in local storage');
                  // Handle scenario where parent ID is not available
                }
              } else {
                // Navigate to create parent route
                this.router.navigateByUrl('/create-parent');
              }
            } else {
              console.error('Parent information not found in the response');
            }
          } else {
            // Navigate to admin dashboard for non-parent roles
            this.router.navigateByUrl('admin-dashboard/welcome-admin');
          }
        } else {
          console.error('User data or user ID is missing in the response');
        }

        this.errorMessage = null;
      },
      (error) => {
        console.error('Login error:', error);
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    );
  }
}
