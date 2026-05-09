import reducer, {
    setStepIndex,
    patchValues,
    markStepCompleted,
    setStatus,
    resetWizard,
  } from './wizardSlice';
  import type { WizardState } from './wizardSlice.d';
  
  const initial: WizardState = {
    currentStepIndex: 0,
    values: {},
    completedSteps: [],
    status: 'idle',
    statusMessage: null,
  };
  
  describe('wizardSlice', () => {
    it('advances step index, clamps negatives', () => {
      expect(reducer(initial, setStepIndex(2)).currentStepIndex).toBe(2);
      expect(reducer(initial, setStepIndex(-5)).currentStepIndex).toBe(0);
    });
  
    it('merges values', () => {
      const a = reducer(initial, patchValues({ email: 'a@b.com' }));
      const b = reducer(a, patchValues({ name: 'Ada' }));
      expect(b.values).toEqual({ email: 'a@b.com', name: 'Ada' });
    });
  
    it('marks steps completed once', () => {
      const a = reducer(initial, markStepCompleted('step1'));
      const b = reducer(a, markStepCompleted('step1'));
      expect(b.completedSteps).toEqual(['step1']);
    });
  
    it('sets status with message', () => {
      const a = reducer(initial, setStatus({ status: 'verifying', message: 'working' }));
      expect(a.status).toBe('verifying');
      expect(a.statusMessage).toBe('working');
    });
  
    it('resets to initial', () => {
      const dirty = reducer(initial, patchValues({ x: 1 }));
      expect(reducer(dirty, resetWizard())).toEqual(initial);
    });
  });
  