import { Application } from './application.model';
import { Parent } from './Parent.model';
import { Subject } from './subject.model';

export interface Child {
  id: number;
  parent_id: number;
  full_name: string;
  birthdate: string;
  place_of_birth: string;
  gender: string;
  current_residence: string;
  class_name?: string;
  level?: string;
  photo?: string;
  application?: Application;
  parent?: Parent;
  subject?: Subject;
  grades?: { [subjectId: number]: number }; 

}