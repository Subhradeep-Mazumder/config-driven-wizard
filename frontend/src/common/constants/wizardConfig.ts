import type { WizardConfig } from '@/types';

export const defaultWizardConfig: WizardConfig = {
  id: 'onboarding',
  title: 'Onboarding Wizard',
  steps: [
    {
      id: 'account',
      title: 'Account',
      description: 'Your account details',
      fields: [
        {
          name: 'fullName',
          label: 'Full name',
          type: 'text',
          validations: [
            { type: 'required', message: 'Full name is required' },
            { type: 'minLength', value: 2, message: 'At least 2 characters' },
            { type: 'maxLength', value: 60, message: 'At most 60 characters' },
          ],
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          validations: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
            { type: 'asyncUnique', message: 'This email is already registered' },
          ],
        },
      ],
    },
    {
      id: 'profile',
      title: 'Profile',
      fields: [
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          options: [
            { value: 'us', label: 'United States' },
            { value: 'in', label: 'India' },
            { value: 'de', label: 'Germany' },
          ],
          validations: [{ type: 'required', message: 'Choose a country' }],
        },
        {
          name: 'zip',
          label: 'ZIP / Postal code',
          type: 'text',
          validations: [
            { type: 'required', message: 'ZIP is required' },
            { type: 'pattern', value: '^[A-Za-z0-9 -]{3,10}$', message: 'Invalid ZIP format' },
          ],
          visibleWhen: { field: 'country', equals: 'us' },
        },
      ],
    },
    {
      id: 'compliance',
      title: 'Compliance (Admin only)',
      description: 'Additional admin-only attestation',
      visibleForRoles: ['admin'],
      fields: [
        {
          name: 'attestation',
          label: 'I attest the information provided is accurate',
          type: 'checkbox',
          validations: [{ type: 'required', message: 'You must attest to continue' }],
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Confirm and submit',
      fields: [],
    },
  ],
};

export default defaultWizardConfig;
