import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChildCurriculumService } from '../../../../services/ChildCurriculum.service';
import { Subject } from '../../../../models/subject.model';
import { GradeService } from '../../../../services/grade.service';
import { Grade } from '../../../../models/grade.model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-child-level-details',
  templateUrl: './child-level-details.component.html',
  styleUrls: ['./child-level-details.component.css']
})
export class ChildLevelDetailsComponent implements OnInit {
  curriculumId: number | undefined;
  childId: number | undefined;
  subjects: Subject[] = [];
  childName: string | undefined;
  grades: Grade[] = [];

  constructor(
    private route: ActivatedRoute,
    private childCurriculumService: ChildCurriculumService,
    private gradeService: GradeService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.curriculumId = +params['curriculumId'];
      this.childId = +params['childId'];
      this.fetchSubjects();
      this.fetchChildName();
      this.fetchGrades();
    });
  }

  fetchSubjects(): void {
    if (this.curriculumId && this.childId) {
      this.childCurriculumService.getChildSubjects(this.curriculumId, this.childId).subscribe(
        (response: { all_subjects: Subject[], child_subjects: Subject[] }) => {
          this.subjects = response.all_subjects;
        },
        (error) => {
          console.error('Error fetching subjects', error);
        }
      );
    }
  }

  fetchChildName(): void {
    if (this.childId) {
      this.childCurriculumService.getChild(this.childId).subscribe(
        (response: any) => {
          console.log('API Response:', response);
          this.childName = response.data.full_name;
        },
        (error) => {
          console.error('Error fetching child name', error);
        }
      );
    }
  }

  fetchGrades(): void {
    if (this.childId) {
      this.gradeService.getGradeChild(this.childId).subscribe(
        (grades: Grade[]) => {
          console.log('Grades data:', grades);
          this.grades = grades;
        },
        (error) => {
          console.error('Error fetching grades', error);
        }
      );
    }
  }

  getGradesForSubject(subjectId: number): Grade[] {
    return this.grades.filter(grade => grade.subject_id === subjectId);
  }

  viewGrades(subject: Subject): void {
    if (subject.id === undefined) {
      console.error('Subject ID is undefined');
      return;
    }

    const grades = this.getGradesForSubject(subject.id);
    const gradesHtml = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Date of Insert</th>
            
          </tr>
        </thead>
        <tbody>
          ${grades.map(grade => 
            `<tr>
              <td>${grade.grade}</td>
              <td>${new Date(grade.created_at).toLocaleString()}</td>
             
            </tr>`
          ).join('')}
        </tbody>
      </table>
    `;

    Swal.fire({
      title: `Grades for ${subject.subject_name}`,
      html: gradesHtml || '<p>No grades available</p>',
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Close',
      didOpen: () => {
        document.querySelectorAll('.add-grade-btn').forEach(button => {
          button.addEventListener('click', (event) => {
            const subjectId = (event.target as HTMLElement).getAttribute('data-subject-id');
            const selectedSubject = this.subjects.find(sub => sub.id === Number(subjectId));
            if (selectedSubject) {
              this.openAddGradeModal(selectedSubject);
            }
          });
        });
      }
    });
  }

  openAddGradeModal(subject: Subject): void {
    if (subject.id === undefined) {
      console.error('Subject ID is undefined');
      return;
    }

    Swal.fire({
      title: `Add Grade for ${subject.subject_name}`,
      html: `
        <input type="number" id="grade" class="swal2-input" placeholder="Enter grade">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      preConfirm: () => {
        const grade = (document.getElementById('grade') as HTMLInputElement).value;
        if (!grade || isNaN(Number(grade)) || Number(grade) < 0 || Number(grade) > 100) {
          Swal.showValidationMessage('Please enter a valid grade between 0 and 100');
          return false;
        }
        return Number(grade);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const grade = result.value;
        this.childCurriculumService.addGrade(this.childId!, subject.id!, grade).subscribe(
          (response) => {
            Swal.fire('Success', 'Grade added successfully', 'success');
            this.fetchGrades();
          },
          (error) => {
            console.error('Error adding grade', error);
            Swal.fire('Error', 'Failed to add grade', 'error');
          }
        );
      }
    });
  }
}
