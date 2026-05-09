import type {
    WizardConfig,
    WizardFieldConfig,
    WizardStepConfig,
    WizardValues,
    WizardErrors,
    Role,
  } from '@/types';
  
  export interface WizardProps {
    config: WizardConfig;
  }
  
  export interface WizardFieldRendererProps {
    field: WizardFieldConfig;
    value: string | number | boolean | undefined;
    error: string | undefined;
    onChange: (name: string, value: string | number | boolean) => void;
    onBlur?: (name: string) => void;
  }
  
  export interface WizardNavProps {
    steps: WizardStepConfig[];
    activeIndex: number;
    completedIds: string[];
    onJump?: (index: number) => void;
  }
  
  export interface WizardStepRendererProps {
    step: WizardStepConfig;
    values: WizardValues;
    errors: WizardErrors;
    role: Role;
    onFieldChange: (name: string, value: string | number | boolean) => void;
    onFieldBlur?: (name: string) => void;
  }
  