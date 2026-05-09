import { renderHook, act } from '@testing-library/react';
import useWizardStatusStream from './useWizardStatusStream';

jest.mock('@/common/configs', () => ({
  getEnvConfig: () => ({
    envName: 'local',
    apiBaseUrl: 'http://localhost:4300',
    sseUrl: 'http://localhost:4300/events',
    requestTimeoutMs: 1000,
  }),
}));

type Handler = (ev: MessageEvent) => void;

class MockEventSource {
  public static last: MockEventSource | null = null;
  public onopen: (() => void) | null = null;
  public onerror: (() => void) | null = null;
  public onmessage: Handler | null = null;
  public closed = false;
  constructor(public readonly url: string) {
    MockEventSource.last = this;
  }
  close() {
    this.closed = true;
  }
  emitMessage(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) } as MessageEvent);
  }
  emitRawMessage(raw: string) {
    this.onmessage?.({ data: raw } as MessageEvent);
  }
}

beforeAll(() => {
  (globalThis as unknown as { EventSource: typeof MockEventSource }).EventSource =
    MockEventSource;
});

beforeEach(() => {
  MockEventSource.last = null;
});

describe('useWizardStatusStream', () => {
  it('does nothing while disabled', () => {
    const { result } = renderHook(() => useWizardStatusStream(false));
    expect(MockEventSource.last).toBeNull();
    expect(result.current.connected).toBe(false);
    expect(result.current.events).toEqual([]);
    expect(result.current.latest).toBeNull();
  });

  it('opens the stream, parses messages, and exposes latest', () => {
    const { result } = renderHook(() => useWizardStatusStream(true));
    const es = MockEventSource.last!;
    expect(es.url).toBe('http://localhost:4300/events');

    act(() => es.onopen?.());
    expect(result.current.connected).toBe(true);

    act(() => es.emitMessage({ status: 'pending', message: 'queued', timestamp: 1 }));
    act(() => es.emitMessage({ status: 'approved', message: 'done', timestamp: 2 }));
    expect(result.current.events).toHaveLength(2);
    expect(result.current.latest).toEqual({ status: 'approved', message: 'done', timestamp: 2 });
  });

  it('marks connected=false on error', () => {
    const { result } = renderHook(() => useWizardStatusStream(true));
    act(() => MockEventSource.last!.onerror?.());
    expect(result.current.connected).toBe(false);
  });

  it('ignores malformed payloads', () => {
    const { result } = renderHook(() => useWizardStatusStream(true));
    act(() => MockEventSource.last!.emitRawMessage('{not-json'));
    expect(result.current.events).toEqual([]);
  });

  it('closes the stream on unmount', () => {
    const { unmount } = renderHook(() => useWizardStatusStream(true));
    const es = MockEventSource.last!;
    unmount();
    expect(es.closed).toBe(true);
  });
});
