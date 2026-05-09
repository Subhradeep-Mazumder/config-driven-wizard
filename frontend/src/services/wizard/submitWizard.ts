import { getHttpClient } from '@/services/http/client';
import type { SubmitWizardRequest, SubmitWizardResponse } from './submitWizard.d';

export async function submitWizard(req: SubmitWizardRequest): Promise<SubmitWizardResponse> {
  const http = getHttpClient();
  const { data } = await http.post<SubmitWizardResponse>('/api/wizard/submit', req);
  return data;
}

export default submitWizard;
