import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParentService } from '../../../../services/parent.service';
import { Parent } from '../../../../models/Parent.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-parent',
  templateUrl: './create-parent.component.html',
  styleUrls: ['./create-parent.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateParentComponent {
  @Output() next = new EventEmitter<number>();
  @Input() userId!: number;

  parent: Partial<Parent> = {
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
    const userIdFromLocalStorage = localStorage.getItem('id');
    if (!userIdFromLocalStorage) {
      console.error('User ID not found in localStorage.');
      return;
    }

    const userId = +userIdFromLocalStorage;
    this.parent.user_id = userId;
    this.parentService.createParent(this.parent as Parent).subscribe(
      (parent) => {
        this.saveParentIdToLocalStorage(parent.id);
        this.next.emit(parent.id);
        this.router.navigateByUrl(`/parent-dashboard/${parent.id}`);
      },
      (error) => {
        console.error('Error registering parent:', error);
        if (error.error && error.error.errorMessage) {
          this.errorMessage = error.error.errorMessage;
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