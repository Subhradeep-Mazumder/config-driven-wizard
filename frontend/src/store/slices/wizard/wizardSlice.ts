import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { WizardValues } from '@/types';
import type { WizardState, WizardStatus } from './wizardSlice.d';

const initialState: WizardState = {
  currentStepIndex: 0,
  values: {},
  completedSteps: [],
  status: 'idle',
  statusMessage: null,
};

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    setStepIndex(state, action: PayloadAction<number>) {
      state.currentStepIndex = Math.max(0, action.payload);
    },
    patchValues(state, action: PayloadAction<WizardValues>) {
      state.values = { ...state.values, ...action.payload };
    },
    markStepCompleted(state, action: PayloadAction<string>) {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    setStatus(state, action: PayloadAction<{ status: WizardStatus; message?: string | null }>) {
      state.status = action.payload.status;
      state.statusMessage = action.payload.message ?? null;
    },
    resetWizard() {
      return initialState;
    },
  },
});

export const { setStepIndex, patchValues, markStepCompleted, setStatus, resetWizard } =
  wizardSlice.actions;
export default wizardSlice.reducer;
