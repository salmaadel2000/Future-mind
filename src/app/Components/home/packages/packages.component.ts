import { Component, OnInit } from '@angular/core';
import { Package } from '../../../models/package.model';
import { PackageService } from '../../../services/package.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
  packages: Package[] = [];
  errorMessage: string = '';

  // Define customization mappings
  customizationMappings: { [key: number]: { cardClass: string, imageUrl: string } } = {
    1: { cardClass: 'basic', imageUrl: '../../../../images/Image 60 (1).png' },
    2: { cardClass: 'premium', imageUrl: '../../../../images/Image (7).png' },
    // Add more mappings as needed
  };

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    this.packageService.getPackages().subscribe({
      next: data => {
        console.log(data)
        if (data.length > 0) {
          this.packages = data;
          console.log(this.packages);
        } else {
          this.errorMessage = 'No packages available.';
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while fetching packages.';
      }
    });
  }

  getCardClass(packageId: number | undefined): string {
    if (packageId === undefined) {
      return 'default-card';
    }
    return this.customizationMappings[packageId]?.cardClass || 'default-card';
  }
  
  getImageSrc(packageId: number | undefined): string {
    if (packageId === undefined) {
      return '../../../../images/default.png';
    }
    return this.customizationMappings[packageId]?.imageUrl || '../../../../images/default.png';
  }
  
}
