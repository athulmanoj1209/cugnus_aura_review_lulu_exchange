import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { ComplianceScopeDetail } from '@/app/features/admin/dashboard/models/dashboard-compliance.model';

@Component({
  selector: 'app-compliance-detail-drawer',
  imports: [NgClass, DrawerModule, TagModule, ButtonModule, DividerModule, AvatarModule, TooltipModule, ProgressBarModule, DrawIconComponent],
  templateUrl: './compliance-detail-drawer.html',
  styleUrl: './compliance-detail-drawer.scss',
})
export class ComplianceDetailDrawer {
  @Input() visible = false;
  @Input() scope: ComplianceScopeDetail | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  close(): void {
    this.visibleChange.emit(false);
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'secondary'> = {
      Mapped: 'success', Partial: 'warn', 'Not Mapped': 'danger',
    };
    return map[status] ?? 'secondary';
  }

  /** Coloured capsule class for the status — matches the hero badge palette. */
  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      Mapped: 'badge--green',
      Partial: 'badge--amber',
      'Not Mapped': 'badge--red',
    };
    return map[status] ?? 'badge--blue';
  }

  /** Translated display text for a scope status — class lookups stay on the raw value. */
  statusText(status: string): string {
    switch (status) {
      case 'Mapped': return $localize`:@@dashboard.complianceDrawer.statusMapped:Mapped`;
      case 'Partial': return $localize`:@@dashboard.complianceDrawer.statusPartial:Partial`;
      case 'Not Mapped': return $localize`:@@dashboard.complianceDrawer.statusNotMapped:Not Mapped`;
      default: return status;
    }
  }

  getCoverageColor(coverage: number): string {
    if (coverage >= 80) return 'coverage--high';
    if (coverage >= 50) return 'coverage--medium';
    return 'coverage--low';
  }

  /** Coloured stat-icon tile for the coverage tile. */
  getCoverageIconClass(coverage: number): string {
    if (coverage >= 80) return 'stat-ic--mint';
    if (coverage >= 50) return 'stat-ic--amber';
    return 'stat-ic--red';
  }

  getAvatarInitial(name: string): string {
    return name ? name[0].toUpperCase() : '?';
  }

  /** Up-to-two-letter initials for the avatars. */
  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }

  get controlsNotMapped(): number {
    return this.scope ? this.scope.totalControls - this.scope.controlsMapped : 0;
  }
}