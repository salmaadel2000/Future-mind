import { Component, OnInit } from '@angular/core';
import { Child } from '../../../models/child.model'; // Assuming this is the correct path to Child model
import { ActivatedRoute } from '@angular/router';
import { ChildService } from '../../../services/child.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParentService } from '../../../services/parent.service';

@Component({
  imports: [CommonModule, RouterLink],
  standalone: true,
  selector: 'app-parent-child',
  templateUrl: './parent-child.component.html',
  styleUrls: ['./parent-child.component.css']
})
export class ParentChildComponent implements OnInit {
  children: Child[] = [];

  constructor(
    private childService: ChildService,
    private parentService: ParentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const parentId = this.parentService.getProfileIdFromLocalStorage();
    if (parentId) {
      this.childService.getParentsChildren(+parentId).subscribe(
        (data: any) => {
          console.log(data);
          if (data.status === 'success') {
            // Filter children with application status 'accepted'
            this.children = data.data.filter((child: Child) => {
              if (child.application) {
                console.log('Application Status:', child.application.status);
                return child.application.status === 'accepted';
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
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
