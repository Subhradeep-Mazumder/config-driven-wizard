export type Role = 'admin' | 'user' | 'guest';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export type WizardFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'date';

export interface WizardValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'asyncUnique';
  value?: string | number;
  message: string;
}

export interface WizardFieldOption {
  value: string;
  label: string;
}

export interface WizardFieldConfig {
  name: string;
  label: string;
  type: WizardFieldType;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: WizardFieldOption[];
  validations?: WizardValidationRule[];
  visibleForRoles?: Role[];
  visibleWhen?: { field: string; equals: string | number | boolean };
}

export interface WizardStepConfig {
  id: string;
  title: string;
  description?: string;
  fields: WizardFieldConfig[];
  visibleForRoles?: Role[];
  skipWhen?: { field: string; equals: string | number | boolean };
}

export interface WizardConfig {
  id: string;
  title: string;
  steps: WizardStepConfig[];
}

export type WizardValues = Record<string, string | number | boolean>;
export type WizardErrors = Record<string, string | undefined>;
