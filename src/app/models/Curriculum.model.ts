
import { Subject } from './subject.model';



export interface Curriculum {
  id?: number;
  level: string;
  description?: string;
  subjects?: Subject[]; // تأكد من أن الحقل subjects موجود في النموذج
}
