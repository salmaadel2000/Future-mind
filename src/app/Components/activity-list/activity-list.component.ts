import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { CommonModule } from '@angular/common';
@Component({
  standalone:true,
  imports: [CommonModule],
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
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
