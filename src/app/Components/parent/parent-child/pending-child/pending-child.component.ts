import { Component, OnInit } from '@angular/core';
import { Child } from '../../../../models/child.model'; // Adjust path as necessary
import { ChildService } from '../../../../services/child.service';
import { ParentService } from '../../../../services/parent.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  imports:[CommonModule,RouterLink],
  standalone:true,
  selector: 'app-pending-child',
  templateUrl: './pending-child.component.html',
  styleUrls: ['./pending-child.component.css']
})
export class PendingChildComponent implements OnInit {
  children: Child[] = [];

  constructor(
    private childService: ChildService,
    private parentService: ParentService
  ) {}

  ngOnInit(): void {
    const parentId = this.parentService.getProfileIdFromLocalStorage();
    if (parentId) {
      this.childService.getParentsChildren(+parentId).subscribe(
        (data: any) => {
          console.log(data);
          if (data.status === 'success') {
            // Filter children with application status 'pending'
            this.children = data.data.filter((child: Child) => {
              if (child.application) {
                console.log('Application Status:', child.application.status);
                return child.application.status === 'pending';
              }
              return false;
            });
          } else {
            console.error('Failed to fetch children:', data.message);
          }
        },
        (error) => {
          console.error('Error fetching children:', error);
        }
      );
    } else {
      console.error('ParentId not found in localStorage');
    }
  }

  calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
