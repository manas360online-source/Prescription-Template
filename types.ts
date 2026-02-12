
export interface CardData {
  id: number;
  title: string;
  view: AppViews;
}

export enum UserRole {
  NONE = 'none',
  PSYCHOLOGIST = 'psychologist',
  PSYCHIATRIST = 'psychiatrist'
}

export enum AppViews {
  HOME = 'home',
  ROLE_SELECT = 'role_select',
  GENERATOR = 'generator',
  // Psychologist Views
  SOUND = 'sound_therapy',
  AYURVEDIC = 'ayurvedic',
  BEHAVIORAL = 'behavioral',
  DETOX = 'detox',
  CBT = 'cbt_homework',
  MOOD = 'daily_mood_tracking',
  // Psychiatrist Views
  PSYCH_PLAN_VIEW = 'psych_plan_view',
  EVALUATION = 'psychiatric_evaluation',
  MEDICATION = 'medication_prescription',
  TRACKING = 'parameter_tracking',
  ADJUSTMENT = 'dosage_adjustment_log',
  FOLLOWUP = 'follow_up_schedule',
  // Common
  SAVED = 'saved'
}

export interface SavedPlan {
  id: string;
  title: string;
  content: string;
  date: string;
  role: UserRole;
  selections: Record<string, any>;
}
