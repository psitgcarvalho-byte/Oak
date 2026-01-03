
export enum SessionType {
  EVALUATION = 'Evaluation',
  FEEDBACK = 'Feedback (Devolutiva)',
  FOLLOW_UP = 'Follow-up',
  ANAMNESIS = 'Anamnesis'
}

export enum PatientStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  WAITING = 'Waiting List',
  INACTIVE = 'Inactive'
}

export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  status: PatientStatus;
  referralSource: string;
  anamnesis: string;
  createdAt: string;
}

export interface Session {
  id: string;
  patientId: string;
  professionalId: string;
  dateTime: string;
  type: SessionType;
  durationMinutes: number;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

export interface NeuroTest {
  id: string;
  name: string;
  domain: string; // e.g., Attention, Memory, Executive Functions
  description: string;
}

export interface TestResult {
  id: string;
  patientId: string;
  testId: string;
  rawScore: number;
  standardScore: number;
  percentile: number;
  date: string;
  observations: string;
}

export interface Report {
  id: string;
  patientId: string;
  title: string;
  content: string;
  createdAt: string;
  isDraft: boolean;
  signatureUrl?: string;
}

export interface DashboardStats {
  totalPatients: number;
  sessionsThisMonth: number;
  pendingReports: number;
  revenue: number;
}
