import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreateChildComponent } from '../create-child/child-registration.component';
import { CreateParentComponent } from '../create-parent/create-parent.component';

@Component({
  selector: 'app-add-applicant',
  standalone: true,
  imports: [CommonModule, CreateParentComponent, CreateChildComponent],
  templateUrl: './create-applicant.component.html',
  styleUrls: ['./create-applicant.component.css']
})
export class CreateApplicantComponent {
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
      
      console.log(this.parentId)
      this.router.navigate(['/parent-nav/parent-child/', this.parentId]);
}
}
