import { Routes } from '@angular/router';
import { AuthGuard } from './guard/guard.guard';
import { AdminGuard } from './guard/admin.guard';
import { AdminDashboardComponent } from './Components/Admin/admin-dashboard/admin-dashboard.component';
import { AllParentsComponent } from './Components/Admin/parents/all-parents/all-parents.component';
import { AllStudentsComponent } from './Components/Admin/students/all-students/all-students.component';
import { StudentApplicantsComponent } from './Components/Admin/students/student-applicants/student-applicants.component';
import { AddApplicantComponent } from './Components/Admin/regiserForms/add-applicant/add-applicant.component';
import { LevelsComponent } from './Components/Admin/levels/levels.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { NavbarComponent } from './Components/layout/navbar-component/navbar-component.component';
import { HomeComponent } from './Components/home/home.component';
import { ParentDasboardComponent } from './Components/parent/parent-dasboard/parent-dasboard.component';
import { ParentHomeComponent } from './Components/parent/parent-home/parent-home.component';
import { ParentProfileComponent } from './Components/parent/parent-profile/parent-profile.component';
import { ParentNavComponent } from './Components/parent/parent-nav/parent-nav.component';
import { ParentChildComponent } from './Components/parent/parent-child/parent-child.component';
import { ChildEditComponent } from './Components/parent/child-edit/child-edit.component';
import { ContactComponent } from './Components/Contact/contact/contact.component';
import { ParentRegistrationComponent } from './Components/Admin/regiserForms/parent-registration/parent-registration.component';
import { ParentEditComponent } from './Components/parent/parent-edit/parent-edit.component';
import { GradeListComponent } from './Components/grade-list/grade-list.component';
import { CreateChildComponent } from './Components/parent/creation/create-child/child-registration.component';
import { CreateParentComponent } from './Components/parent/creation/create-parent/create-parent.component';
import { PackagesComponent } from './Components/home/packages/packages.component';
import { ActivtiesComponent } from './Components/home/activties/activties.component';
import { ActivityListComponent } from './Components/activity-list/activity-list.component';
import { ClassDetailsComponent } from './Components/Admin/levels/class-details/class-details.component';
import { AboutUsComponent } from './Components/AboutUs/about-us/about-us.component';
import { AddChildForExistingComponent } from './Components/Admin/students/add-child-for-existing/add-child-for-existing.component';
import { AdminActivitiesComponent } from './Components/Admin/admin-activities/admin-activities.component';
import { ChildWithActiveComponent } from './Components/Admin/admin-activities/child-with-active/child-with-active.component';
import { NotificationFormComponent } from './Components/Admin/notification-form/notification-form.component';
import { SubjectsComponent } from './Components/Admin/levels/subjects/subjects.component';
import { WelcomeAdminComponent } from './Components/Admin/welcome-admin/welcome-admin.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { NewPasswordResetComponent } from './Components/new-password-reset/new-password-reset.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditParentComponent } from './Components/Admin/parents/edit-parent/edit-parent.component';

import { EditChildComponent } from './Components/Admin/students/edit-child/edit-child.component';
import { ChildViewComponent } from './Components/Admin/students/child-view/child-view.component';
import { PendingChildComponent } from './Components/parent/parent-child/pending-child/pending-child.component';
import { ChildGradeComponent } from './Components/Admin/students/child-grade/child-grade.component';
import { ChildLevelDetailsComponent } from './Components/Admin/levels/child-level-details/child-level-details.component';
import { ChildActvitiesComponent } from './Components/Admin/students/child-actvities/child-actvities.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'add-parent', component: ParentRegistrationComponent },
      { path: 'activities', component: ActivtiesComponent },
      { path: 'packages', component: PackagesComponent },
      { path: 'about-us', component: AboutUsComponent },
    ]
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'accounts/all-parents', component: AllParentsComponent },
      { path: 'accounts/add-applicant', component: AddApplicantComponent },
      { path: 'students/all-students', component: AllStudentsComponent },
      { path: 'students/student-applicants', component: StudentApplicantsComponent },
      { path: 'levels', component: LevelsComponent },
      { path: 'class-details/:id', component: ClassDetailsComponent },
      { path: 'all-students/addexistingParents', component: AddChildForExistingComponent},
      {path: 'activities' , component: AdminActivitiesComponent},
      { path: 'child-with-active', component: ChildWithActiveComponent },
      { path: 'Notification-Form/:parent_id', component: NotificationFormComponent },
      {path : 'subjects' , component: SubjectsComponent},
      {path : 'welcome-admin' , component: WelcomeAdminComponent},
      {path : 'accounts/edit-parent/:id' , component:EditParentComponent},
      {path : 'edit-child/:id' , component: EditChildComponent},
      {path : 'child-view/:id', component: ChildViewComponent},
      {path : 'child-grade/:id' , component: ChildGradeComponent},
      { path: 'student-subjects/:curriculumId/:childId', component: ChildLevelDetailsComponent},
      {path: 'child-activites/:id', component: ChildActvitiesComponent}


      
    ]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'reset-password', 
    
    component: ResetPasswordComponent
  },

  { path: 'new-password', 
    component: NewPasswordResetComponent 
  },

  {
    path: 'parent-dashboard/:id',
    component: ParentDasboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-parent',
    component: CreateParentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent-nav',
    component: ParentNavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ParentHomeComponent },
      { path: 'parent-child/:id', component: ParentChildComponent },
      { path: 'child-edit/:id', component: ChildEditComponent },
      { path: 'add-child', component: CreateChildComponent },
      { path: 'parent-profile/:id', component: ParentProfileComponent },
      { path: 'edit-parent/:id', component: ParentEditComponent },
      { path: 'grade/:id', component: GradeListComponent },
      { path: 'activity/:id', component: ActivityListComponent },
      { path: 'parent-package', component: PackagesComponent },
      {path:"pend-child/:id",component:PendingChildComponent}
    ]
  },
  // Wildcard route for handling undefined routes
  // { path: '**', redirectTo: '/home' }
];
