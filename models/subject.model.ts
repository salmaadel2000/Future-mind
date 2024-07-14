export interface Subject {
  id: number;
  subject_name: string;
  level_id: number;
  description: string;
  class_id?: number; // التأكد من تضمين class_id
}
