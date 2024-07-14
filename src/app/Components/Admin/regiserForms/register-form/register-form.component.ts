import { Component, EventEmitter, Output } from '@angular/core';
import { RegistrationService } from '../../../../services/registrationAdmin.service';
import { FormsModule, NgForm } from '@angular/forms'; // استيراد NgForm
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule , RouterLink],
 
})
export class RegisterFormComponent {
  @Output() next = new EventEmitter<number>();

  user = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    role: 'parent' // Adjust as needed
  };

  constructor(private registrationService: RegistrationService) {}

  onSubmit(registerForm: NgForm) { // تحديد النوع NgForm
    if (registerForm.valid) {
      this.registrationService.registerUser(this.user).subscribe(
        (response) => {
          const userData = response.user;
          localStorage.setItem('Id', userData.id.toString()); // تخزين userId في localStorage
          localStorage.setItem('user', JSON.stringify(userData)); // تخزين جميع بيانات المستخدم في localStorage
          this.next.emit(userData.id); // Emit user ID to parent component
        },
        (error) => {
          console.error('Error registering user:', error);
          // Handle specific error cases, e.g., validation errors
          if (error.status === 422) {
            console.error('Validation errors:', error.error.message);
            // Display error messages to the user if needed
          } else {
            // Handle other types of errors
            console.error('Unexpected error occurred:', error);
          }
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
