import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParentService } from '../../../services/parent.service';
import { Parent } from '../../../models/Parent.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone:true,
  imports:[CommonModule,FormsModule],
  selector: 'app-parent-profile',
  templateUrl: './parent-profile.component.html',
  styleUrls: ['./parent-profile.component.css'],
})
export class ParentProfileComponent implements OnInit {
  parent: Parent | undefined;
  parentId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private parentService: ParentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        const parentId = +id; // Convert id to number if not null
        this.parentService.getParentById(parentId).subscribe(
          (parent: Parent) => {
            this.parent = parent; // Assign fetched parent data
          },
          (error) => {
            console.error('Error fetching parent:', error);
          }
        );
      } else {
        console.error('No ID parameter found');
      }
    });
  }
  

}