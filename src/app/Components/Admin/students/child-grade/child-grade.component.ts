import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GradeService } from '../../../../services/grade.service';
import { Grade } from '../../../../models/grade.model';
import { Subject } from '../../../../models/subject.model';
import { SubjectService } from '../../../../services/subject.service';

@Component({
  selector: 'app-child-grade',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './child-grade.component.html',
  styleUrl: './child-grade.component.css'
})
export class ChildGradeComponent {

  grades: Grade[] = [];
  subjects: { [key: number]: Subject } = {};

  constructor(
    private route: ActivatedRoute,
    private gradeService: GradeService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.getGradeDetails(id);
    });
  }

  getGradeDetails(id: number): void {
    this.gradeService.getGradeChild(id).subscribe(
      (grades: Grade[]) => {
        console.log('Fetched grades:', grades);
        this.grades = grades;
        this.grades.forEach(grade => {
          if (grade.subject_id) {
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
        },
        (error) => {
          console.error('Error fetching subject details:', error);
        }
      );
    }
  }

  getSubjectName(subjectId: number | undefined): string {
    if (subjectId && this.subjects[subjectId]) {
      return this.subjects[subjectId].subject_name;
    }
    return 'Loading...';
  }
}

