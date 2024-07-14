import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GradeService } from '../../services/grade.service';
import { Grade } from '../../models/grade.model';
import { Subject } from '../../models/subject.model';
import { SubjectService } from '../../services/subject.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-grade-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.css']
})
export class GradeListComponent implements OnInit, AfterViewInit {
  grades: Grade[] = [];
  subjects: { [key: number]: Subject } = {};
  uniqueSubjects: Subject[] = [];

  constructor(
    private route: ActivatedRoute,
    private gradeService: GradeService,
    private subjectService: SubjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.getGradeDetails(id);
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  getGradeDetails(id: number): void {
    this.gradeService.getGradeChild(id).subscribe(
      (grades: Grade[]) => {
        console.log('Fetched grades:', grades);
        this.grades = grades;
        const subjectIds = new Set<number>();
        this.grades.forEach(grade => {
          if (grade.subject_id && !subjectIds.has(grade.subject_id)) {
            subjectIds.add(grade.subject_id);
            this.loadSubjectName(grade.subject_id);
          }
        });
      },
      (error) => {
        console.error('Error fetching grade details:', error);
      }
    );
  }

  loadSubjectName(subjectId: number): void {
    if (!this.subjects[subjectId]) {
      this.subjectService.getSubjectById(subjectId).subscribe(
        (subject: Subject) => {
          console.log('Fetched subject:', subject);
          this.subjects[subjectId] = subject;
          this.updateUniqueSubjects();
        },
        (error) => {
          console.error('Error fetching subject details:', error);
        }
      );
    }
  }

  updateUniqueSubjects(): void {
    this.uniqueSubjects = Object.values(this.subjects);
  }

  getSubjectName(subjectId: number | undefined): string {
    if (subjectId && this.subjects[subjectId]) {
      return this.subjects[subjectId].subject_name;
    }
    return 'Loading...';
  }

  viewGrades(subjectId: number): void {
    const subjectGrades = this.grades.filter(grade => grade.subject_id === subjectId);
    const gradesHtml = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${subjectGrades.map(grade => `
            <tr>
              <td>${grade.grade}</td>
              <td>${new Date(grade.created_at).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    Swal.fire({
      title: `Grades for ${this.getSubjectName(subjectId)}`,
      html: gradesHtml || '<p>No grades available</p>',
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Close'
    });
  }
}
