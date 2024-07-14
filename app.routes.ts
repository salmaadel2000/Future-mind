import { Routes } from '@angular/router';

import { AboutUsComponent } from './src/app/Components/AboutUs/about-us/about-us.component';
import { ChildWithActiveComponent } from './src/app/Components/Admin/admin-activities/child-with-active/child-with-active.component';
import { SubjectsComponent } from './src/app/Components/Admin/levels/subjects/subjects.component';
import { EditParentComponent } from './src/app/Components/Admin/parents/edit-parent/edit-parent.component';
 import { EditChildComponent } from './src/app/Components/Admin/students/edit-child/edit-child.component';
import { NavbarComponent } from './src/app/Components/layout/navbar-component/navbar-component.component';
import { HomeComponent } from './src/app/Components/home/home.component';
import { PackagesComponent } from './src/app/Components/home/packages/packages.component';
import { ActivtiesComponent } from './src/app/Components/home/activties/activties.component';
import { ParentRegistrationComponent } from './src/app/Components/Admin/regiserForms/parent-registration/parent-registration.component';
import { ContactComponent } from './src/app/Components/Contact/contact/contact.component';
import { AdminDashboardComponent } from './src/app/Components/Admin/admin-dashboard/admin-dashboard.component';
import { AllParentsComponent } from './src/app/Components/Admin/parents/all-parents/all-parents.component';
import { AddApplicantComponent } from './src/app/Components/Admin/regiserForms/add-applicant/add-applicant.component';
import { AllStudentsComponent } from './src/app/Components/Admin/students/all-students/all-students.component';
import { StudentApplicantsComponent } from './src/app/Components/Admin/students/student-applicants/student-applicants.component';
import { LevelsComponent } from './src/app/Components/Admin/levels/levels.component';
import { ClassDetailsComponent } from './src/app/Components/Admin/levels/class-details/class-details.component';
import { RegisterComponent } from './src/app/Components/register/register.component';
import { LoginComponent } from './src/app/Components/login/login.component';
import { ParentDasboardComponent } from './src/app/Components/parent/parent-dasboard/parent-dasboard.component';
import { CreateParentComponent } from './src/app/Components/parent/creation/create-parent/create-parent.component';
import { ParentNavComponent } from './src/app/Components/parent/parent-nav/parent-nav.component';
import { ParentHomeComponent } from './src/app/Components/parent/parent-home/parent-home.component';
import { ParentChildComponent } from './src/app/Components/parent/parent-child/parent-child.component';
import { ChildEditComponent } from './src/app/Components/parent/child-edit/child-edit.component';
import { CreateChildComponent } from './src/app/Components/parent/creation/create-child/child-registration.component';
import { ParentProfileComponent } from './src/app/Components/parent/parent-profile/parent-profile.component';
import { ParentEditComponent } from './src/app/Components/parent/parent-edit/parent-edit.component';
import { GradeListComponent } from './src/app/Components/grade-list/grade-list.component';
import { ActivityListComponent } from './src/app/Components/activity-list/activity-list.component';
import { ChildGradeComponent } from './src/app/Components/Admin/students/child-grade/child-grade.component';
import { ChildLevelDetailsComponent } from './src/app/Components/Admin/levels/child-level-details/child-level-details.component';
import { ChildActvitiesComponent } from './src/app/Components/Admin/students/child-actvities/child-actvities.component';

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
      { path: 'contact', component: ContactComponent},
      { path: 'add-parent', component: ParentRegistrationComponent},
      { path: 'activities', component: ActivtiesComponent },
      { path: 'packages', component: PackagesComponent },
      { path: 'about-us', component: AboutUsComponent },
    ]
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: 'accounts/all-parents', component: AllParentsComponent },
      { path: 'accounts/add-applicant', component: AddApplicantComponent},
      { path: 'students/all-students', component: AllStudentsComponent},
      { path: 'students/student-applicants', component: StudentApplicantsComponent},
      { path: 'levels', component: LevelsComponent },
      { path: 'class-details/:id', component: ClassDetailsComponent },
      { path: 'child-with-active', component: ChildWithActiveComponent},
      {path: 'subjects', component: SubjectsComponent},
      { path: 'accounts/edit-parent/:id', component: EditParentComponent },
      {path: 'edit-child/:id', component: EditChildComponent },
      {path: 'child-grade/:id', component: ChildGradeComponent},
      { path: 'student-subjects/:curriculumId/:childId', component: ChildLevelDetailsComponent},
      {path: 'child-actvities/:id' , component: ChildActvitiesComponent}

    
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
  {
    path: 'parent-dashboard/:id',
    component: ParentDasboardComponent
  },
  {
    path: 'create-parent',
    component: CreateParentComponent
  },
  {
    path: 'parent-nav',
    component: ParentNavComponent,
    children: [
      { path: '', component: ParentHomeComponent},
      { path: 'parent-child/:id', component: ParentChildComponent },
      { path: 'child-edit/:id', component: ChildEditComponent},
      { path: 'add-child', component: CreateChildComponent},
      { path: 'parent-profile/:id', component: ParentProfileComponent},
      { path: 'edit-parent/:id', component: ParentEditComponent},
      { path: 'grade/:id', component: GradeListComponent},
      { path: 'activity/:id', component: ActivityListComponent},
      { path: 'parent-package', component: PackagesComponent },
      
    ]
  },
  // Wildcard route for handling undefined routes
  { path: '**', redirectTo: '/home' }
];
