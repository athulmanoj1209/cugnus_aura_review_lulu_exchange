import {
  booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmActionType, ConfirmDialogService } from '../services/confirm-dialog.service';

/*
  One confirm dialog, two ways to use it.

  1. Global (preferred) — mounted ONCE in app.component with the `global` flag:
       <app-confirm-action-dialog global />
     Then call from any component / service:
       const ok = await this.confirmSvc.confirm({
         title:        'Confirm Approval',
         message:      'Are you sure you want to approve this observation?',
         action:       'approve',
         confirmLabel: 'Yes, Approve',
       });
       if (ok) { ... }

  2. Inline (legacy) — placed in a page template and driven by inputs/outputs:
       <app-confirm-action-dialog
         [visible]="showConfirmDialog"
         [action]="'Deactivate'"
         [itemName]="row.name"
         (confirmed)="confirmToggle()"
         (cancelled)="closeConfirm()" />
*/

export type InlineConfirmAction = 'Activate' | 'Deactivate' | 'Delete';

interface ActionMeta {
  icon:        string;
  confirmIcon: string;
  severity:    ButtonSeverity;
}

const ACTION_META: Record<ConfirmActionType, ActionMeta> = {
  approve:    { icon: 'pi-check-circle',         confirmIcon: 'pi pi-check', severity: 'success' },
  activate:   { icon: 'pi-check-circle',         confirmIcon: 'pi pi-check', severity: 'success' },
  reject:     { icon: 'pi-times-circle',         confirmIcon: 'pi pi-times', severity: 'danger'  },
  deactivate: { icon: 'pi-ban',                  confirmIcon: 'pi pi-ban',   severity: 'danger'  },
  delete:     { icon: 'pi-trash',                confirmIcon: 'pi pi-trash', severity: 'danger'  },
  warning:    { icon: 'pi-exclamation-triangle', confirmIcon: 'pi pi-check', severity: 'warn'    },
  info:       { icon: 'pi-info-circle',          confirmIcon: 'pi pi-check', severity: 'info'    },
};

const INLINE_ACTION_TYPE: Record<InlineConfirmAction, ConfirmActionType> = {
  Activate:   'activate',
  Deactivate: 'deactivate',
  Delete:     'delete',
};

/** Normalised view of whichever mode is active. */
interface DialogView {
  title:        string;
  action:       ConfirmActionType;
  message:      string;
  /** Inline mode only — rendered as "Are you sure you want to <verb> <itemName>?" */
  verb?:        string;
  itemName?:    string;
  confirmLabel: string;
  cancelLabel:  string;
  severity:     ButtonSeverity;
  icon:         string;
  confirmIcon:  string;
}

@Component({
  selector: 'app-confirm-action-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls:   ['./confirm-action-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmActionDialogComponent {
  private readonly svc = inject(ConfirmDialogService);

  /** Render ConfirmDialogService state instead of the inline inputs. */
  readonly global = input(false, { transform: booleanAttribute });

  /* Inline mode */
  readonly visible  = input(false);
  readonly action   = input<InlineConfirmAction>('Deactivate');
  readonly itemName = input('');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly view = computed<DialogView | null>(() => {
    if (this.global()) {
      const s = this.svc.state();
      if (!s) return null;
      const meta = ACTION_META[s.action];
      return {
        title:        s.title,
        action:       s.action,
        message:      s.message,
        confirmLabel: s.confirmLabel ?? 'Yes, Confirm',
        cancelLabel:  s.cancelLabel ?? 'No, Cancel',
        severity:     s.confirmSeverity ?? meta.severity,
        icon:         meta.icon,
        confirmIcon:  meta.confirmIcon,
      };
    }

    if (!this.visible()) return null;
    const action = this.action();
    const type   = INLINE_ACTION_TYPE[action];
    const meta   = ACTION_META[type];
    return {
      title:        'Confirmation',
      action:       type,
      message:      '',
      verb:         action.toLowerCase(),
      itemName:     this.itemName(),
      confirmLabel: `Yes, ${action}`,
      cancelLabel:  'No, Cancel',
      severity:     meta.severity,
      icon:         meta.icon,
      confirmIcon:  meta.confirmIcon,
    };
  });

  respond(ok: boolean): void {
    if (this.global()) {
      this.svc.respond(ok);
    } else if (ok) {
      this.confirmed.emit();
    } else {
      this.cancelled.emit();
    }
  }
}
