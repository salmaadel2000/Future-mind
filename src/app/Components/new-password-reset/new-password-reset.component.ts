import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-new-password-reset',
  standalone: true,
  imports: [FormsModule,CommonModule, FontAwesomeModule,RouterLink,ReactiveFormsModule],
  templateUrl: './new-password-reset.component.html',
  styleUrls: ['./new-password-reset.component.css']
})


export class NewPasswordResetComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      this.email = params.get('email');
      console.log('Token:', this.token);
      console.log('Email:', this.email);
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      if (!this.token || !this.email) {
        Swal.fire('Error', 'Missing token or email.', 'error');
        return;
      }

      const payload = {
        email: this.email,
        token: this.token,
        password: this.resetPasswordForm.get('password')?.value,
        password_confirmation: this.resetPasswordForm.get('password_confirmation')?.value
      };

      this.http.post('http://localhost:8000/api/auth/password/reset', payload).subscribe(
        (response: any) => {
          Swal.fire('Success', 'Password successfully reset. You can now log in with your new password.', 'success');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error resetting password', error);
          Swal.fire('Error', `Error: ${error.error.message}`, 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Please ensure all fields are filled correctly.', 'error');
    }
  }
}