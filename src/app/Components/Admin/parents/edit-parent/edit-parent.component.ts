import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentService } from '../../../../services/parent.service';
import { Parent } from '../../../../models/Parent.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-edit-parent',
  templateUrl: './edit-parent.component.html',
  styleUrls: ['./edit-parent.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EditParentComponent implements OnInit {
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
      const parentIdString = params.get('id');
      if (parentIdString !== null) {
        const parentId = +parentIdString; // Use + to convert string to number
        if (!isNaN(parentId)) {
          this.loadParentData(parentId);
        } else {
          console.error('Invalid id parameter:', parentIdString);
          Swal.fire('Error', 'Invalid id parameter.', 'error');
        }
      } else {
        console.error('No id parameter found');
        Swal.fire('Error', 'No id parameter found.', 'error');
      }
    });
  }

  loadParentData(parentId: number): void {
    this.parentService.getParentById(parentId).subscribe(
      (parent: Parent) => {
        this.parent = parent;
        console.log('Fetched parent data:', parent);
      },
      (error) => {
        console.error('Error fetching parent:', error);
        Swal.fire('Error', 'Error fetching parent data.', 'error');
      }
    );
  }

  submitForm(): void {
    if (!this.parent.user_id) {
      Swal.fire('Error', 'User ID is required.', 'error');
      return;
    }

    this.parentService.updateParentAdmin(this.parent).subscribe(
      (data) => {
        console.log('Parent updated successfully:', data);
        Swal.fire('Success', 'Parent updated successfully.', 'success');
        this.router.navigate(['/admin-dashboard/accounts/all-parents']);
      },
      (error) => {
        console.error('Error updating parent:', error);
        Swal.fire('Error', 'Error updating parent.', 'error');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/admin-dashboard/accounts/all-parents']);
  }
}
