import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-parent-dasboard',
  standalone: true,
  imports: [RouterLink,RouterOutlet,CommonModule,SidebarComponent],
  templateUrl: './parent-dasboard.component.html',
  styleUrl: './parent-dasboard.component.css'
})
export class ParentDasboardComponent {

}
