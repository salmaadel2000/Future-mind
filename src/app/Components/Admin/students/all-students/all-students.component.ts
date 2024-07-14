import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ChildService } from '../../../../services/child.service';
import { CurriculumService } from '../../../../services/curriculum.service';
import { Child } from '../../../../models/child.model';
import { Curriculum } from '../../../../models/Curriculum.model';
import Swal from 'sweetalert2';
declare const bootstrap: any;


@Component({
  selector: 'app-all-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.css']
})
export class AllStudentsComponent implements OnInit {
  students: Child[] = [];
  curriculums: Curriculum[] = [];
  filteredStudents: Child[] = [];
  searchTerm: string = '';
  selectedStudentId: number | null = null;
  selectedCurriculumId: number | null = null;

  constructor(
    private router: Router,
    private childService: ChildService,
    private curriculumService: CurriculumService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.loadChildren();
    this.loadCurriculums();
  }

  loadChildren(): void {
    this.childService.getChildren().subscribe((children: Child[]) => {
      this.students = children;
      this.filterAcceptedStudents();
      this.cdr.detectChanges();
    });
  }

  loadCurriculums(): void {
    this.curriculumService.getCurriculums().subscribe((curriculums: Curriculum[]) => {
      this.curriculums = curriculums;
    });
  }

  filterAcceptedStudents(): void {
    this.filteredStudents = this.students.filter(student =>
      student.application?.status === 'accepted'
    );
  }

  filterStudents(status: string): void {
    if (status === 'student-applicants') {
      this.filteredStudents = this.students.slice().sort((a, b) => {
        const statusA = a.application?.status === 'Pending' ? 1 : 0;
        const statusB = b.application?.status === 'Pending' ? 1 : 0;
        return statusB - statusA;
      });
    } else if (status === 'all') {
      this.filteredStudents = this.students.slice();
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.application?.status?.toLowerCase() === status.toLowerCase()
      );
    }
  }

  searchChildren(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.full_name.toLowerCase().includes(searchTermLower)
    );
  }

  getLastThreeAcceptedStudents() {
    const acceptedStudents = this.students.filter(student => student.application?.status === 'accepted');
    if (acceptedStudents.length < 3) {
      const emptyCards = 3 - acceptedStudents.length;
      return [...acceptedStudents, ...Array(emptyCards).fill(null)];
    } else {
      return acceptedStudents.slice(-3);
    }
  }

  viewStudent(student: Child) {
    this.selectedStudentId = student.id;

    Swal.fire({
      title: `<strong>${student.full_name}</strong>`,
      html: `
        <div style="text-align: left;">
          <div class="info-sections">
            <div class="info-section">
              <h3>General Information</h3>
              <p><strong>Full Name:</strong> ${student.full_name}</p>
              <p><strong>Birth Date:</strong> ${student.birthdate}</p>
              <p><strong>Place of Birth:</strong> ${student.place_of_birth}</p>
              <p><strong>Gender:</strong> ${student.gender}</p>
              <p><strong>Current Residence:</strong> ${student.current_residence}</p>
              <p><strong>Level:</strong> ${student.level || 'N/A'}</p>
              <p><strong>Grades:</strong> ${student.grades || 'N/A'}</p>
            </div>
          </div>
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'custom-swal-popup'
      }
    });
  }


  trackByStudentId(index: number, student: any) {
    return student.id;
  }

  deleteStudent(student: Child): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${student.full_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.childService.deleteChild(student.id).subscribe(() => {
          this.students = this.students.filter(s => s.id !== student.id);
          this.filterAcceptedStudents();
          this.ngZone.run(() => {
            this.cdr.detectChanges();
          });
          Swal.fire(
            'Deleted!',
            `${student.full_name} has been deleted.`,
            'success'
          );
        });
      }
    });
  }

  showAddNewModal() {
    const modalElement = document.getElementById('addNewModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  addToExistingParent() {
    this.router.navigate(['/admin-dashboard/all-students/addexistingParents'], { queryParams: { parentType: 'existing' } });
  }

  addToNewParent() {
    this.router.navigate(['/admin-dashboard/accounts/add-applicant'], { queryParams: { parentType: 'new' } });
  }
  showAddLevelModal(student: Child) {
    this.selectedStudentId = student.id;

    Swal.fire({
      title: 'Add Level',
      html: `
        <form>
          <div class="mb-3">
            <label for="levelSelect" class="form-label">Select Level</label>
            <select id="levelSelect" class="form-select" [(ngModel)]="selectedCurriculumId" name="selectedCurriculumId">
              ${this.curriculums.map(curriculum => `<option value="${curriculum.id}">${curriculum.level}</option>`).join('')}
            </select>
          </div>
          <input type="hidden" [(ngModel)]="selectedStudentId" name="selectedStudentId" value="${this.selectedStudentId}">
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add Level',
      preConfirm: () => {
        const selectedCurriculumId = (document.getElementById('levelSelect') as HTMLSelectElement).value;
        if (!selectedCurriculumId) {
          Swal.showValidationMessage('Please select a level');
          return false;
        }
        this.selectedCurriculumId = Number(selectedCurriculumId);
        return true;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.addLevelToStudent();
      }
    });
  }

  addLevelToStudent() {
    if (this.selectedStudentId && this.selectedCurriculumId) {
      this.childService.addChildToLevel(this.selectedStudentId, this.selectedCurriculumId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Level added successfully',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.loadChildren(); // إعادة تحميل البيانات بعد إضافة المستوى بنجاح
          });
        },
        error: (error) => {
          if (error.status === 422) {
            Swal.fire({
              icon: 'warning',
              title: 'Student Already in Level',
              text: 'This student is already assigned to the selected level.',
              showConfirmButton: true,
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while adding the level.',
              showConfirmButton: true,
              confirmButtonText: 'OK'
            });
          }
        }
      });
    }
  }

  editChild(childId: number): void {
    this.router.navigate(['/admin-dashboard/students/edit-child', childId]);
  }
}
