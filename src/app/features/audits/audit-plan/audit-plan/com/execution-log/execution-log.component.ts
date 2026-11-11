import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { AuditPlanStore, LogRowVM } from '../audit-plan.store';
import { MONTHS, STATUS_META, StatusMeta } from '../../models/audit-plan.model';
import { ScopeJobDrawerService } from '../../../scope-job/services/scope-job.service';
import { EXECUTION_LOG_PAGINATION, INSTANCE_STATUS_ORDER, PlanViews } from '../../constants/audit-plan.constants';
import { runShortLabel } from '../../constants/audit-plan-messages.constants';

@Component({
  selector: 'ap-execution-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, SelectModule, FormsModule, TableModule],
  templateUrl: './execution-log.component.html',
  styleUrl: './execution-log.component.scss',
})
export class ExecutionLogComponent {
  readonly store = inject(AuditPlanStore);
  readonly meta = STATUS_META;
  readonly statusKeys = INSTANCE_STATUS_ORDER;
  readonly monthOptions = MONTHS.map((label, value) => ({ label, value }));
  readonly PlanViews = PlanViews;
  readonly pageRows = EXECUTION_LOG_PAGINATION.Rows;
  readonly rowsPerPageOptions = [...EXECUTION_LOG_PAGINATION.RowsPerPageOptions];
  readonly runShortLabel = runShortLabel;

  private readonly jobDrawer = inject(ScopeJobDrawerService);

  /** open the scope-job profile drawer for this log row */
  open(row: LogRowVM): void {
    this.jobDrawer.openFromPlan({
      deptName: row.subDivisionName,
      scope: row.scope,
      job: row.job,
      monthIndex: row.monthIndex,
      year: this.store.year(),
      status: row.status,
      run: row.job.run,
    });
  }

  /** typed accessor — p-table's `let-row` context is untyped, so index STATUS_META here */
  metaOf(row: LogRowVM): StatusMeta {
    return STATUS_META[row.status];
  }
}