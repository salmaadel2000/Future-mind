import { Child } from "../models/child.model";
export interface Activity {
    id: number;
    class_id: number;
    child_id: number;
    activity_name: string;
    description: string;
    created_at: string;
    updated_at: string;
    child: Child;
  }