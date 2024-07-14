import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Parent } from '../../../models/Parent.model';
import { ParentService } from '../../../services/parent.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone:true,
  selector: 'app-parent-edit',
  imports: [CommonModule,FormsModule],
  templateUrl: './parent-edit.component.html',
  styleUrls: ['./parent-edit.component.css']
})
export class ParentEditComponent implements OnInit {
  parent: Parent = {
    id: 0,
    user_id: 0,
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
    apartment_number: '',
    children: []
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parentService: ParentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        const parentId = +id; // Convert id to number if not null
        this.parentService.getParentById(parentId).subscribe(
          (parent: Parent) => {
            this.parent = parent; // Assign fetched parent data
          },
          (error) => {
            console.error('Error fetching parent:', error);
          }
        );
      } else {
        console.error('No ID parameter found');
      }
    });
  }
  

  submitForm(): void {
    this.parentService.updateParent(this.parent).subscribe(
      (data) => {
        console.log('Parent updated successfully:', data);
        // Navigate to parent profile page after successful update
        if (this.parent.id) {
          this.router.navigate(['/parent-nav/parent-profile', this.parent.id]);
        } else {
          console.error('Parent ID not found to navigate');
        }
      },
      (error) => {
        console.error('Error updating parent:', error);
        // Handle error as needed
      }
    );
  }
  cancel() {
    this.router.navigate(['/parent-nav/parent-profile', this.parent.id]);
  }
}