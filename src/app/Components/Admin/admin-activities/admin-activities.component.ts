import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // استيراد SweetAlert
import { ActivityService } from '../../../services/activity.service';
import { Activity } from '../../../models/activity.model';
import { Child } from '../../../models/child.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, RouterLink } from '@angular/router'; // استيراد Router

@Component({
  selector: 'app-admin-activities',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, RouterLink], // إضافة NgSelectModule هنا
  templateUrl: './admin-activities.component.html',
  styleUrls: ['./admin-activities.component.css']
})
export class AdminActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  children: Child[] = [];
  childrenWithActivities: any[] = [];
  selectedActivityName: string | null = null;
  selectedChildId: number | null = null;
  showActivityTable = true;
  showChildrenTable = false;

  constructor(private activityService: ActivityService, private router: Router) {}

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

  viewActivityDetails(activity: Activity): void {
    this.activityService.getActivityDetails(activity.id).subscribe(response => {
      console.log('Viewing activity details:', response);
      Swal.fire('Activity Details', `Activity Name: ${response.activity_name}\nChild Name: ${response.child_name}`, 'info');
    }, error => {
      console.error('Error fetching activity details:', error);
      Swal.fire('Error', 'Error fetching activity details', 'error');
    });
  }

  editActivity(activity: Activity): void {
    console.log('Editing activity:', activity);
    this.router.navigate(['/admin-dashboard/edit-activity', activity.id]);
  }

  deleteActivity(activityId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activityService.deleteActivity(activityId).subscribe(response => {
          console.log('Activity deleted:', response);
          Swal.fire('Deleted!', 'Your activity has been deleted.', 'success');
          this.loadActivities(); // إعادة تحميل الأنشطة بعد الحذف
        }, error => {
          console.error('Error deleting activity:', error);
          Swal.fire('Error', 'Error deleting activity: ' + error.message, 'error');
        });
      }
    });
  }

  deleteSimilarActivities(activityName: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete all activities with the same name.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activityService.deleteSimilarActivities(activityName).subscribe(response => {
          console.log('Similar activities deleted:', response);
          Swal.fire('Deleted!', 'Similar activities have been deleted.', 'success');
          this.loadActivities(); // إعادة تحميل الأنشطة بعد الحذف
        }, error => {
          console.error('Error deleting similar activities:', error);
          Swal.fire('Error', 'Error deleting similar activities: ' + error.message, 'error');
        });
      }
    });
  }
  editSimilarActivities(activityName: string): void {
    // حفظ البيانات القديمة
    const oldActivity = this.activities.find(act => act.activity_name === activityName);
    if (!oldActivity) {
      Swal.fire('Error', 'Activity not found', 'error');
      return;
    }
  
    Swal.fire({
      title: 'Edit Activities',
      html:
        `<input id="activityName" class="swal2-input" placeholder="New Activity Name" value="${oldActivity.activity_name}">` +
        `<input id="description" class="swal2-input" placeholder="New Description" value="${oldActivity.description}">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const newActivityName = (document.getElementById('activityName') as HTMLInputElement).value.trim();
        const newDescription = (document.getElementById('description') as HTMLInputElement).value.trim();
  
        if (!newActivityName) {
          Swal.showValidationMessage('Activity name is required');
          return null;
        }
  
        if (/^\s*$/.test(newActivityName)) {
          Swal.showValidationMessage('Activity name cannot be just spaces');
          return null;
        }
  
        if (/[^a-zA-Z0-9 ]/.test(newActivityName)) {
          Swal.showValidationMessage('Activity name cannot contain special characters');
          return null;
        }
  
        if (newActivityName.length < 4) {
          Swal.showValidationMessage('Activity name must be at least 4 characters long');
          return null;
        }
  
        if (!newDescription) {
          Swal.showValidationMessage('Description is required');
          return null;
        }
  
        if (/^\s*$/.test(newDescription)) {
          Swal.showValidationMessage('Description cannot be just spaces');
          return null;
        }
  
        if (/[^a-zA-Z0-9 ]/.test(newDescription)) {
          Swal.showValidationMessage('Description cannot contain special characters');
          return null;
        }
  
        if (newDescription.length < 4) {
          Swal.showValidationMessage('Description must be at least 4 characters long');
          return null;
        }
  
        return { activity_name: newActivityName, description: newDescription };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedActivity = {
          activity_name: result.value.activity_name,
          description: result.value.description
        };
  
        this.activityService.updateSimilarActivities(activityName, updatedActivity).subscribe(response => {
          console.log('Similar activities updated:', response);
          Swal.fire('Updated!', 'Similar activities have been updated.', 'success');
          this.loadActivities(); // إعادة تحميل الأنشطة بعد التحديث
        }, error => {
          console.error('Error updating similar activities:', error);
          Swal.fire('Error', 'Error updating similar activities: ' + error.message, 'error');
        });
      } else {
        // إرجاع البيانات القديمة في حالة إلغاء التعديل
        this.activities = this.activities.map(activity =>
          activity.activity_name === oldActivity.activity_name ? oldActivity : activity
        );
      }
    });
  }
  
  showAddActivityModal(): void {
    Swal.fire({
      title: 'Add Activity',
      html:
        '<input id="activityName" class="swal2-input" placeholder="Activity Name">' +
        '<input id="activityDescription" class="swal2-input" placeholder="Description">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Activity',
      preConfirm: () => {
        const activityName = (document.getElementById('activityName') as HTMLInputElement).value.trim();
        const activityDescription = (document.getElementById('activityDescription') as HTMLInputElement).value.trim();
  
        if (!activityName) {
          Swal.showValidationMessage('Activity name is required');
          return null;
        }
  
        if (/^\s*$/.test(activityName)) {
          Swal.showValidationMessage('Activity name cannot be just spaces');
          return null;
        }
  
        if (/[^a-zA-Z0-9 ]/.test(activityName)) {
          Swal.showValidationMessage('Activity name cannot contain special characters');
          return null;
        }
  
        if (activityName.length < 4) {
          Swal.showValidationMessage('Activity name must be at least 4 characters long');
          return null;
        }
  
        if (!activityDescription) {
          Swal.showValidationMessage('Description is required');
          return null;
        }
  
        if (/^\s*$/.test(activityDescription)) {
          Swal.showValidationMessage('Description cannot be just spaces');
          return null;
        }
  
        if (/[^a-zA-Z0-9 ]/.test(activityDescription)) {
          Swal.showValidationMessage('Description cannot contain special characters');
          return null;
        }
  
        if (activityDescription.length < 4) {
          Swal.showValidationMessage('Description must be at least 4 characters long');
          return null;
        }
  
        return {
          activity_name: activityName,
          description: activityDescription
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.activityService.addActivity(result.value).subscribe(response => {
          console.log('Activity added:', response);
          Swal.fire('Added!', 'Activity has been added.', 'success');
          this.loadActivities();
        }, error => {
          console.error('Error adding activity:', error);
          Swal.fire('Error', 'Error adding activity: ' + error.message, 'error');
        });
      }
    });
  }
  
  
}
