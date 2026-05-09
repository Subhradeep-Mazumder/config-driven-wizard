import type {
    Role,
    WizardErrors,
    WizardFieldConfig,
    WizardStepConfig,
    WizardValues,
  } from '@/types';
  
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  export function isFieldVisible(
    field: WizardFieldConfig,
    values: WizardValues,
    role: Role,
  ): boolean {
    if (field.visibleForRoles && !field.visibleForRoles.includes(role)) return false;
    if (field.visibleWhen) {
      const current = values[field.visibleWhen.field];
      if (current !== field.visibleWhen.equals) return false;
    }
    return true;
  }
  
  export function isStepVisible(step: WizardStepConfig, values: WizardValues, role: Role): boolean {
    if (step.visibleForRoles && !step.visibleForRoles.includes(role)) return false;
    if (step.skipWhen) {
      const current = values[step.skipWhen.field];
      if (current === step.skipWhen.equals) return false;
    }
    return true;
  }
  
  export function validateField(
    field: WizardFieldConfig,
    value: string | number | boolean | undefined,
  ): string | undefined {
    const rules = field.validations ?? [];
    for (const rule of rules) {
      if (rule.type === 'required') {
        if (value === undefined || value === null || value === '' || value === false) {
          return rule.message;
        }
      }
      if (rule.type === 'minLength' && typeof value === 'string') {
        if (value.length < Number(rule.value)) return rule.message;
      }
      if (rule.type === 'maxLength' && typeof value === 'string') {
        if (value.length > Number(rule.value)) return rule.message;
      }
      if (rule.type === 'pattern' && typeof value === 'string' && value.length > 0) {
        const re = new RegExp(String(rule.value));
        if (!re.test(value)) return rule.message;
      }
      if (rule.type === 'email' && typeof value === 'string' && value.length > 0) {
        if (!EMAIL_RE.test(value)) return rule.message;
      }
    }
    return undefined;
  }
  
  export function validateStep(
    step: WizardStepConfig,
    values: WizardValues,
    role: Role,
  ): WizardErrors {
    const errors: WizardErrors = {};
    for (const field of step.fields) {
      if (!isFieldVisible(field, values, role)) continue;
      const err = validateField(field, values[field.name]);
      if (err) errors[field.name] = err;
    }
    return errors;
  }
  
  export function hasErrors(errors: WizardErrors): boolean {
    return Object.values(errors).some(Boolean);
  }
  