import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { ParentRegistrationComponent } from '../parent-registration/parent-registration.component';
import { ChildRegistrationComponent } from '../child-registration/child-registration.component';

@Component({
  selector: 'app-add-applicant',
  standalone: true,
  imports: [CommonModule, RegisterFormComponent, ParentRegistrationComponent, ChildRegistrationComponent],
  templateUrl: './add-applicant.component.html',
  styleUrls: ['./add-applicant.component.css']
})
export class AddApplicantComponent {
  step = 1;
  userId!: number;  // Using definite assignment assertion to indicate that this will be assigned before use
  parentId!: number;  // Using definite assignment assertion to indicate that this will be assigned before use

  constructor(private router: Router) {}

  nextStep(id?: number) {
    if (this.step === 1 && id) {
      this.userId = id;
    } else if (this.step === 2 && id) {
      this.parentId = id;
    }
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onFinish() {
    const role = localStorage.getItem('role');
    if (role === '"parent"') {
      this.router.navigate(['/parent-nav/parent-child']);
    }
    else{
    this.router.navigateByUrl('/admin-dashboard/accounts/all-parents');
    }
  }
}
