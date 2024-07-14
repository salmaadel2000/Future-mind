import { Component, OnInit } from '@angular/core';
import { Child } from '../../../../models/child.model';
import { ActivatedRoute } from '@angular/router';
import { ChildService } from '../../../../services/child.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, RouterLink],
  standalone: true,
  selector: 'app-child-view',
  templateUrl: './child-view.component.html',
  styleUrls: ['./child-view.component.css']
})

export class ChildViewComponent implements OnInit {
  child: Child | null = null;

  constructor(
    private childService: ChildService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const childId = this.route.snapshot.paramMap.get('id');
    if (childId) {
      this.childService.getChild(+childId).subscribe(
        (data: any) => {
          console.log(data);
          if (data) {
            this.child = data;
          } else {
            console.error('Failed to fetch child:', data.message);
          }
        },
        (error) => {
          console.error('Error fetching child:', error);
        }
      );
    } else {
      console.error('Child ID not found in URL');
    }
  }

  calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
