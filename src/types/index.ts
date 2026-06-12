export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'manager' | 'admin';
  department: string;
  position: string;
  created_at: string;
}

export interface Entry {
  id: string;
  title: string;
  content: string;
  author_id: string;
  department: string;
  updated_at: string;
  status: 'published' | 'draft';
  tags: string[];
  author?: User;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author_id: string;
  status: 'pending' | 'answered' | 'adopted';
  created_at: string;
  author?: User;
  answers?: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  question_id: string;
  author_id: string;
  adopted: boolean;
  created_at: string;
  author?: User;
}

export interface LearningRecord {
  id: string;
  user_id: string;
  entry_id: string;
  read: boolean;
  quiz_passed: boolean;
  completed_at: string | null;
}

export interface QuizQuestion {
  id: string;
  entry_id: string;
  question: string;
  options: string[];
  correct_index: number;
}

export interface TopicPath {
  id: string;
  name: string;
  description: string;
  entries: string[];
  departments: string[];
  positions: string[];
}

export interface TeamProgress {
  department: string;
  completion_rate: number;
  total_employees: number;
  completed_employees: number;
}

export interface WeakPoint {
  entry_id: string;
  entry_title: string;
  failed_count: number;
  attempted_count: number;
}

export interface UnansweredQuestion {
  id: string;
  title: string;
  author_name: string;
  created_at: string;
}
