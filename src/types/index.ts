// This file will hold all our common types

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    first_name: string;
    email: string;
  };
}
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}


export interface JobProfile {
  id: number;
  profile_name: string;
  target_role: string;
  job_description: string; 
  company_name: string;
  company_background: string;
  responsibilities: string[]; 
  required_skills: string[]; 
  created_at: string;
  updated_at: string;
}

export type CreateJobProfilePayload = {
  profile_name: string;
  target_role: string;
  job_description: string;
  company_name: string;
  company_background: string;
  responsibilities: string[];
  required_skills: string[];
};

export type UpdateJobProfilePayload = Partial<CreateJobProfilePayload>;


export interface Resume {
  id: number;
  current_role: string;
  key_skills: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export type ResumePayload = {
  current_role: string;
  key_skills: string[];
  description: string;
};


export interface SessionSetupPayload {
  interviewer_name: string;
  interviewer_attitude: string;
  preferred_language: string;
}


export interface SessionSetup extends SessionSetupPayload {
  id: number;
  model_voice: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSessionForProfilePayload {
  session_setup_id: number;
}

export interface SessionData {
  id: number;
  status: string;
  prompt_name: string;
  s2s_system_prompt: string;
  inference_config: {
    maxTokens: number;
    temperature: number;
    topP: number;
  };
  session_feedback: object; // Using a generic object for now
  created_at: string;
}

export interface SessionFeedback {
  strengths: string[];
  final_rating: number;
  general_feedback: string;
  areas_of_improvement: string[];
}

// Represents a single entry in the full_transcript array
export interface TranscriptEntry {
  role: 'user' | 'coach';
  content: string;
  timestamp: number;
}

// Represents the summary of a session, as seen in the list view
export interface SessionSummary {
  id: number;
  status: 'COMPLETED';
  prompt_name: string;
  session_feedback: SessionFeedback;
  created_at: string;
  updated_at: string;
}

// Represents the full detail of a session, including the transcript
export interface SessionDetail extends SessionSummary {
  full_transcript: TranscriptEntry[];
}