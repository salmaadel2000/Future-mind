import { Component } from '@angular/core';
import { PackagesComponent } from '../../home/packages/packages.component';
@Component({
  selector: 'app-parent-home',
  standalone: true,
  imports: [PackagesComponent],
  templateUrl: './parent-home.component.html',
  styleUrl: './parent-home.component.css'
})
export class ParentHomeComponent {

}
