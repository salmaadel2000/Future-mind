import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.css']
})
export class NotificationFormComponent implements OnInit {
  notificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.notificationForm = this.fb.group({
      parent_id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], 
      title: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const parentId = params['parent_id'];
      this.notificationForm.patchValue({ parent_id: parentId });
    });
  }

  onSubmit(): void {
    if (this.notificationForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to send this notification?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, send it!',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Display a loading message
          Swal.fire({
            title: 'Sending...',
            text: 'Please wait while we send the notification.',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 2500 // Show the loading message for 1.5 seconds
          });

          // After the loading message is displayed, perform the API request
          setTimeout(() => {
            this.notificationService.createNotification(this.notificationForm.value).subscribe(
              response => {
                Swal.fire({
                  title: 'Sent!',
                  text: 'Notification has been sent successfully. Please create a notification for the user.',
                  icon: 'success',
                  timer: 2000, // Show the message for 2 seconds
                  showConfirmButton: false // Automatically close after timer
                }).then(() => {
                  this.router.navigate(['/admin-dashboard/students/student-applicants']); // Navigate back
                });
                console.log('Notification sent successfully', response);
              },
              error => {
                Swal.fire(
                  'Error!',
                  'There was an error sending the notification.',
                  'error'
                );
                console.error('Error sending notification', error);
              }
            );
          }, 1500); // Ensure the setTimeout duration matches the loading message timer
        }
      });
    } else {
      Swal.fire(
        'Validation Error',
        'Please fill out all required fields correctly.',
        'error'
      );
    }
  }

  // Convenience getter for easy access to form fields in the template
  get f() { return this.notificationForm.controls; }
}