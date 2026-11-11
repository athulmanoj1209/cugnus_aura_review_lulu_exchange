import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule }  from 'primeng/button';
import { TabsModule }    from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { BackButtonComponent } from '@/app/shared/components/back-button/back-button.component';

// ── Models ─────────────────────────────────────────────────────────────────────

export interface CrossReference {
  title: string;
  code: string;
  authority: string;
}

export interface WhereUsedItem {
  type: 'Scope' | 'Task' | 'Finding' | 'RFI' | string;
  id: string;
  title: string;
  linkedDate: Date | string;
}

export interface VersionHistoryItem {
  version: string;
  isCurrent: boolean;
  effectiveDate: Date | string;
  amendedDate: Date | string | null;
  fileName: string;
  uploadedBy: string;
  uploadDate: Date | string;
}

export interface RegulationDetail {
  id: string;
  authority: string;
  type: string;
  status: 'Current' | 'Draft' | 'Superseded' | string;
  jurisdiction: string;
  title: string;
  reference: string;
  description: string;
  effectiveDate: Date | string;
  lastAmended: Date | string | null;
  fileName: string | null;
  createdBy: string;
  createdDate: Date | string;
  lastModifiedBy: string;
  lastModifiedDate: Date | string;
  tags: string[];
  relatedFunctions: string[];
  crossReferences: CrossReference[];
  whereUsed: WhereUsedItem[];
  versionHistory: VersionHistoryItem[];
}

// ── Mock data keyed by regulation ID ──────────────────────────────────────────
// Replace this with a real service call (e.g. this.regulationService.getById(id))

const MOCK_DETAIL_DATA: Record<string, RegulationDetail> = {
  '1': {
    id: '1',
    authority: 'CBUAE',
    type: 'Regulation',
    status: 'Current',
    jurisdiction: 'UAE',
    title: 'Anti-Money Laundering and Combating the Financing of Terrorism Guidelines',
    reference: 'CBUAE/BSD/2022/001',
    description:
      'Comprehensive guidelines for financial institutions on implementing AML/CFT controls, customer due diligence, transaction monitoring, and reporting suspicious activities in accordance with UAE federal laws and FATF recommendations.',
    effectiveDate: new Date('2022-01-15'),
    lastAmended: new Date('2024-06-30'),
    fileName: 'CBUAE_AML_CFT_Guidelines_2024.pdf',
    createdBy: 'Mohammed Ali',
    createdDate: new Date('2022-01-10'),
    lastModifiedBy: 'Sarah Ahmed',
    lastModifiedDate: new Date('2024-06-25'),
    tags: ['AML', 'CFT', 'KYC', 'CDD', 'Suspicious Activity', 'FATF'],
    relatedFunctions: ['Onboarding', 'Screening', 'Transaction Monitoring', 'Compliance'],
    crossReferences: [
      { title: 'Conduct of Business Rulebook', code: 'DFSA-COB', authority: 'DFSA' },
      { title: 'Risk-Based Approach Guidance for Virtual Assets', code: 'FATF-VA-RBA-2023', authority: 'FATF' },
    ],
    whereUsed: [
      { type: 'Scope',   id: 'SCO-001', title: 'Q1 2025 AML Compliance Audit',                  linkedDate: new Date('2025-01-10') },
      { type: 'Task',    id: 'TSK-045', title: 'Review Customer Due Diligence Procedures',       linkedDate: new Date('2025-01-15') },
      { type: 'Finding', id: 'FND-012', title: 'Inadequate Enhanced Due Diligence for PEPs',     linkedDate: new Date('2025-02-05') },
    ],
    versionHistory: [
      {
        version: 'v2', isCurrent: true,
        effectiveDate: new Date('2024-06-30'), amendedDate: new Date('2024-06-30'),
        fileName: 'CBUAE_AML_CFT_Guidelines_2024.pdf',
        uploadedBy: 'Sarah Ahmed', uploadDate: new Date('2024-06-25'),
      },
      {
        version: 'v1', isCurrent: false,
        effectiveDate: new Date('2022-01-15'), amendedDate: null,
        fileName: 'CBUAE_AML_CFT_Guidelines_2022.pdf',
        uploadedBy: 'Mohammed Ali', uploadDate: new Date('2022-01-10'),
      },
    ],
  },
};

function buildFallbackDetail(id: string): RegulationDetail {
  return {
    id,
    authority: '',
    type: '',
    status: 'Current',
    jurisdiction: '',
    title: 'Regulation Details',
    reference: id,
    description: '',
    effectiveDate: new Date(),
    lastAmended: null,
    fileName: null,
    createdBy: '',
    createdDate: new Date(),
    lastModifiedBy: '',
    lastModifiedDate: new Date(),
    tags: [],
    relatedFunctions: [],
    crossReferences: [],
    whereUsed: [],
    versionHistory: [],
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-regulation-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule, TabsModule, TooltipModule, DrawIconComponent, BackButtonComponent],
  templateUrl: './regulation-library-profile.component.html',
  styleUrls: ['./regulation-library-profile.component.scss'],
})
export class RegulationDetailComponent implements OnInit {

  regulation!: RegulationDetail;
  activeTab = '0';
  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    // ─── Replace the lines below with a real service call ───────────────────
    // e.g. this.regulationService.getById(id).subscribe(reg => { this.regulation = reg; this.loading = false; });
    const found = MOCK_DETAIL_DATA[id];
    if (found) {
      this.regulation = found;
    } else {
      // Fallback: build a minimal object so the template doesn't crash
      this.regulation = buildFallbackDetail(id);
      this.notFound = true;
    }
    this.loading = false;
    // ────────────────────────────────────────────────────────────────────────
  }

  onDownload(): void {
    if (this.regulation?.fileName) {
      console.log('Download:', this.regulation.fileName);
      // Trigger your actual file-download service here
    }
  }

  get whereUsedCount(): number   { return this.regulation?.whereUsed?.length  ?? 0; }
  get versionCount(): number     { return this.regulation?.versionHistory?.length ?? 0; }

  formatDate(value: Date | string | null | undefined): string {
    if (!value) return 'N/A';
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  formatDateShort(value: Date | string | null | undefined): string {
    if (!value) return 'N/A';
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  }

  typeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'scope':   return 'badge--scope';
      case 'task':    return 'badge--task';
      case 'finding': return 'badge--finding';
      case 'rfi':     return 'badge--rfi';
      default:        return 'badge--default';
    }
  }
}