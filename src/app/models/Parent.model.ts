import { Child } from './child.model';
import {User} from './Register.model';

export interface Parent {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  educational_qualification: string;
  job_title: string;
  workplace: string;
  work_phone: string;
  personal_phone: string;
  address: string;
  home_phone: string;
  street_number: string;
  apartment_number: string;
  children?: Child[]; 
  user?: User;
}
