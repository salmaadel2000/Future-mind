
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ChildService } from '../../../../services/child.service';
import { Child } from '../../../../models/child.model';
import { ChangeDetectorRef } from '@angular/core';
declare const bootstrap: any;

@Component({
  selector: 'app-student-applicants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-applicants.component.html',
  styleUrls: ['./student-applicants.component.css']
})
export class StudentApplicantsComponent implements OnInit {
  students: Child[] = [];
  filteredStudents: Child[] = [];
  searchTerm: string = '';
  selectedStudent: Child | null = null;

  constructor(private router: Router, private childService: ChildService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadChildren();
  }

  loadChildren(): void {
    this.childService.getChildren().subscribe((children: Child[]) => {
      this.students = children;
      this.filteredStudents = children;
      this.cdr.detectChanges();
    });
  }

  getLastThreePendingStudents(){

    const pendingStudents = this.students.filter(student => student.application?.status === 'pending');

      if (pendingStudents.length < 3) {
        const emptyCards = 3 - pendingStudents.length;
        return [...pendingStudents, ...Array(emptyCards).fill(null)];
      } else {
        return pendingStudents.slice(-3);
      }
  }


  filterStudents(status: string): void {
    if (status === 'student-applicants') {
      this.filteredStudents = this.students.slice().sort((a, b) => {
        const order = ['pending', 'accepted', 'rejected'];
        const statusA = order.indexOf(a.application?.status?.toLowerCase() || '');
        const statusB = order.indexOf(b.application?.status?.toLowerCase() || '');
        return statusA - statusB;
      });
    } else if (status === 'all') {
      this.filteredStudents = this.students.slice().sort((a, b) => {
        const statusA = a.application?.status === 'Pending' ? 1 : 0;
        const statusB = b.application?.status === 'Pending' ? 1 : 0;
        return statusB - statusA;
      });
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.application?.status?.toLowerCase() === status.toLowerCase()
      );
    }
  }


  debugClick(filter: string) {
    console.log(`Filtering for: ${filter}`);
  }

  searchStudents() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.full_name.toLowerCase().includes(searchTermLower)
    );
  }

  addNewStudent() {
    this.router.navigate(['/admin-dashboard/students/add-applicant']);
  }

  viewStudent(student: Child) {
    this.selectedStudent = student;
    console.log("Selected Student:", this.selectedStudent);

    const modalElement = document.getElementById('viewModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  confirmUpdateStudentStatus(newStatus: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to change the status to ${newStatus}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed && this.selectedStudent && this.selectedStudent.application) {
        this.childService.updateApplicationStatus(this.selectedStudent.application.id, newStatus).subscribe(
          () => {
            Swal.close(); // Close the current Swal dialog
            Swal.fire(
              'Updated!',
              `The student's status has been changed to ${newStatus}. Please write a notification to the user.`,
              'success'
            ).then(() => {
              const parentId = this.selectedStudent?.parent?.id;
              if (parentId) {
                this.router.navigate(['/admin-dashboard/Notification-Form', parentId]).then(() => {
                  setTimeout(() => {
                    window.location.reload();
                  }, 100); // Adjust the timeout duration if needed
                });
              } else {
                Swal.fire(
                  'Error!',
                  'The selected student does not have a valid parent ID.',
                  'error'
                );
              }
            });
            this.loadChildren();
          },
          error => {
            console.error('Error updating status:', error);
            Swal.fire(
              'Error!',
              'Failed to update the status.',
              'error'
            );
          }
        );
      }
    });
  }



  updateStudentStatus(newStatus: string) {
    if (this.selectedStudent && this.selectedStudent.application) {
      const formData = new FormData();
      formData.append('status', newStatus);
        this.childService.updateChild(this.selectedStudent.id, formData).subscribe(
        updatedStudent => {
          console.log('Student status updated:', updatedStudent);
          this.selectedStudent = updatedStudent;
          this.loadChildren();
        },
        error => {
          console.error('Error updating student:', error);
        }
      );
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) {
      return '';
    }
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  trackByStudentId(index: number, student: Child) {
    return student.id;
  }

  getStatusTextClass(status: string | undefined): string {
    if (!status) {
      return '';
    }
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }



viewNotification(student: Child) {
  this.selectedStudent = student;
  console.log("Selected Student:", this.selectedStudent);

  const parentId = student.parent?.id;
  if (parentId) {
    this.router.navigate(['/admin-dashboard/Notification-Form', parentId]);
  } else {
    Swal.fire(
      'Error!',
      'The selected student does not have a valid parent ID.',
      'error'
    );
  }
}
}
