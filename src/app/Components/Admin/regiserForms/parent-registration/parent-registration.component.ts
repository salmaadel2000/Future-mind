import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParentService } from '../../../../services/parent.service';
import { Parent } from '../../../../models/Parent.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-parent-registration',
  templateUrl: './parent-registration.component.html',
  styleUrls: ['./parent-registration.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ParentRegistrationComponent {
  @Output() next = new EventEmitter<number>();
  @Input() userId!: number;

  parent: Partial<Parent> = {
    user_id: this.userId,
    first_name: '',
    last_name: '',
    educational_qualification: '',
    job_title: '',
    workplace: '',
    work_phone: '',
    personal_phone: '',
    address: '',
    home_phone: '',
    street_number: '',
    apartment_number: ''
  };
  errorMessage: string | null = null;

  constructor(private parentService: ParentService, private router: Router) {}

  onSubmit() {
    let userId: number | null = this.userId;

    // if (!userId) {
    //   console.error('User ID not provided.');
    //   return;
    // }

    const role = localStorage.getItem('role');
    if (role === '"parent"') {
      const userIdFromLocalStorage = localStorage.getItem('id');
      console.log(userIdFromLocalStorage)
      if (userIdFromLocalStorage) {
        userId= +userIdFromLocalStorage;
        this.parent.user_id = userId;
        console.log(this.parent.user_id)
      } else {
        console.error('User ID not found in localStorage.');
        return;
      }
      this.router.navigate(['/child']);
      return;
    }

    this.parent.user_id = userId;
    this.parentService.createParent(this.parent as Parent).subscribe(
      (parent) => {
        this.saveParentIdToLocalStorage(parent.id);
        this.next.emit(parent.id);
      },
      (error) => {
        console.error('Error registering parent:', error);
        if (error.error && error.error.errors) {
          this.errorMessage = error.error.message; // Adjust to match actual error structure
        } else {
          this.errorMessage = 'Error registering parent. Please try again.';
        }
      }
    );
  }

  private saveParentIdToLocalStorage(parentId: number) {
    localStorage.setItem('parentId', parentId.toString());
  }
}
