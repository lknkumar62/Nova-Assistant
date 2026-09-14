import type { NovaState } from '../types';

export type NovaEvent =
  | 'START' | 'STOP' | 'WAKE_DETECTED' | 'INPUT_STARTED'
  | 'INPUT_RECEIVED' | 'RESPONSE_READY' | 'SPEECH_STARTED'
  | 'SPEECH_FINISHED' | 'INTERRUPT' | 'FAIL';

const transitions: Record<NovaState, Partial<Record<NovaEvent, NovaState>>> = {
  idle: { START: 'listening', WAKE_DETECTED: 'listening' },
  listening: { STOP: 'idle', INPUT_RECEIVED: 'processing', FAIL: 'error' },
  processing: { STOP: 'idle', RESPONSE_READY: 'speaking', FAIL: 'error' },
  speaking: { STOP: 'idle', SPEECH_FINISHED: 'idle', INTERRUPT: 'listening', FAIL: 'error' },
  error: { START: 'listening', STOP: 'idle' },
};

export class NovaStateMachine {
  private current: NovaState = 'idle';
  get state() { return this.current; }
  dispatch(event: NovaEvent) {
    const next = transitions[this.current][event];
    if (next) this.current = next;
    return this.current;
  }
}
