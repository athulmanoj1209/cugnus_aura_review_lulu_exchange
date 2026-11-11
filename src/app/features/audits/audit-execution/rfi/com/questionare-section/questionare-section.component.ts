import { Component, Input, OnChanges, OnDestroy, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { EmptyStateComponent } from '@/app/shared/components/empty-state/empty-state.component';
import { DrawIconComponent } from '@/app/shared/components/draw-icon/draw-icon.component';
import { RFI_QUESTIONNAIRE_EXCEL, RFI_QUESTIONNAIRE_TOAST_LIFE, RfiViewerRoles } from '../../constants/rfi.constants';
import { RFI_QUESTIONNAIRE_NOTICES } from '../../constants/rfi-messages.constants';

type AOA = any[][];

// ── File attachment model ─────────────────────────────────────────────────────
export interface RfiAttachment {
  name: string;
  file?: File;       // undefined for server-loaded doc references (view-only)
  objectUrl: string; // blob URL for new uploads, or the server URL for loaded docs
  iconClass: string;
  description?: string;
}

// ── Questionnaire row model ───────────────────────────────────────────────────
export interface QuestionnaireRow {
  id: number;
  questionText: string;
  questionFiles: RfiAttachment[];
  answerText: string;
  answerFiles: RfiAttachment[];
  dueDate: Date | null;
  dueDateInvalid?: boolean;   // transient UI flag for past-date warning
}

@Component({
  selector: 'app-questionare-section',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    BadgeModule,
    DividerModule,
    FileUploadModule,
    ToastModule,
    DatePickerModule,
    EmptyStateComponent,

    DrawIconComponent,],
  providers: [MessageService],
  templateUrl: './questionare-section.component.html',
  styleUrl: './questionare-section.component.scss',
})
export class QuestionareSection implements OnChanges, OnDestroy, OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    if (this.startWithEmptyRow && this.rows.length === 0) {
      this.addRow();
    }
  }

  // ── Inputs from parent (manage/rfi) ─────────────────────────────────────────────
  @Input() scopeLabel: string = '';
  @Input() subScopeLabel: string = '';
  @Input() initialQuestions: string[] = [];

  // Passed from the parent — drives auditor vs client behaviour in the questionnaire
  @Input() currentUser: string = RfiViewerRoles.Auditor;

  // When true, hides the Answer column (used for pending/overdue RFIs in auditor view)
  @Input() hideAnswers: boolean = false;

  // When true, makes Answer column read-only (used for under-review status in client view)
  @Input() readonlyAnswers: boolean = false;

  // When true, makes Question column read-only (used in view mode — auditor cannot edit)
  @Input() readonlyQuestions: boolean = false;

  // Pre-populate rows with both question and answer text (used in auditor view of existing RFIs)
  @Input() initialRows: Array<{
    question: string;
    answer?: string;
    dueDate?: string | null;
    questionDocs?: Array<{ name: string; url: string; description?: string }>;
    answerDocs?: Array<{ name: string; url: string; description?: string }>;
  }> = [];

  @Input() responseView: boolean = false;

  // When true, hides the section header and excel upload strip (used in client view)
  @Input() hideHeader: boolean = false;

  // When true, pre-populates the grid with one empty row so the table is visible immediately
  @Input() startWithEmptyRow: boolean = false;

  readonly addQuestionLabel = $localize`:@@audit.questionnaire.addQuestion:Add Question`;

  openFileLabel(name: string): string {
    return $localize`:@@audit.questionnaire.openFile:Open ${name}:fileName:`;
  }

  get emptyStateTitle(): string {
    return this.isAuditor() && !this.readonlyQuestions
      ? $localize`:@@audit.questionnaire.noQuestionsAddedYet:No Questions Added Yet`
      : $localize`:@@audit.questionnaire.noQuestionsAdded:No Questions Added`;
  }

  get emptyStateDescription(): string {
    return this.isAuditor()
      ? $localize`:@@audit.questionnaire.noQuestionsRfi:No questions have been added to this RFI yet.`
      : $localize`:@@audit.questionnaire.auditorNoQuestionsRfi:The auditor has not added any questions to this RFI yet.`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialRows']) {
      const rows = (changes['initialRows'].currentValue ?? []) as Array<{
        question: string; answer?: string; dueDate?: string | null;
        questionDocs?: Array<{ name: string; url: string; description?: string }>;
        answerDocs?: Array<{ name: string; url: string; description?: string }>;
      }>;
      this._nextId = 1;
      this.rows = rows.map(r => ({
        id: this._nextId++,
        questionText: r.question,
        questionFiles: (r.questionDocs ?? []).map(d => ({
          name: d.name,
          objectUrl: d.url,
          iconClass: this.resolveFileIcon(d.name),
          description: d.description,
        })),
        answerText: r.answer ?? '',
        answerFiles: (r.answerDocs ?? []).map(d => ({
          name: d.name,
          objectUrl: d.url,
          iconClass: this.resolveFileIcon(d.name),
          description: d.description,
        })),
        dueDate: r.dueDate ? new Date(r.dueDate) : null,
      }));
    }
    if (changes['initialQuestions']) {
      const questions: string[] = changes['initialQuestions'].currentValue ?? [];
      this._nextId = 1;
      this.rows = questions.map(q => ({
        id: this._nextId++,
        questionText: q,
        questionFiles: [],
        answerText: '',
        answerFiles: [],
        dueDate: null,
      }));
      if (this.startWithEmptyRow && this.rows.length === 0) {
        this.addRow();
      }
    }
  }

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  // ── Table rows ────────────────────────────────────────────────────────────────
  rows: QuestionnaireRow[] = [];

  private _nextId = 1;

  // ── Minimum selectable date for the date-picker (today, time stripped) ────────
  today: Date = this.getToday();

  private getToday(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // ── Add a new empty row ───────────────────────────────────────────────────────
  addRow(): void {
    this.rows = [
      ...this.rows,
      {
        id: this._nextId++,
        questionText: '',
        questionFiles: [],
        answerText: '',
        answerFiles: [],
        dueDate: null,
      },
    ];
  }

  // ── Validate a due date set via the date-picker ───────────────────────────────
  onDueDateSelect(row: QuestionnaireRow): void {
    if (row.dueDate && row.dueDate < this.today) {
      row.dueDate = null;
      row.dueDateInvalid = true;
      this.messageService.add({
        severity: 'warn',
        summary: RFI_QUESTIONNAIRE_NOTICES.InvalidDueDateSummary,
        detail: RFI_QUESTIONNAIRE_NOTICES.InvalidDueDate,
        life: RFI_QUESTIONNAIRE_TOAST_LIFE.Short,
      });
    } else {
      row.dueDateInvalid = false;
    }
  }

  // ── Excel file upload handler ─────────────────────────────────────────────────
  onFileChange(event: any): void {
    const files = event.files as File[];
    if (!files || files.length !== 1) {
      this.messageService.add({
        severity: 'error',
        summary: RFI_QUESTIONNAIRE_NOTICES.UploadErrorSummary,
        detail: RFI_QUESTIONNAIRE_NOTICES.SelectOneExcelFile,
        life: RFI_QUESTIONNAIRE_TOAST_LIFE.Short,
      });
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.importFromExcel(this.data);
    };

    reader.readAsBinaryString(file);
  }

  isAuditor(): boolean {
    return this.currentUser === RfiViewerRoles.Auditor;
  }




  // ── Parse Excel rows → questionnaire table ────────────────────────────────────
  // Expected columns (case-insensitive): Scope | Sub Scope | Question | Answer
  // • Auditor → imports Question column only
  // • Client  → imports Answer column only
  // Rows whose Scope/Sub-Scope don't match the current inputs are skipped;
  // a warning toast shows only the excluded count (no detail text).
  private importFromExcel(data: AOA): void {
    console.log(data);
    if (data.length < 2) {
      this.messageService.add({
        severity: 'warn',
        summary: RFI_QUESTIONNAIRE_NOTICES.EmptyFileSummary,
        detail: RFI_QUESTIONNAIRE_NOTICES.NoDataRowsInExcel,
        life: RFI_QUESTIONNAIRE_TOAST_LIFE.Short,
      });
      return;
    }

    // ── Locate columns by header name ─────────────────────────────────────────
    const headers = (data[0] as any[]).map(h => String(h ?? '').toLowerCase().trim());

    // const scopeIdx    = headers.findIndex(h => h === 'scope');
    // const subScopeIdx = headers.findIndex(h =>
    //   ['sub scope', 'subscope', 'sub_scope', 'sub-scope'].includes(h)
    // );
    const questionIdx = headers.findIndex(h => h === RFI_QUESTIONNAIRE_EXCEL.QuestionHeader);
    const answerIdx = headers.findIndex(h => h === RFI_QUESTIONNAIRE_EXCEL.AnswerHeader);
    const dueDateIdx = headers.findIndex(h =>
      RFI_QUESTIONNAIRE_EXCEL.DueDateHeaders.includes(h)
    );

    // if (scopeIdx === -1 || subScopeIdx === -1) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Invalid Format',
    //     detail: 'Could not find "Scope" or "Sub Scope" columns in the Excel file.',
    //     life: 5000,
    //   });
    //   return;
    // }

    // ── Filter rows by scope / sub-scope match ────────────────────────────────
    const dataRows = data.slice(1).filter(
      row => Array.isArray(row) && row.some(c => c !== null && c !== undefined && c !== '')
    );

    // let mismatchCount  = 0;
    let pastDateCount = 0;
    const matchingRows: QuestionnaireRow[] = [];
    const today = this.today;

    for (const row of dataRows) {
      // const rowScope    = String(row[scopeIdx]    ?? '').trim();
      // const rowSubScope = String(row[subScopeIdx] ?? '').trim();

      // const scopeMatch    = rowScope.toLowerCase()    === this.scopeLabel.toLowerCase();
      // const subScopeMatch = rowSubScope.toLowerCase() === this.subScopeLabel.toLowerCase();

      // if (!scopeMatch || !subScopeMatch) {
      //   mismatchCount++;
      //   continue;
      // }

      const questionText = questionIdx !== -1 ? String(row[questionIdx] ?? '').trim() : '';
      const answerText = answerIdx !== -1 ? String(row[answerIdx] ?? '').trim() : '';

      // ── Parse & validate due date ───────────────────────────────────────────
      let dueDate: Date | null = null;
      if (dueDateIdx !== -1 && row[dueDateIdx] != null && row[dueDateIdx] !== '') {
        dueDate = this.parseExcelDate(row[dueDateIdx]);
        if (dueDate !== null && dueDate < today) {
          pastDateCount++;
          dueDate = null;   // reject past date; row still imports without a due date
        }
      }

      console.log(questionText, answerText, dueDate);

      matchingRows.push({
        id: this._nextId++,
        questionText,
        questionFiles: [],
        answerText,
        answerFiles: [],
        dueDate,
      });
    }

    // // ── Warn with excluded count only (no details, as requested) ─────────────
    // if (mismatchCount > 0) {
    //   this.messageService.add({
    //     severity: 'warn',
    //     summary: 'Scope Mismatch',
    //     detail: `${mismatchCount} row(s) excluded.`,
    //     life: 5000,
    //   });
    // }

    if (pastDateCount > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: RFI_QUESTIONNAIRE_NOTICES.PastDueDateRemovedSummary,
        detail: RFI_QUESTIONNAIRE_NOTICES.pastDueDatesCleared(pastDateCount),
        life: RFI_QUESTIONNAIRE_TOAST_LIFE.Long,
      });
    }

    if (matchingRows.length === 0) {
      // if (mismatchCount === 0) {
      this.messageService.add({
        severity: 'info',
        summary: RFI_QUESTIONNAIRE_NOTICES.NoDataSummary,
        detail: RFI_QUESTIONNAIRE_NOTICES.NoImportableRows,
        life: RFI_QUESTIONNAIRE_TOAST_LIFE.Short,
      });
      // }
      return;
    }

    // ── Merge into table (replace lone empty default row; otherwise append) ───
    const onlyDefaultEmpty =
      this.rows.length === 1 &&
      !this.rows[0].questionText &&
      !this.rows[0].answerText &&
      !this.rows[0].dueDate &&
      this.rows[0].questionFiles.length === 0 &&
      this.rows[0].answerFiles.length === 0;

    this.rows = onlyDefaultEmpty ? matchingRows : [...this.rows, ...matchingRows];

    this.messageService.add({
      severity: 'success',
      summary: RFI_QUESTIONNAIRE_NOTICES.ImportSuccessfulSummary,
      detail: RFI_QUESTIONNAIRE_NOTICES.rowsImported(matchingRows.length),
      life: RFI_QUESTIONNAIRE_TOAST_LIFE.Short,
    });
  }

  // ── Remove a row ──────────────────────────────────────────────────────────────
  removeRow(row: QuestionnaireRow): void {
    // console.log("rows:", this.rows);
    // return;
    row.questionFiles.forEach(f => URL.revokeObjectURL(f.objectUrl));
    row.answerFiles.forEach(f => URL.revokeObjectURL(f.objectUrl));
    this.rows = this.rows.filter(r => r.id !== row.id);
  }

  // ── Question file upload ──────────────────────────────────────────────────────
  onQuestionFileChange(event: Event, row: QuestionnaireRow): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    for (const file of Array.from(input.files)) {
      row.questionFiles = [
        ...row.questionFiles,
        this.buildAttachment(file),
      ];
    }
    input.value = '';
  }

  // ── Answer file upload ────────────────────────────────────────────────────────
  onAnswerFileChange(event: Event, row: QuestionnaireRow): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    for (const file of Array.from(input.files)) {
      row.answerFiles = [
        ...row.answerFiles,
        this.buildAttachment(file),
      ];
    }
    input.value = '';
  }

  // ── Open a file in a new tab ──────────────────────────────────────────────────
  openFile(attachment: RfiAttachment): void {
    window.open(attachment.objectUrl, '_blank');
  }

  // ── Remove question file ──────────────────────────────────────────────────────
  removeQuestionFile(row: QuestionnaireRow, index: number): void {
    URL.revokeObjectURL(row.questionFiles[index].objectUrl);
    row.questionFiles = row.questionFiles.filter((_, i) => i !== index);
  }

  // ── Remove answer file ────────────────────────────────────────────────────────
  removeAnswerFile(row: QuestionnaireRow, index: number): void {
    URL.revokeObjectURL(row.answerFiles[index].objectUrl);
    row.answerFiles = row.answerFiles.filter((_, i) => i !== index);
  }

  // ── Parse an Excel cell value into a JS Date ─────────────────────────────────
  // Handles: Date objects (cellDates:true), Excel serial numbers, and the
  // common string formats: DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, MM/DD/YYYY.
  private parseExcelDate(value: any): Date | null {
    if (!value) return null;

    // Already a native Date (xlsx cellDates:true on a proper date cell)
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    // Excel serial number (days since 1899-12-30)
    if (typeof value === 'number') {
      const ms = (value - 25569) * 86400 * 1000;
      const date = new Date(ms);
      return isNaN(date.getTime()) ? null : date;
    }

    // String formats ──────────────────────────────────────────────────────────
    if (typeof value === 'string' && value.trim()) {
      const s = value.trim();

      // DD-MM-YYYY  or  DD/MM/YYYY  (day unambiguously > 12 OR just assume DD first)
      const dmyMatch = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
      if (dmyMatch) {
        const day = +dmyMatch[1];
        const month = +dmyMatch[2];
        const year = +dmyMatch[3];
        // Validate ranges before constructing
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) return date;
        }
      }

      // YYYY-MM-DD  or  YYYY/MM/DD  (ISO-ish)
      const isoMatch = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
      if (isoMatch) {
        const year = +isoMatch[1];
        const month = +isoMatch[2];
        const day = +isoMatch[3];
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) return date;
        }
      }

      // Last-resort: native Date.parse (works for MM/DD/YYYY, long-form strings)
      const fallback = new Date(s);
      return isNaN(fallback.getTime()) ? null : fallback;
    }

    return null;
  }

  // ── Build attachment object ───────────────────────────────────────────────────
  private buildAttachment(file: File): RfiAttachment {
    return {
      name: file.name,
      file,
      objectUrl: URL.createObjectURL(file),
      iconClass: this.resolveFileIcon(file.name),
    };
  }

  // ── Resolve PrimeIcons class from file extension ──────────────────────────────
  resolveFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'pdf') return 'pi pi-file-pdf';
    if (['doc', 'docx'].includes(ext)) return 'pi pi-file-word';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'pi pi-file-excel';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'pi pi-image';
    if (['ppt', 'pptx'].includes(ext)) return 'pi pi-chart-bar';
    if (['zip', 'rar', '7z'].includes(ext)) return 'pi pi-box';
    return 'pi pi-file';
  }

  // ── Export questionnaire to Excel ────────────────────────────────────────────
  exportToExcel(): void {
    const EXCEL_TYPE = RFI_QUESTIONNAIRE_EXCEL.MimeType;
    const cols = RFI_QUESTIONNAIRE_EXCEL.ExportColumns;
    const data = this.rows.map((row, idx) => {
      const entry: Record<string, any> = {
        [cols.Index]: idx + 1,
        [cols.Question]: row.questionText,
        [cols.Answer]: row.answerText,
        [cols.DueDate]: row.dueDate
          ? `${String(row.dueDate.getDate()).padStart(2, '0')}/${String(row.dueDate.getMonth() + 1).padStart(2, '0')}/${row.dueDate.getFullYear()}`
          : '',
      };
      return entry;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = {
      Sheets: { [RFI_QUESTIONNAIRE_EXCEL.SheetName]: ws },
      SheetNames: [RFI_QUESTIONNAIRE_EXCEL.SheetName],
    };
    const buffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: EXCEL_TYPE });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${RFI_QUESTIONNAIRE_EXCEL.ExportFilePrefix}${Date.now()}${RFI_QUESTIONNAIRE_EXCEL.ExportFileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  // ── Client: handle answer-import file selection ───────────────────────────────
  onClientAnswerImport(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const wb: XLSX.WorkBook = XLSX.read(new Uint8Array(e.target.result), { type: 'array', cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.importAnswersOnly(data);
    };
    reader.readAsArrayBuffer(file);
    input.value = '';
  }

  // ── Client: update only answerText per row index — preserves all other fields ─
  private importAnswersOnly(data: AOA): void {
    if (data.length < 2) { // sheet should have atleast 2 rows ie the header and 1 actual data 
      this.messageService.add({
        severity: 'warn',
        summary: RFI_QUESTIONNAIRE_NOTICES.EmptyFileSummary,
        detail: RFI_QUESTIONNAIRE_NOTICES.NoDataRowsInFile,
        life: RFI_QUESTIONNAIRE_TOAST_LIFE.Short,
      });
      return;
    }

    const headers = (data[0] as any[]).map(h => String(h ?? '').toLowerCase().trim());
    const answerIdx = headers.findIndex(h => h === RFI_QUESTIONNAIRE_EXCEL.AnswerHeader);

    if (answerIdx === -1) {
      this.messageService.add({
        severity: 'error',
        summary: RFI_QUESTIONNAIRE_NOTICES.InvalidFormatSummary,
        detail: RFI_QUESTIONNAIRE_NOTICES.AnswersColumnMissing,
        life: RFI_QUESTIONNAIRE_TOAST_LIFE.Long,
      });
      return;
    }

    const dataRows = (data.slice(1) as any[][]).filter(
      row => Array.isArray(row) && row.some(c => c !== null && c !== undefined && c !== '')
    );

    let updatedCount = 0;
    const limit = Math.min(dataRows.length, this.rows.length);
    for (let i = 0; i < limit; i++) {
      const answerText = String(dataRows[i][answerIdx] ?? '').trim();
      if (answerText) {
        this.rows[i] = { ...this.rows[i], answerText };
        updatedCount++;
      }
    }

    if (updatedCount === 0) {
      this.messageService.add({
        severity: 'info',
        summary: RFI_QUESTIONNAIRE_NOTICES.NoAnswersFoundSummary,
        detail: RFI_QUESTIONNAIRE_NOTICES.NoAnswersFound,
        life: RFI_QUESTIONNAIRE_TOAST_LIFE.Short,
      });
      return;
    }

    this.rows = [...this.rows];
    this.messageService.add({
      severity: 'success',
      summary: RFI_QUESTIONNAIRE_NOTICES.AnswersImportedSummary,
      detail: RFI_QUESTIONNAIRE_NOTICES.answersImported(updatedCount),
      life: RFI_QUESTIONNAIRE_TOAST_LIFE.Short,
    });
  }

  // ── Lifecycle cleanup ─────────────────────────────────────────────────────────
  ngOnDestroy(): void {
    this.rows.forEach(row => {
      row.questionFiles.forEach(f => URL.revokeObjectURL(f.objectUrl));
      row.answerFiles.forEach(f => URL.revokeObjectURL(f.objectUrl));
    });
  }
}
