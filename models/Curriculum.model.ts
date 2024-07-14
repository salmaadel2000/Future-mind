import { Class } from './Class.model';
import { Subject } from './subject.model';

export interface Curriculum {
  id: number;
  level: string;
  subjects: Subject[];
  classes: Class[];
}