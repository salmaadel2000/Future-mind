import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ChildService } from '../../../services/child.service';
import { Child } from '../../../models/child.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-welcome-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './welcome-admin.component.html',
  styleUrls: ['./welcome-admin.component.css']
})
export class WelcomeAdminComponent implements OnInit {
  students: Child[] = [];
  filteredStudents: Child[] = [];
  searchTerm: string = '';
  selectedStudent: Child | null = null;

  constructor(private router: Router, private childService: ChildService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadChildren();
  }

  loadChildren(): void {
    this.childService.getChildren().subscribe({
      next: (children: Child[]) => {
        this.students = children;
        this.filteredStudents = children;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading children:', err);
      }
    });
  }

  getLastThreePendingStudents(): Child[] {
    const pendingStudents = this.students.filter(student => student.application?.status === 'pending');
    return pendingStudents.slice(0, 3);
  }

  getPendingStudents() {
    const pendingStudents = this.students.filter(student => student.application?.status === 'pending');
    return pendingStudents.slice(0, 3);
}

}
