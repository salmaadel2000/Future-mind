import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CurriculumService } from '../../../../services/curriculum.service';
import { Child } from '../../../../models/child.model';
import { Subject } from '../../../../models/subject.model';
import { Grade } from '../../../../models/grade.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GradeWithSubject extends Grade {
  subject?: Subject;
}

@Component({
  selector: 'app-class-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.css']
})
export class ClassDetailsComponent implements OnInit {
  classId: number | null = null;
  childrenInClass: Child[] = [];
  subjects: Subject[] = [];
  selectedChild: Child | null = null;
  childGrades: { [subjectId: number]: GradeWithSubject } = {};

  constructor(
    private route: ActivatedRoute,
    private curriculumService: CurriculumService
  ) { }

  ngOnInit(): void {
   

  }

 
  loadChildrenInClass(classId: number): void {
    this.curriculumService.getChildrenInClass(classId).subscribe((response: any) => {
      const children = response.data;
      if (Array.isArray(children)) {
        this.childrenInClass = children;
      } else {
        console.error('Expected array of children but got:', children);
      }
    }, error => {
      console.error('Error loading children:', error);
    });
  }

  // loadSubjects(curriculumId: number): void {
  //   this.curriculumService.getLevelSubjects(curriculumId).subscribe((subjects: Subject[]) => {
  //     if (Array.isArray(subjects)) {
  //       this.subjects = subjects;
  //       console.log('Subjects:', this.subjects); // Log the subjects to check if they are loaded correctly
  //     } else {
  //       console.error('Expected array of subjects but got:', subjects);
  //     }
  //   }, error => {
  //     console.error('Error loading subjects:', error);
  //   });
  // }

  viewChild(child: Child): void {
    this.selectedChild = child; // احفظ الطفل المختار فقط
    this.loadChildGrades(child.id); // حمّل درجات الطفل
  }
  
  loadChildGrades(childId: number): void {
    this.curriculumService.getChildGrades(childId).subscribe((response: any) => {
      console.log('Grades response:', response);
      const grades: GradeWithSubject[] = response.data; // Adjust this line if necessary
      if (Array.isArray(grades)) {
        this.childGrades = {};
        grades.forEach(grade => {
          this.childGrades[grade.subject_id] = grade;
        });
        console.log('Loaded grades:', this.childGrades); // Log the loaded grades
        const modalElement = document.getElementById('viewModal');
        if (modalElement) {
          const modal = new (window as any).bootstrap.Modal(modalElement);
          modal.show();
        }
      } else {
        console.error('Expected array of grades but got:', grades);
      }
    }, error => {
      console.error('Error loading grades:', error);
    });
  }

  updateGrades(): void {
    if (this.selectedChild) {
      const gradesToUpdate: { id: number; grade: number }[] = [];
      for (const subjectId in this.childGrades) {
        if (this.childGrades.hasOwnProperty(subjectId)) {
          gradesToUpdate.push({
            id: this.childGrades[subjectId].id,
            grade: this.childGrades[subjectId].grade,
          });
        }
      }

      // Log the payload to verify its format
      console.log('Payload to update grades:', gradesToUpdate);

      this.curriculumService.updateChildGrades(this.selectedChild.id, gradesToUpdate).subscribe(
        () => {
          console.log('Grades updated successfully');
          const modalElement = document.getElementById('viewModal');
          if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement);
            modal.hide();
          }
        },
        error => {
          console.error('Error updating grades:', error);
          console.error('Payload:', gradesToUpdate);
          if (error.error && error.error.errors) {
            console.error('Validation errors:', error.error.errors);
          }
        }
      );
    }
  }

  getSubjectName(subjectId: number): string | undefined {
    const grade = this.childGrades[subjectId];
    return grade && grade.subject ? grade.subject.subject_name : undefined;
  }

  getChildGradeKeys(): number[] {
    return Object.keys(this.childGrades).map(Number);
  }
}
