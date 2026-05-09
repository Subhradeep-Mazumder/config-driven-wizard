import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/common/components/button';
import defaultWizardConfig from '@/common/constants/wizardConfig';
import { useAppDispatch } from '@/store/store';
import { resetWizard } from '@/store/slices/wizard/wizardSlice';
import Wizard from './wizard';
import type { WizardConfig } from '@/types';
import './wizardBuilder.scss';

const SAMPLE = JSON.stringify(defaultWizardConfig, null, 2);

function parseConfig(raw: string): { config: WizardConfig | null; error: string | null } {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { config: null, error: 'Config must be a JSON object' };
    }
    if (!Array.isArray(parsed.steps)) {
      return { config: null, error: 'Config must have a "steps" array' };
    }
    if (parsed.steps.length === 0) {
      return { config: null, error: 'At least one step is required' };
    }
    return { config: parsed as WizardConfig, error: null };
  } catch (e) {
    return { config: null, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function WizardBuilder() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [raw, setRaw] = useState<string>(SAMPLE);
  const [activeConfig, setActiveConfig] = useState<WizardConfig>(defaultWizardConfig);

  const parsed = useMemo(() => parseConfig(raw), [raw]);

  const onApply = useCallback(() => {
    if (parsed.config) {
      setActiveConfig(parsed.config);
      dispatch(resetWizard());
    }
  }, [parsed.config, dispatch]);

  const onReset = useCallback(() => {
    setRaw(SAMPLE);
    setActiveConfig(defaultWizardConfig);
    dispatch(resetWizard());
  }, [dispatch]);

  return (
    <section className="builder" aria-labelledby="builder-title">
      <div className="builder__editor">
        <h2 id="builder-title" className="builder__title">
          {t('builder.title')}
        </h2>
        <p className="builder__hint">{t('builder.hint')}</p>

        <div className="builder__toolbar" role="toolbar" aria-label={t('builder.toolbar')}>
          <Button onClick={onApply} disabled={!parsed.config}>
            {t('builder.apply')}
          </Button>
          <Button variant="outlined" onClick={onReset}>
            {t('builder.reset')}
          </Button>
        </div>

        <label className="builder__label" htmlFor="builder-json">
          {t('builder.jsonLabel')}
        </label>
        <textarea
          id="builder-json"
          className="builder__textarea"
          value={raw}
          spellCheck={false}
          onChange={(e) => setRaw(e.target.value)}
          aria-describedby="builder-status"
        />

        <div id="builder-status" className="builder__status" role="status" aria-live="polite">
          {parsed.error ? (
            <span className="builder__status--err">{t('builder.invalid')}: {parsed.error}</span>
          ) : (
            <span className="builder__status--ok">{t('builder.valid')}</span>
          )}
        </div>
      </div>

      <div className="builder__preview">
        <Wizard config={activeConfig} />
      </div>
    </section>
  );
}

export default WizardBuilder;
