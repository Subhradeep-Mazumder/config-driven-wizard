import { useEffect, useRef, useState } from 'react';
import { getEnvConfig } from '@/common/configs';
import type { UseWizardStatusStreamReturn, WizardStatusEvent } from './useWizardStatusStream.d';

export function useWizardStatusStream(enabled: boolean): UseWizardStatusStreamReturn {
  const [events, setEvents] = useState<WizardStatusEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const { sseUrl } = getEnvConfig();
    const es = new EventSource(sseUrl, { withCredentials: false });
    sourceRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(ev.data) as WizardStatusEvent;
        setEvents((prev) => [...prev, parsed]);
      } catch {
        // ignore malformed payloads
      }
    };

    return () => {
      es.close();
      sourceRef.current = null;
      setConnected(false);
    };
  }, [enabled]);

  return {
    events,
    latest: events.length > 0 ? events[events.length - 1] : null,
    connected,
  };
}

export default useWizardStatusStream;
