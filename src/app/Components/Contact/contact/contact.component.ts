import { Component } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { MapContactComponent } from '../map-contact/map-contact.component';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactFormComponent,MapContactComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
