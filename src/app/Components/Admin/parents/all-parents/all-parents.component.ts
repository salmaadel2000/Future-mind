import { Component, OnInit } from '@angular/core';
import { ParentService } from '../../../../services/parent.service';
import { Parent } from '../../../../models/Parent.model';
import { Child } from '../../../../models/child.model'; 
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RouterModule, } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
declare const bootstrap: any;
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-parents',
  templateUrl: './all-parents.component.html',
  styleUrls: ['./all-parents.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
})
export class AllParentsComponent implements OnInit {
  parents: Parent[] = [];
  filteredParents: Parent[] = [];
  searchTerm: string = '';
  selectedParent: Parent | null = null;
  selectedChild: Child | null = null; // For storing selected child details
  editForm!: FormGroup;

  constructor(private parentService: ParentService, private router: Router) {}

  ngOnInit() {
    this.parentService.getAllParent().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.parents = response.data;
          this.filteredParents = response.data;
        } else {
          console.error('Expected array but got:', response);
          this.parents = [];
          this.filteredParents = [];
        }
      },
      error => console.error('Error fetching parents data:', error)
    );
  }

  searchParents() {
    this.filteredParents = this.parents.filter(parent =>
      parent.first_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      parent.last_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getLastThreeNewParents(): Parent[] {
    return Array.isArray(this.parents) ? this.parents.slice(-3) : [];
  }

  filterParents(filter: string) {
    if (filter === 'all') {
      this.filteredParents = this.parents;
    }
  }

  viewParent(parent: Parent) {
    this.selectedParent = parent;
    const modalElement = document.getElementById('viewModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  viewChild(child: Child) {
    this.selectedChild = child;
    const modalElement = document.getElementById('childModal');
    if (modalElement) {
      const childModal = new bootstrap.Modal(modalElement);
      childModal.show();
    }
  }

  getChildPhotoUrl(child: Child | null): string {
    if (!child || !child.photo) {
      return '';
    }
    return `http://127.0.0.1:8000/${child.photo}`;
  }

  deleteParent(parentId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this parent!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.parentService.deleteParent(parentId).subscribe(() => {
          this.parents = this.parents.filter(parent => parent.id !== parentId);
          this.filteredParents = this.filteredParents.filter(parent => parent.id !== parentId);
          Swal.fire('Deleted!', 'The parent has been deleted.', 'success');
        }, error => {
          Swal.fire('Error!', 'There was an error deleting the parent.', 'error');
          console.error('Error deleting parent:', error);
        });
      }
    });
  }



  editParent(parent: Parent) {
    console.log('Editing parent with ID:', parent.id);
    const parentId = parent.id;
    this.router.navigate(['/admin-dashboard/accounts/edit-parent', parentId]);
  }}
