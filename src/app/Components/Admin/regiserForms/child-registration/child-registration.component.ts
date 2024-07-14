import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ChildService } from '../../../../services/child.service';
import { Child } from '../../../../models/child.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // استيراد NgForm
import { Router } from '@angular/router';

@Component({
  selector: 'app-child-registration',
  templateUrl: './child-registration.component.html',
  styleUrls: ['./child-registration.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChildRegistrationComponent implements OnInit {
  @Input() parentId!: number;
  @Output() finish = new EventEmitter<void>();

  child: Partial<Child> = {
    parent_id: 0, // Initialize with a default value
    full_name: '',
    birthdate: '',
    place_of_birth: '',
    gender: '',
    current_residence: ''
  };

  selectedFile: File | null = null;
  errorMessage: string | null = null;

  constructor(private childService: ChildService, private router: Router) {}

  ngOnInit() {
    // Retrieve parent ID from local storage
    const parentIdFromStorage = localStorage.getItem('parentId');
    if (parentIdFromStorage) {
      this.parentId = +parentIdFromStorage; // Convert to number if retrieved successfully
      this.child.parent_id = this.parentId; // Set parent ID in child object
    } else {
      console.error('Parent ID not found in local storage.');
      // Handle case where parent ID is not found in local storage
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(childForm: NgForm) { // تحديد النوع NgForm
    if (childForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('parent_id', this.child.parent_id!.toString());
      formData.append('full_name', this.child.full_name!);
      formData.append('birthdate', this.child.birthdate!);
      formData.append('place_of_birth', this.child.place_of_birth!);
      formData.append('gender', this.child.gender!);
      formData.append('current_residence', this.child.current_residence!);
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      this.childService.createChild(formData).subscribe(
        () => {
          this.finish.emit();
        },
        error => {
          console.error('Error registering child:', error);
          this.errorMessage = 'Error registering child. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields, ensure gender is either "MALE" or "FEMALE", and upload a photo.';
    }
  }
}
