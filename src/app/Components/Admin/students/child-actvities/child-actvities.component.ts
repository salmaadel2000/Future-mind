import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../../models/activity.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-child-actvities',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './child-actvities.component.html',
  styleUrl: './child-actvities.component.css'
})
export class ChildActvitiesComponent {
  activities: Activity[] = [];

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const childId = +params['id'];
      this.getActivitiesForChild(childId);
    });
  }

  getActivitiesForChild(childId: number): void {
    this.activityService.getActivitiesForChild(childId).subscribe(
      (activities: Activity[]) => {
        console.log(activities);
        this.activities = activities;
      },
      (error) => {
        console.error('Error fetching activities:', error);
      }
    );
  }

}
