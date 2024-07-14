import { Subject } from "./subject.model";
import { Curriculum } from "./Curriculum.model";

export interface Class {
  id: number;
  class_name: string;
  description: string;
  subjects: Subject[];
  curriculum_id?: number; 
}
