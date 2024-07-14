import { Component, OnInit } from '@angular/core';
import { CurriculumService } from '../../../services/curriculum.service';
import { ChildCurriculumService } from '../../../services/ChildCurriculum.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Curriculum } from '../../../models/Curriculum.model';
import { Child } from '../../../models/child.model';
import { Subject } from '../../../models/subject.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {
  levels: Curriculum[] = [];
  selectedLevel: Curriculum | null = null;
  students: Child[] = [];
  filteredStudents: Child[] = [];
  editForm: FormGroup;
  selectedSubject: Subject | null = null;
  tableClass: string = '';
  searchTerm: string = '';

  constructor(
    private curriculumService: CurriculumService,
    private childCurriculumService: ChildCurriculumService,
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
    this.fetchChildrenByCurriculum(level.id!);
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

  fetchChildrenByCurriculum(curriculumId: number): void {
    this.childCurriculumService.getChildrenByCurriculum(curriculumId).subscribe(
      (children: Child[]) => {
        if (Array.isArray(children)) {
          this.students = children;
          this.filteredStudents = children;
          console.log('Fetched children:', this.students); // Log the fetched children
        } else {
          console.error('Expected an array but got:', children);
        }
      },
      (error: any) => {
        console.error('Error fetching children by curriculum', error);
      }
    );
  }

  deleteStudent(studentId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.childCurriculumService.deleteChild(studentId).subscribe(
          (response: any) => {
            Swal.fire('Deleted!', 'The student has been deleted.', 'success');
            if (this.selectedLevel) {
              this.fetchChildrenByCurriculum(this.selectedLevel.id!);
            }
            this.fetchCurriculums();
          },
          (error: any) => {
            console.error('Error deleting student', error);
            Swal.fire('Error', 'Failed to delete student', 'error');
          }
        );
      }
    });
  }

  addLevel(): void {
    Swal.fire({
      title: 'Add New Level',
      html: `
        <form id="add-level-form">
          <input id="level-name" class="swal2-input" placeholder="Level Name">
          <input id="level-description" class="swal2-input" placeholder="Description">
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Add Level',
      preConfirm: () => {
        const levelName = (document.getElementById('level-name') as HTMLInputElement).value;
        const description = (document.getElementById('level-description') as HTMLInputElement).value;

        if (!levelName || levelName.length < 3 || !/^[a-zA-Z0-9 ]*$/.test(levelName)) {
          Swal.showValidationMessage('Level name must be at least 3 characters long and cannot contain special characters.');
          return false;
        }
        if (!description || description.length < 4 || !/^[a-zA-Z0-9 ]*$/.test(description)) {
          Swal.showValidationMessage('Description must be at least 4 characters long and cannot contain special characters.');
          return false;
        }

        return { levelName, description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newLevel: Curriculum = {
          level: result.value.levelName,
          description: result.value.description,
          subjects: []
        };

        this.curriculumService.createCurriculum(newLevel).subscribe(
          (response: any) => {
            Swal.fire('Success', 'Level added successfully', 'success');
            this.fetchCurriculums();
          },
          (error) => {
            console.error('Error adding level', error);
            Swal.fire('Error', 'Failed to add level', 'error');
          }
        );
      }
    });
  }

  searchChildren(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.full_name.toLowerCase().includes(searchTermLower)
    );
  }

  viewStudent(student: Child): void {
    if (this.selectedLevel) {
      this.router.navigate(['admin-dashboard/student-subjects', this.selectedLevel.id, student.id]);
    } else {
      Swal.fire('Error', 'No level selected', 'error');
    }
  }
}
