export interface WizardStatusEvent {
    status: 'pending' | 'verifying' | 'approved' | 'rejected';
    message: string;
    timestamp: number;
  }
  
  export interface UseWizardStatusStreamReturn {
    events: WizardStatusEvent[];
    latest: WizardStatusEvent | null;
    connected: boolean;
  }
  