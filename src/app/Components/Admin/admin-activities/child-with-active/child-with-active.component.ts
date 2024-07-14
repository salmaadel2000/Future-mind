import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // استيراد SweetAlert
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../../models/activity.model';
import { Child } from '../../../../models/child.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // استيراد NgbModal
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-child-with-active',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgSelectModule ],
  templateUrl: './child-with-active.component.html',
  styleUrls: ['./child-with-active.component.css']
})
export class ChildWithActiveComponent implements OnInit {

  activities: Activity[] = [];
  children: Child[] = [];
  childrenWithActivities: any[] = [];
  selectedActivityName: string | null = null;
  selectedChildId: number | null = null;
  showActivityTable = true;
  showChildrenTable = false;

  constructor(private activityService: ActivityService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadActivities();
    this.loadChildren();
  }

  loadActivities(): void {
    this.activityService.getActivities().subscribe((activities: Activity[]) => {
      const uniqueActivities = Array.from(new Set(activities.map(activity => activity.activity_name)))
        .map(name => {
          return activities.find(activity => activity.activity_name === name);
        });

      this.activities = uniqueActivities as Activity[];
      console.log('Fetched Activities:', this.activities); // عرض البيانات في وحدة التحكم
    });
  }

  loadChildren(): void {
    this.activityService.getChildren().subscribe((children: Child[]) => {
      this.children = children;
      console.log('Fetched Children:', this.children); // عرض البيانات في وحدة التحكم
    });

    this.activityService.getChildrenWithActivities().subscribe((data: any[]) => {
      this.childrenWithActivities = data;
      console.log('Fetched Children with Activities:', this.childrenWithActivities); // عرض البيانات في وحدة التحكم
    });
  }

  showActivities(): void {
    this.showActivityTable = true;
    this.showChildrenTable = false;
  }

  showChildren(): void {
    this.showActivityTable = false;
    this.showChildrenTable = true;
  }

 

  openAddChildModal(modalContent: any): void {
    this.modalService.open(modalContent, { ariaLabelledBy: 'addChildModalLabel' });
  }

  addChildToActivity(): void {
    console.log('Selected Activity Name:', this.selectedActivityName);
    console.log('Selected Child ID:', this.selectedChildId);

    if (this.selectedActivityName !== null && this.selectedChildId !== null) {
      const selectedActivity = this.activities.find(act => act.activity_name === this.selectedActivityName);
      console.log('Selected Activity:', selectedActivity);

      if (selectedActivity) {
        const activity = {
          child_id: this.selectedChildId,
          activity_name: selectedActivity.activity_name,
          description: selectedActivity.description
        };

        console.log('Data being sent:', activity);

        this.activityService.addChildToActivity(activity).subscribe(response => {
          console.log('Response from server:', response);
          Swal.fire('Success', 'Child added to activity successfully', 'success');
          this.selectedActivityName = null;
          this.selectedChildId = null;
          this.loadActivities(); // لإعادة تحميل الأنشطة بعد التحديث
        }, error => {
          console.error('Error from server:', error);
          if (error.status === 400 && error.error.message === 'Child is already in this activity') {
            Swal.fire('Error', 'Child is already in this activity', 'error');
          } else {
            Swal.fire('Error', 'Error: ' + error.message, 'error');
          }
        });
      } else {
        console.error('Selected activity not found.');
        Swal.fire('Error', 'Selected activity not found', 'error');
      }
    } else {
      console.error('Activity Name or Child ID is null.');
      Swal.fire('Error', 'Activity Name or Child ID is null', 'error');
    }
  }

}
