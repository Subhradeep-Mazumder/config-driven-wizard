import type { WizardValues } from '@/types';

export type WizardStatus = 'idle' | 'in-progress' | 'verifying' | 'completed' | 'failed';

export interface WizardState {
  currentStepIndex: number;
  values: WizardValues;
  completedSteps: string[];
  status: WizardStatus;
  statusMessage: string | null;
}
