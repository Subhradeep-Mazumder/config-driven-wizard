import {
    validateField,
    validateStep,
    isFieldVisible,
    isStepVisible,
    hasErrors,
  } from './validate';
  import type { WizardFieldConfig, WizardStepConfig } from '@/types';
  
  describe('validateField', () => {
    const emailField: WizardFieldConfig = {
      name: 'email',
      label: 'Email',
      type: 'email',
      validations: [
        { type: 'required', message: 'required' },
        { type: 'email', message: 'invalid email' },
      ],
    };
  
    it('returns required message when empty', () => {
      expect(validateField(emailField, '')).toBe('required');
    });
  
    it('returns email message for malformed value', () => {
      expect(validateField(emailField, 'not-an-email')).toBe('invalid email');
    });
  
    it('returns undefined for valid email', () => {
      expect(validateField(emailField, 'a@b.co')).toBeUndefined();
    });
  
    it('enforces minLength and maxLength', () => {
      const field: WizardFieldConfig = {
        name: 'n',
        label: 'n',
        type: 'text',
        validations: [
          { type: 'minLength', value: 3, message: 'too short' },
          { type: 'maxLength', value: 5, message: 'too long' },
        ],
      };
      expect(validateField(field, 'ab')).toBe('too short');
      expect(validateField(field, 'abcdef')).toBe('too long');
      expect(validateField(field, 'abcd')).toBeUndefined();
    });
  
    it('enforces pattern', () => {
      const field: WizardFieldConfig = {
        name: 'zip',
        label: 'zip',
        type: 'text',
        validations: [{ type: 'pattern', value: '^\\d{5}$', message: 'bad zip' }],
      };
      expect(validateField(field, 'abcde')).toBe('bad zip');
      expect(validateField(field, '90210')).toBeUndefined();
    });
  });
  
  describe('visibility', () => {
    const step: WizardStepConfig = {
      id: 's',
      title: 'S',
      visibleForRoles: ['admin'],
      fields: [
        {
          name: 'zip',
          label: 'zip',
          type: 'text',
          visibleWhen: { field: 'country', equals: 'us' },
        },
      ],
    };
  
    it('hides step when role does not match', () => {
      expect(isStepVisible(step, {}, 'user')).toBe(false);
      expect(isStepVisible(step, {}, 'admin')).toBe(true);
    });
  
    it('hides field when its visibleWhen condition is not met', () => {
      const field = step.fields[0];
      expect(isFieldVisible(field, { country: 'in' }, 'admin')).toBe(false);
      expect(isFieldVisible(field, { country: 'us' }, 'admin')).toBe(true);
    });
  });
  
  describe('visibility edge cases', () => {
    it('skips step when skipWhen matches', () => {
      const step: WizardStepConfig = {
        id: 'skip',
        title: 'Skip',
        skipWhen: { field: 'country', equals: 'us' },
        fields: [],
      };
      expect(isStepVisible(step, { country: 'us' }, 'user')).toBe(false);
      expect(isStepVisible(step, { country: 'in' }, 'user')).toBe(true);
    });
  
    it('hides field when visibleForRoles excludes the caller', () => {
      const field: WizardFieldConfig = {
        name: 'adminOnly',
        label: 'Admin only',
        type: 'text',
        visibleForRoles: ['admin'],
      };
      expect(isFieldVisible(field, {}, 'user')).toBe(false);
      expect(isFieldVisible(field, {}, 'admin')).toBe(true);
    });
  
    it('returns true when no gates are set', () => {
      const field: WizardFieldConfig = { name: 'x', label: 'X', type: 'text' };
      const step: WizardStepConfig = { id: 's', title: 'S', fields: [] };
      expect(isFieldVisible(field, {}, 'guest')).toBe(true);
      expect(isStepVisible(step, {}, 'guest')).toBe(true);
    });
  });
  
  describe('validateField edge cases', () => {
    it('returns undefined when no validations are configured', () => {
      const field: WizardFieldConfig = { name: 'x', label: 'X', type: 'text' };
      expect(validateField(field, 'anything')).toBeUndefined();
    });
  
    it('returns required message when a checkbox value is false', () => {
      const field: WizardFieldConfig = {
        name: 'tos',
        label: 'tos',
        type: 'checkbox',
        validations: [{ type: 'required', message: 'must accept' }],
      };
      expect(validateField(field, false)).toBe('must accept');
      expect(validateField(field, true)).toBeUndefined();
    });
  
    it('ignores asyncUnique (handled elsewhere)', () => {
      const field: WizardFieldConfig = {
        name: 'email',
        label: 'email',
        type: 'email',
        validations: [{ type: 'asyncUnique', message: 'taken' }],
      };
      expect(validateField(field, 'a@b.co')).toBeUndefined();
    });
  
    it('skips pattern/email checks on empty string (required handles it)', () => {
      const field: WizardFieldConfig = {
        name: 'p',
        label: 'p',
        type: 'text',
        validations: [{ type: 'pattern', value: '^x$', message: 'no' }],
      };
      expect(validateField(field, '')).toBeUndefined();
    });
  });
  
  describe('validateStep', () => {
    const step: WizardStepConfig = {
      id: 's',
      title: 'S',
      fields: [
        { name: 'a', label: 'A', type: 'text', validations: [{ type: 'required', message: 'req' }] },
        { name: 'b', label: 'B', type: 'text' },
      ],
    };
  
    it('collects errors per visible field', () => {
      const errs = validateStep(step, { b: 'x' }, 'user');
      expect(errs.a).toBe('req');
      expect(errs.b).toBeUndefined();
      expect(hasErrors(errs)).toBe(true);
    });
  
    it('skips validation for fields that are not visible', () => {
      const stepWithHidden: WizardStepConfig = {
        id: 's',
        title: 'S',
        fields: [
          {
            name: 'adminOnly',
            label: 'admin only',
            type: 'text',
            visibleForRoles: ['admin'],
            validations: [{ type: 'required', message: 'req' }],
          },
        ],
      };
      const errs = validateStep(stepWithHidden, {}, 'user');
      expect(errs.adminOnly).toBeUndefined();
      expect(hasErrors(errs)).toBe(false);
    });
  });
  