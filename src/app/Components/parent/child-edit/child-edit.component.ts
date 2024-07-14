import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChildService } from '../../../services/child.service';
import { Child } from '../../../models/child.model';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-child-edit',
  standalone: true,
  templateUrl: './child-edit.component.html',
  styleUrls: ['./child-edit.component.css']
})
export class ChildEditComponent implements OnInit {
  child: Child = {
    id: 0,
    parent_id: 0,
    full_name: '',
    birthdate: '',
    place_of_birth: '',
    gender: 'male',
    current_residence: ''
  };
  errorMessage: string | null = null;
  selectedFile: File | null = null;
  fileData: any;
  photoWidth: number = 100; // Initial width of the profile photo

  constructor(
    private childService: ChildService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const childId = +params['id'];
      if (childId) {
        this.fetchChildData(childId);
      } else {
        console.error('Child ID is not available in route parameters');
      }
    });
  }

  fetchChildData(id: number): void {
    this.childService.getChild(id).subscribe(
      (childData) => {
        this.child = childData;
        this.fileData = childData.photo ? 'http://127.0.0.1:8000/' + childData.photo : null;
      },
      (error) => {
        console.error('Error fetching child data:', error);
      }
    );
  }

  submit(EditForm: NgForm): void {
    if (EditForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const formData = new FormData();
    formData.append('full_name', this.child.full_name);
    formData.append('birthdate', this.child.birthdate);
    formData.append('place_of_birth', this.child.place_of_birth);
    formData.append('gender', this.child.gender);
    formData.append('current_residence', this.child.current_residence);
    formData.append('_method', 'PUT');
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    if (this.child.id !== null && this.child.id !== undefined) {
      this.childService.updateChild(this.child.id, formData).subscribe(
        (response) => {
          console.log('Child updated successfully');
          this.router.navigate(['/parent-nav/pend-child', this.child.id]);
        },
        (error) => {
          console.error('Error updating child:', error);
          this.errorMessage = 'An error occurred while updating child data.';
        }
      );
    } else {
      console.error('Child ID is null or undefined');
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.child.photo = file.name;
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.errorMessage = null;
      this.readFile(file);
    } else {
      this.selectedFile = null;
      this.errorMessage = 'Please select a valid image file.';
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.fileData = reader.result;
    };
    reader.readAsDataURL(file);
  }

  cancel() {
    this.router.navigate(['/parent-nav/pend-child', this.child.id]);
  }
}
