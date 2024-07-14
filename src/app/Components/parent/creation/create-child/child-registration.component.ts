import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ChildService } from '../../../../services/child.service';
import { Child } from '../../../../models/child.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-child',
  templateUrl: './create-child.component.html',
  styleUrls: ['./create-child.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateChildComponent implements OnInit {
  @Output() finish = new EventEmitter<void>();

  child: Partial<Child> = {
    parent_id: 0,
    full_name: '',
    birthdate: '',
    place_of_birth: '',
    gender: '',
    current_residence: ''
  };

  selectedFile: File | null = null;
  errorMessage: string | null = null;

  constructor(private childService: ChildService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve parent ID from local storage
    const parentIdFromStorage = localStorage.getItem('parentId');
    if (parentIdFromStorage) {
      this.child.parent_id = +parentIdFromStorage; // Convert to number if retrieved successfully
    } else {
      console.error('Parent ID not found in local storage.');
      // Handle case where parent ID is not found in local storage
    }
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
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
        this.finish.emit(); // Emit event to indicate submission success
        this.router.navigate(['/parent-nav/pend-child', this.child.parent_id]); // Navigate to parent-child route
      },
      error => {
        console.error('Error registering child:', error);
        this.errorMessage = 'Error registering child. Please try again.';
      }
    );
  }
}