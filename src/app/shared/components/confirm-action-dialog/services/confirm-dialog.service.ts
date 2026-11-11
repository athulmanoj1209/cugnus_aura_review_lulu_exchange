import { Injectable, signal } from '@angular/core';
import type { ButtonSeverity } from 'primeng/button';

/* ── Public types ─────────────────────────────────────────────────── */
export type ConfirmActionType =
  | 'approve' | 'reject' | 'delete' | 'warning' | 'info' | 'activate' | 'deactivate';

export interface ConfirmOptions {
  title:            string;
  message:          string;
  action:           ConfirmActionType;
  confirmLabel?:    string;
  cancelLabel?:     string;
  confirmSeverity?: ButtonSeverity;   // default: derived from action
}

/** @internal – only used by ConfirmActionDialogComponent */
export interface ConfirmState extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

/* ── Service ──────────────────────────────────────────────────────── */
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  /** Reactive state read by the global dialog component. */
  readonly state = signal<ConfirmState | null>(null);

  /**
   * Show the confirm dialog and wait for the user's answer.
   * @returns `true` if the user confirmed, `false` if they cancelled.
   *
   * @example
   * const ok = await this.confirmSvc.confirm({
   *   title:   'Confirm Approval',
   *   message: 'Are you sure you want to approve this observation?',
   *   action:  'approve',
   *   confirmLabel: 'Yes, Approve',
   * });
   * if (ok) { ... }
   */
  confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise(resolve => {
      this.state.set({ ...options, resolve });
    });
  }

  /** Called by the dialog component when the user clicks a button. */
  respond(confirmed: boolean): void {
    this.state()?.resolve(confirmed);
    this.state.set(null);
  }
}