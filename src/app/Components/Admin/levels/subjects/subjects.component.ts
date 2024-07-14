import { Component, OnInit } from '@angular/core';
import { CurriculumService } from '../../../../services/curriculum.service';
import { SubjectService } from '../../../../services/subject.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Curriculum } from '../../../../models/Curriculum.model';
import { Subject } from '../../../../models/subject.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css'
})
export class SubjectsComponent implements OnInit {
  levels: Curriculum[] = [];
  selectedLevel: Curriculum | null = null;
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  editForm: FormGroup;
  selectedSubject: Subject | null = null;
  tableClass: string = '';
  searchTerm: string = ''; // Add search term variable

  constructor(
    private curriculumService: CurriculumService,
    private subjectService: SubjectService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      subject_name: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      description: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9 ]*$')]]
    });
  }

  ngOnInit(): void {
    this.fetchCurriculums();
  }

  fetchCurriculums(): void {
    this.curriculumService.getCurriculums().subscribe(
      (data: Curriculum[]) => {
        this.levels = data;
        if (this.levels.length > 0) {
          this.selectLevel(this.levels[0], 0);
        }
      },
      (error) => {
        console.error('Error fetching curriculums', error);
      }
    );
  }

  selectLevel(level: Curriculum, index: number): void {
    this.selectedLevel = level;
    this.tableClass = this.getTableClass(index);
    this.fetchSubjects(level.id!); // استخدام non-null assertion operator
  }

  getTableClass(index: number): string {
    switch (index) {
      case 0:
        return 'table-primary';
      case 1:
        return 'table-secondary';
      case 2:
        return 'table-success';
      case 3:
        return 'table-danger';
      default:
        return '';
    }
  }

  fetchSubjects(curriculumId: number): void {
    this.subjectService.getSubjectsByCurriculum(curriculumId).subscribe(
      (response: any) => {
        this.subjects = response;
        this.filteredSubjects = response; // Initialize filtered subjects
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
  }

  addSubject(): void {
    if (!this.selectedLevel) {
      Swal.fire('Error', 'Please select a level first', 'error');
      return;
    }

    Swal.fire({
      title: 'Add New Subject',
      html: `
        <form id="add-subject-form">
          <input id="subject-name" class="swal2-input" placeholder="Subject Name">
          <input id="subject-description" class="swal2-input" placeholder="Description">
        </form>
      `,
      showCancelButton: true, // Show cancel button
      focusConfirm: false,
      preConfirm: () => {
        const subjectName = (document.getElementById('subject-name') as HTMLInputElement).value;
        const description = (document.getElementById('subject-description') as HTMLInputElement).value;

        if (!subjectName || subjectName.length < 4 || !/^[a-zA-Z0-9 ]*$/.test(subjectName)) {
          Swal.showValidationMessage('Subject name must be at least 4 characters long and cannot contain special characters.');
          return false;
        }
        if (!description || description.length < 4 || !/^[a-zA-Z0-9 ]*$/.test(description)) {
          Swal.showValidationMessage('Description must be at least 4 characters long and cannot contain special characters.');
          return false;
        }

        return { subjectName, description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newSubject: Subject = {
          curriculum_id: this.selectedLevel!.id!,
          subject_name: result.value.subjectName,
          description: result.value.description
        };

        this.subjectService.createSubject(newSubject).subscribe(
          (response: any) => {
            Swal.fire('Success', 'Subject added successfully', 'success');
            this.fetchSubjects(this.selectedLevel!.id!); // Refresh the list of subjects
          },
          (error) => {
            console.error('Error adding subject', error);
            Swal.fire('Error', 'Failed to add subject', 'error');
          }
        );
      }
    });
  }

  editSubject(subject: Subject): void {
    this.selectedSubject = subject;

    Swal.fire({
      title: 'Edit Subject',
      html: `
        <form id="edit-subject-form">
          <input id="subject-name" class="swal2-input" placeholder="Subject Name" value="${subject.subject_name}">
          <input id="subject-description" class="swal2-input" placeholder="Description" value="${subject.description}">
        </form>
      `,
      showCancelButton: true, // Show cancel button
      focusConfirm: false,
      preConfirm: () => {
        const subjectName = (document.getElementById('subject-name') as HTMLInputElement).value;
        const description = (document.getElementById('subject-description') as HTMLInputElement).value;

        if (!subjectName || subjectName.length < 4 || !/^[a-zA-Z0-9 ]*$/.test(subjectName)) {
          Swal.showValidationMessage('Subject name must be at least 4 characters long and cannot contain special characters.');
          return false;
        }
        if (!description || description.length < 4 || !/^[a-zA-Z0-9 ]/.test(description)) {
          Swal.showValidationMessage('Description must be at least 4 characters long and cannot contain special characters.');
          return false;
        }

        return { subjectName, description };
      }
    }).then((result) => {
      if (result.isConfirmed && this.selectedSubject) {
        const updatedData = {
          subject_name: result.value.subjectName,
          description: result.value.description
        };

        this.subjectService.updateSubject(this.selectedSubject.id!, updatedData).subscribe(
          (response: any) => {
            Swal.fire('Success', 'Subject updated successfully', 'success');
            this.fetchSubjects(this.selectedLevel!.id!); // استخدام non-null assertion operator
          },
          (error) => {
            console.error('Error updating subject', error);
            Swal.fire('Error', 'Failed to update subject', 'error');
          }
        );
      }
    });
  }

  deleteSubject(subject: Subject): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the subject "${subject.subject_name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subjectService.deleteSubject(subject.id!).subscribe(
          (response: any) => {
            Swal.fire('Deleted!', 'The subject has been deleted.', 'success');
            this.fetchSubjects(this.selectedLevel!.id!); // استخدام non-null assertion operator
          },
          (error) => {
            console.error('Error deleting subject', error);
            Swal.fire('Error', 'Failed to delete subject', 'error');
          }
        );
      }
    });
  }

  // Add the search function
  searchSubjects(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredSubjects = this.subjects.filter(subject =>
      subject.subject_name.toLowerCase().includes(searchTermLower)
    );
  }
}
