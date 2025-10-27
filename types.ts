import type { LucideProps } from 'lucide-react';
import type React from 'react';

export type IconType = React.ComponentType<LucideProps> | string;

export interface MediaItem {
  id: string;
  name: string;
  data: string; // base64 data URL
  type: string;
  size: number;
}


export interface StrategicThrust {
  id: number;
  title: string;
  icon: IconType;
  color: string;
  shortColor: string;
  description: string;
}

export interface TierMilestone {
  tier: string;
  milestones: string[];
  color:string;
}

export interface KPIHistory {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface KPI {
  name: string;
  target: string;
  current: string;
  targetValue: number;
  currentValue: number;
  history?: KPIHistory[];
  plan_start?: string; // DD/MM/YYYY
  plan_end?: string;   // DD/MM/YYYY
  actual_start?: string; // DD/MM/YYYY
  actual_end?: string; // DD/MM/YYYY
}

export interface Initiative {
  id: string;
  thrustId: number;
  name:string;
  tier?: string;
  plan_start: string; // DD/MM/YYYY
  plan_end: string;   // DD/MM/YYYY
  actual_start: string; // DD/MM/YYYY
  actual_end: string;   // DD/MM/YYYY
  progress: number;
  responsibleBranch?: string;
  expectedOutcome?: string;
  remarks?: string;
  notes?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: IconType;
}

export interface StrategicObjective {
  id: number;
  title: string;
  description: string;
  icon: IconType;
  imgSrc?: string; // For custom uploaded icons
  color: string;
  thrusts: number[];
}

export interface StrategicDirection {
  vision: string;
  mission: string;
  goal: string;
}

export interface SuccessStory {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  href: string;
  buttonText: string;
}

export interface StoriesPageContent {
  mainTitle: string;
  mainSubtitle: string;
  knowledgeSharingTitle: string;
  knowledgeSharingBody: string;
}

export interface EngagementChannel {
  id: number;
  icon: IconType;
  imgSrc?: string; // For custom uploaded icons
  color: string;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  href: string;
}

export interface EngagePageContent {
  mainTitle: string;
  mainSubtitle: string;
  transparencyTitle: string;
  governanceTitle: string;
  governanceInitiatives: { id: number; text: string; strong: string }[];
  mediaTitle: string;
  mediaInitiatives: { id: number; text: string; strong: string }[];
}

// Editable UI Content Types
export interface HeaderData {
  mainTitle: string;
  tagline: string;
  headerLink: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterData {
  tagline: string;
  links: FooterLink[];
  copyright: string;
}

export interface WelcomePageContent {
  title: string;
  subtitle: string;
  body: string;
}

export interface FinancialSummary {
  title: string;
  subtitle: string;
  budget: number;
  spending: number;
}

export interface ThrustFinancials {
  id: number;
  thrustId: number;
  thrustTitle: string;
  budget: number;
  spending: number;
}