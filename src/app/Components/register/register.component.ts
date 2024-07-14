import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User, Auth } from '../../models/Register.model';
import { AuthService } from '../../services/Register.service ';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = new User('', '', '', '', '', 'parent');
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(registerForm: NgForm): void {
    if (registerForm.invalid || this.user.password !== this.user.password_confirmation) {
      this.errorMessage = 'Please fill out the form correctly and ensure passwords match.';
      return;
    }

    this.authService.register(this.user).subscribe(
      (response: Auth) => {
        console.log(response);
        localStorage.setItem('token', response.access_token);
        if (response.user?.id) {
          localStorage.setItem('id', response.user.id.toString());
          this.router.navigateByUrl('/login');
        }
      },
      (error) => {
        console.log(error);
        if (error.errors) {
          this.errorMessage = this.formatErrors(error.errors);
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    );
  }

  private formatErrors(errors: any): string {
    let messages: string[] = [];
    for (let key in errors) {
      if (errors[key].length > 0) {
        messages.push(errors[key].join(' '));
      }
    }
    return messages.join('\n');
  }
}
