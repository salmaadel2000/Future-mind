import { Component, OnInit } from '@angular/core';
import { Curriculum } from '../../../models/Curriculum.model';
import { CurriculumService } from '../../../services/curriculum.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent implements OnInit {
  curriculums: Curriculum[] = [];
  errorMessage: string = '';

  // Define customization mappings
  customizationMappings: { [key: number]: { cardClass: string, imageUrl: string } } = {
    1: { cardClass: 'card-one', imageUrl: '../../../../images/Image (4).png' },
    2: { cardClass: 'card-two', imageUrl: '../../../../images/Image (2).png' },
    3: { cardClass: 'card-three', imageUrl: '../../../../images/Image (1).png' },
    // Add more mappings as needed
  };

  constructor(private curriculumService: CurriculumService) {}

  ngOnInit(): void {
    this.curriculumService.getCurriculums().subscribe({
      next: data => {
        if (data.length > 0) {
          this.curriculums = data;
          console.log(this.curriculums);
        } else {
          this.errorMessage = 'No curriculums available.';
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while fetching curriculums.';
      }
    });
  }

  getCardClass(levelId: number): string {
    return this.customizationMappings[levelId]?.cardClass || 'default-card';
  }

  getImageSrc(levelId: number): string {
    return this.customizationMappings[levelId]?.imageUrl || '../../../../images/default.png';
  }
}
