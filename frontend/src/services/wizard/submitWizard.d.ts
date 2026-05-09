import type { WizardValues } from '@/types';

export interface SubmitWizardRequest {
  values: WizardValues;
}

export interface SubmitWizardResponse {
  jobId: string;
}
