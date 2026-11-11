import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import {
  Risk, RiskType, ControlEffectiveness, RiskStatus, ResidualLevel,
  calcInherent, calcResidualScore, calcResidualLevel,
} from '../../models/risk.model';
import {
  RiskControlEffectiveness,
  RiskImportSteps,
  RiskStatuses,
  RiskTypes,
  type RiskImportStep,
  RISK_EMPTY_VALUE,
  RISK_ID_PREFIX,
  RISK_IMPORT_DIALOG_WIDTH,
  RISK_IMPORT_ERROR_CHIP_MAX_LENGTH,
  RISK_IMPORT_TEMPLATE_FILE_NAME,
  RISK_IMPORT_UPLOAD,
  RISK_SCALE_MAX,
  RISK_SCALE_MIN,
} from '../../constants/risk.constants';
import {
  RISK_IMPORT_TEMPLATE_EXAMPLE,
  RISK_IMPORT_TEMPLATE_HEADERS,
  RISK_TYPE_LABELS,
} from '../../constants/risk-labels.constants';
import {
  RISK_IMPORT_PARSE_ERRORS,
  RISK_IMPORT_ROW_ERRORS,
  RISK_IMPORT_SUBTITLES,
  RISK_IMPORTING_LABEL,
  importRisksLabel,
  invalidControlEffectivenessMessage,
  invalidRiskStatusMessage,
  invalidRiskTypeMessage,
} from '../../constants/risk-messages.constants';

/* ── Row shape after parsing ─────────────────────────────────────── */
export interface ImportRow {
  rowIndex:             number;
  title:                string;
  riskType:             string;
  description:          string;
  department:           string;
  impact:               number | null;
  likelihood:           number | null;
  keyControls:          string;
  controlEffectiveness: string;
  owner:                string;
  status:               string;
  linkedScopes:         string;
  errors:               string[];
  valid:                boolean;
}

/* ── Valid option sets for validation ────────────────────────────── */
const VALID_TYPES: RiskType[] = Object.values(RiskTypes);
const VALID_CE: ControlEffectiveness[] = Object.values(RiskControlEffectiveness);
const VALID_STATUSES: RiskStatus[]     = [RiskStatuses.Open, RiskStatuses.Monitored, RiskStatuses.Closed];

@Component({
  selector: 'app-import-risk',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, FileUploadModule, TooltipModule, DrawIconComponent],
  templateUrl: './import-risk.component.html',
  styleUrl: './import-risk.component.scss',
})
export class ImportRiskComponent {
  @Output() imported = new EventEmitter<Partial<Risk>[]>();

  readonly visible     = signal(false);
  readonly step        = signal<RiskImportStep>(RiskImportSteps.Upload);
  readonly rows        = signal<ImportRow[]>([]);
  readonly fileName    = signal('');
  readonly parseError  = signal('');
  readonly importing   = signal(false);

  // Exposed for the template.
  readonly RiskImportSteps     = RiskImportSteps;
  readonly dialogWidth         = RISK_IMPORT_DIALOG_WIDTH;
  readonly subtitles           = RISK_IMPORT_SUBTITLES;
  readonly upload              = RISK_IMPORT_UPLOAD;
  readonly emptyValue          = RISK_EMPTY_VALUE;
  readonly defaultStatus       = RiskStatuses.Open;
  readonly importingLabel      = RISK_IMPORTING_LABEL;
  readonly importRisksLabel    = importRisksLabel;

  get validRows()   { return this.rows().filter(r => r.valid); }
  get invalidRows() { return this.rows().filter(r => !r.valid); }

  open()  { this.visible.set(true); this.reset(); }
  close() { this.visible.set(false); }

  private reset() {
    this.step.set(RiskImportSteps.Upload);
    this.rows.set([]);
    this.fileName.set('');
    this.parseError.set('');
    this.importing.set(false);
  }

  /* ── Template download ─────────────────────────────────────────── */
  downloadTemplate(): void {
    const csvContent = [
      RISK_IMPORT_TEMPLATE_HEADERS.join(','),
      RISK_IMPORT_TEMPLATE_EXAMPLE.join(','),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = RISK_IMPORT_TEMPLATE_FILE_NAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ── File selection ────────────────────────────────────────────── */
  onFileSelected(event: FileSelectEvent): void {
    const file = (event.files as FileList | File[])[0];
    if (!file) return;
    this.fileName.set(file.name);
    this.parseError.set('');

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      this.parseCSV(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      this.parseExcel(file);
    } else {
      this.parseError.set(RISK_IMPORT_PARSE_ERRORS.UnsupportedFile);
    }
  }

  /* ── CSV parser ────────────────────────────────────────────────── */
  private parseCSV(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) { this.parseError.set(RISK_IMPORT_PARSE_ERRORS.ReadFailed); return; }

      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) {
        this.parseError.set(RISK_IMPORT_PARSE_ERRORS.NoDataRows);
        return;
      }

      // Skip header row (index 0)
      const dataRows = lines.slice(1);
      const parsed   = dataRows.map((line, i) => this.parseRow(line.split(','), i + 2));
      this.rows.set(parsed);
      this.step.set(RiskImportSteps.Preview);
    };
    reader.readAsText(file);
  }

  /* ── Excel parser (uses SheetJS if available, falls back to CSV read) */
  private parseExcel(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        /* Try SheetJS — bundled in many Angular projects via xlsx package */
        const XLSX = (window as any)['XLSX'];
        if (XLSX) {
          const data    = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet   = workbook.Sheets[workbook.SheetNames[0]];
          const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
          if (rows.length < 2) {
            this.parseError.set(RISK_IMPORT_PARSE_ERRORS.NoSpreadsheetRows);
            return;
          }
          const parsed = rows.slice(1).map((row, i) => this.parseRow(row.map(String), i + 2));
          this.rows.set(parsed);
          this.step.set(RiskImportSteps.Preview);
        } else {
          this.parseError.set(RISK_IMPORT_PARSE_ERRORS.SheetJsMissing);
        }
      } catch (err) {
        this.parseError.set(RISK_IMPORT_PARSE_ERRORS.ExcelParseFailed);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /* ── Row parser & validator ────────────────────────────────────── */
  private parseRow(cols: string[], rowIndex: number): ImportRow {
    const [
      title = '', riskType = '', description = '', department = '',
      impactStr = '', likelihoodStr = '', keyControls = '',
      controlEffectiveness = '', owner = '', status = '', linkedScopes = '',
    ] = cols.map(c => c.trim().replace(/^"|"$/g, ''));

    const errors: string[] = [];

    if (!title)       errors.push(RISK_IMPORT_ROW_ERRORS.TitleRequired);
    if (!description) errors.push(RISK_IMPORT_ROW_ERRORS.DescriptionRequired);
    if (!department)  errors.push(RISK_IMPORT_ROW_ERRORS.SubDivisionRequired);
    if (!owner)       errors.push(RISK_IMPORT_ROW_ERRORS.OwnerRequired);

    const impact     = parseInt(impactStr, 10);
    const likelihood = parseInt(likelihoodStr, 10);
    if (!impactStr || isNaN(impact) || impact < RISK_SCALE_MIN || impact > RISK_SCALE_MAX)
      errors.push(RISK_IMPORT_ROW_ERRORS.ImpactRange);
    if (!likelihoodStr || isNaN(likelihood) || likelihood < RISK_SCALE_MIN || likelihood > RISK_SCALE_MAX)
      errors.push(RISK_IMPORT_ROW_ERRORS.LikelihoodRange);

    const normType = riskType.toLowerCase().replace(/[^a-z_/]/g, '').replace('/', '_');
    if (!VALID_TYPES.includes(normType as RiskType))
      errors.push(invalidRiskTypeMessage(riskType, VALID_TYPES));

    const normCE = controlEffectiveness.toLowerCase();
    if (!VALID_CE.includes(normCE as ControlEffectiveness))
      errors.push(invalidControlEffectivenessMessage(controlEffectiveness, VALID_CE));

    const normStatus = (status || RiskStatuses.Open).toLowerCase();
    if (!VALID_STATUSES.includes(normStatus as RiskStatus))
      errors.push(invalidRiskStatusMessage(status, VALID_STATUSES));

    return {
      rowIndex, title, riskType, description, department,
      impact: isNaN(impact) ? null : impact,
      likelihood: isNaN(likelihood) ? null : likelihood,
      keyControls, controlEffectiveness, owner, status, linkedScopes,
      errors, valid: errors.length === 0,
    };
  }

  /* ── Confirm import ────────────────────────────────────────────── */
  confirmImport(): void {
    if (!this.validRows.length) return;
    this.importing.set(true);

    const risks: Partial<Risk>[] = this.validRows.map((row, i) => {
      const impact     = row.impact!;
      const likelihood = row.likelihood!;
      const ce         = row.controlEffectiveness.toLowerCase() as ControlEffectiveness;
      const inherent   = calcInherent(impact, likelihood);
      const residual   = calcResidualScore(inherent, ce);

      return {
        id:                   `${RISK_ID_PREFIX}${String(Date.now() + i).slice(-4)}`,
        title:                row.title,
        riskType:             row.riskType.toLowerCase() as RiskType,
        description:          row.description,
        subDivision:          row.department,
        impact, likelihood,
        inherentScore:        inherent,
        keyControls:          row.keyControls || undefined,
        controlEffectiveness: ce,
        residualScore:        residual,
        residualLevel:        calcResidualLevel(residual),
        owner:                row.owner,
        status:               (row.status.toLowerCase() || RiskStatuses.Open) as RiskStatus,
        linkedScopes:         row.linkedScopes ? row.linkedScopes.split(';').map(s => s.trim()) : [],
        linkedFindings:       [],
        linkedObservations:   [],
        supportingFiles:      [],
        dateIdentified:       new Date(),
        lastUpdated:          new Date(),
      };
    });

    this.imported.emit(risks);
    this.importing.set(false);
    this.close();
  }

  goBack() { this.step.set(RiskImportSteps.Upload); this.rows.set([]); this.fileName.set(''); }

  typeLabel(t: string): string {
    return RISK_TYPE_LABELS[t.toLowerCase() as RiskType] ?? t;
  }

  /** Score level class of a preview row (null when impact/likelihood are missing). */
  rowScoreLevel(row: ImportRow): ResidualLevel | null {
    return row.impact && row.likelihood ? calcResidualLevel(row.impact * row.likelihood) : null;
  }

  /** Error text shortened to fit a chip (the full text is in the tooltip). */
  errorChipText(err: string): string {
    return err.length > RISK_IMPORT_ERROR_CHIP_MAX_LENGTH
      ? err.slice(0, RISK_IMPORT_ERROR_CHIP_MAX_LENGTH - 2) + '…'
      : err;
  }
}