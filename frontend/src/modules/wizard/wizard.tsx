import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import Button from '@/common/components/button';
import ErrorBanner from '@/common/components/errorBanner';
import useAuth from '@/common/utills/hooks/useAuth';
import useWizardStatusStream from '@/common/utills/hooks/useWizardStatusStream';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setStepIndex,
  patchValues,
  markStepCompleted,
  setStatus,
  resetWizard,
} from '@/store/slices/wizard/wizardSlice';
import {
  isFieldVisible,
  isStepVisible,
  validateField,
  validateStep,
  hasErrors,
} from '@/common/utills/helpers/validate';
import { checkEmailUnique } from '@/services/wizard/checkEmailUnique';
import { submitWizard } from '@/services/wizard/submitWizard';
import FieldRenderer from './fieldRenderer';
import type { WizardErrors, WizardStepConfig, WizardValues } from '@/types';
import type { WizardProps } from './wizard.d';
import './wizard.scss';

function useVisibleSteps(steps: WizardStepConfig[], values: WizardValues, role: ReturnType<typeof useAuth>['role']) {
  return useMemo(
    () => steps.filter((s) => isStepVisible(s, values, role)),
    [steps, values, role],
  );
}

export function Wizard({ config }: WizardProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { role } = useAuth();
  const { currentStepIndex, values, completedSteps, status, statusMessage } = useAppSelector(
    (s) => s.wizard,
  );
  const [errors, setErrors] = useState<WizardErrors>({});
  const [asyncPending, setAsyncPending] = useState(false);

  const stream = useWizardStatusStream(status === 'verifying');

  const visibleSteps = useVisibleSteps(config.steps, values, role);
  const activeIndex = Math.min(currentStepIndex, Math.max(0, visibleSteps.length - 1));
  const step = visibleSteps[activeIndex];

  const onFieldChange = useCallback(
    (name: string, value: string | number | boolean) => {
      dispatch(patchValues({ [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    [dispatch],
  );

  const onFieldBlur = useCallback(
    (name: string) => {
      if (!step) return;
      const field = step.fields.find((f) => f.name === name);
      if (!field) return;
      const err = validateField(field, values[name]);
      setErrors((prev) => ({ ...prev, [name]: err }));
    },
    [step, values],
  );

  const onNext = useCallback(async () => {
    if (!step) return;
    const stepErrors = validateStep(step, values, role);
    const hasAsyncUnique = step.fields.some((f) =>
      f.validations?.some((v) => v.type === 'asyncUnique'),
    );
    if (hasAsyncUnique && !stepErrors.email) {
      setAsyncPending(true);
      try {
        const email = String(values.email ?? '');
        if (email) {
          const unique = await checkEmailUnique(email);
          if (!unique) {
            const rule = step.fields
              .find((f) => f.name === 'email')
              ?.validations?.find((v) => v.type === 'asyncUnique');
            stepErrors.email = rule?.message ?? 'Email already in use';
          }
        }
      } catch {
        stepErrors.email = t('wizard.errors.asyncFailed');
      } finally {
        setAsyncPending(false);
      }
    }
    setErrors(stepErrors);
    if (hasErrors(stepErrors)) return;
    dispatch(markStepCompleted(step.id));
    const next = activeIndex + 1;
    if (next < visibleSteps.length) {
      dispatch(setStepIndex(next));
    }
  }, [step, values, role, dispatch, activeIndex, visibleSteps.length, t]);

  const onBack = useCallback(() => {
    dispatch(setStepIndex(Math.max(0, activeIndex - 1)));
  }, [dispatch, activeIndex]);

  const onSubmit = useCallback(async () => {
    dispatch(setStatus({ status: 'verifying', message: t('wizard.verifying') }));
    try {
      await submitWizard({ values });
    } catch (e) {
      dispatch(
        setStatus({
          status: 'failed',
          message: e instanceof Error ? e.message : t('wizard.errors.submit'),
        }),
      );
    }
  }, [dispatch, values, t]);

  useEffect(() => {
    const latest = stream.latest;
    if (!latest || status !== 'verifying') return;
    if (latest.status === 'approved') {
      dispatch(setStatus({ status: 'completed', message: latest.message }));
    } else if (latest.status === 'rejected' || latest.status === 'failed') {
      dispatch(setStatus({ status: 'failed', message: latest.message }));
    }
  }, [stream.latest, status, dispatch]);

  const onReset = useCallback(() => {
    dispatch(resetWizard());
    setErrors({});
  }, [dispatch]);

  const onStartNew = useCallback(() => {
    dispatch(resetWizard());
    setErrors({});
  }, [dispatch]);

  const onDismissError = useCallback(() => {
    dispatch(setStatus({ status: 'idle', message: undefined }));
  }, [dispatch]);

  if (visibleSteps.length === 0 || !step) {
    return <p role="alert">{t('wizard.empty')}</p>;
  }

  if (status === 'verifying') {
    const latest = stream.latest;
    return (
      <section className="wizard wizard--full" aria-labelledby="wizard-title">
        <div className="wizard__fullView" role="status" aria-live="polite">
          <CircularProgress aria-label={t('wizard.verifying')} />
          <h2 className="wizard__fullTitle">{t('wizard.verifying')}</h2>
          {latest ? (
            <p className="wizard__fullMessage">
              <strong>{latest.status}:</strong> {latest.message}
            </p>
          ) : (
            <p className="wizard__fullMessage">{t('wizard.waitingForUpdates')}</p>
          )}
        </div>
      </section>
    );
  }

  if (status === 'completed') {
    return (
      <section className="wizard wizard--full" aria-labelledby="wizard-title">
        <div className="wizard__fullView wizard__fullView--ok" role="status" aria-live="polite">
          <h2 className="wizard__fullTitle">{t('wizard.completed.title')}</h2>
          <p className="wizard__fullMessage">
            {statusMessage ?? t('wizard.completed.body')}
          </p>
          <p className="wizard__fullPrompt">{t('wizard.completed.askNew')}</p>
          <div className="wizard__fullActions">
            <Button onClick={onStartNew}>{t('wizard.completed.startNew')}</Button>
          </div>
        </div>
      </section>
    );
  }

  const isLast = activeIndex === visibleSteps.length - 1;

  return (
    <section className="wizard" aria-labelledby="wizard-title">
      <h1 id="wizard-title" className="wizard__title">
        {config.title}
      </h1>

      {status === 'failed' && (
        <ErrorBanner
          title={t('wizard.error.title')}
          message={statusMessage ?? t('wizard.errors.submit')}
          onRetry={onSubmit}
          onDismiss={onDismissError}
          retryLabel={t('wizard.error.retry')}
          dismissLabel={t('wizard.error.dismiss')}
        />
      )}

      <ol className="wizard__nav" aria-label={t('wizard.nav')}>
        {visibleSteps.map((s, i) => {
          const done = completedSteps.includes(s.id);
          const active = i === activeIndex;
          const cls = [
            'wizard__navItem',
            active && 'wizard__navItem--active',
            done && 'wizard__navItem--done',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <li key={s.id} className={cls} aria-current={active ? 'step' : undefined}>
              {i + 1}. {s.title}
            </li>
          );
        })}
      </ol>

      <div className="wizard__step" role="group" aria-labelledby={`step-${step.id}-title`}>
        <h2 id={`step-${step.id}-title`}>{step.title}</h2>
        {step.description && <p>{step.description}</p>}

        {step.fields.map((field) => {
          if (!isFieldVisible(field, values, role)) return null;
          return (
            <FieldRenderer
              key={field.name}
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={onFieldChange}
              onBlur={onFieldBlur}
            />
          );
        })}

        {step.fields.length === 0 && (
          <pre className="wizard__review" aria-label={t('wizard.reviewLabel')}>
            {JSON.stringify(values, null, 2)}
          </pre>
        )}
      </div>

      <div className="wizard__actions">
        <Button variant="text" onClick={onBack} disabled={activeIndex === 0}>
          {t('wizard.back')}
        </Button>
        <div className="wizard__actionsRight">
          <Button variant="outlined" color="secondary" onClick={onReset}>
            {t('wizard.reset')}
          </Button>
          {!isLast ? (
            <Button onClick={onNext} disabled={asyncPending}>
              {asyncPending ? t('wizard.checking') : t('wizard.next')}
            </Button>
          ) : (
            <Button onClick={onSubmit}>{t('wizard.submit')}</Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Wizard;
