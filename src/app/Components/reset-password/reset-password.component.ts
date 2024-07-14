import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string;

  constructor(private http: HttpClient, private router: Router) {
    this.email = '';
  }

  onSubmit() {
    if (!this.email || !this.validateEmail(this.email)) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a valid email address.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        showClass: {
          popup: 'swal2-noanimation',
          backdrop: 'swal2-noanimation'
        },
        hideClass: {
          popup: '',
          backdrop: ''
        }
      });
      return;
    }

    const payload = { email: this.email };

    this.http.post('http://localhost:8000/api/auth/password/email', payload).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Success',
          text: 'Reset link sent to your email address.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          showClass: {
            popup: 'swal2-noanimation',
            backdrop: 'swal2-noanimation'
          },
          hideClass: {
            popup: '',
            backdrop: ''
          }
        });
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error sending reset link', error);
        Swal.fire({
          title: 'Error',
          text: 'Error sending reset link. Please try again.',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          showClass: {
            popup: 'swal2-noanimation',
            backdrop: 'swal2-noanimation'
          },
          hideClass: {
            popup: '',
            backdrop: ''
          }
        });
      }
    );
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
}
