import { Component } from '@angular/core';
import { SliderComponent } from './slider/slider.component';
import { LearnFunComponent } from './learn-fun/learn-fun.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LevelsComponent } from './levels/levels.component';
import { ActivtiesComponent } from './activties/activties.component';
import { PackagesComponent } from './packages/packages.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent,LearnFunComponent,StatisticsComponent,LevelsComponent,ActivtiesComponent,PackagesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
