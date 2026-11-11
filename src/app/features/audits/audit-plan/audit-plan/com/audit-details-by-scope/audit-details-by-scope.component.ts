import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuditPlanStore } from '../audit-plan.store';
import { FREQ_LABELS, STATUS_META } from '../../models/audit-plan.model';
import { AUDIT_PLAN_FINDING_REF_BASE } from '../../constants/audit-plan.constants';
import { jobRef, runLongLabel, runShortLabel } from '../../constants/audit-plan-messages.constants';

@Component({
  selector: 'ap-instance-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, DialogModule],
  templateUrl: './audit-details-by-scope.component.html',
  styleUrl: './audit-details-by-scope.component.scss',
})
export class InstanceDialogComponent {
  readonly store = inject(AuditPlanStore);
  readonly meta = STATUS_META;
  readonly freqLabels = FREQ_LABELS;
  readonly findingRefBase = AUDIT_PLAN_FINDING_REF_BASE;
  readonly jobRef = jobRef;
  readonly runShortLabel = runShortLabel;
  readonly runLongLabel = runLongLabel;

  findingsArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }
}