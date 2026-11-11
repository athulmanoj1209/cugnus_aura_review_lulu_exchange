import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import * as XLSX from 'xlsx';

export interface FindingImportResult { file: File; rows: Record<string, unknown>[]; }

@Component({
  selector: 'app-finding-import',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './finding-import.component.html',
  styleUrl: './finding-import.component.scss',
})
export class FindingImportComponent {
  @Output() readonly imported = new EventEmitter<FindingImportResult>();
  readonly visible = signal(false);
  readonly file = signal<File | null>(null);
  readonly error = signal('');
  readonly previewRows = signal<Record<string, unknown>[]>([]);
  readonly rowErrors = signal<string[]>([]);
  readonly resultMessage = signal('');
  readonly headers = ['Finding Title*', 'Finding Type*', 'Company*', 'Division*', 'Sub-Division*', 'Scope*', 'Sub-Scope', 'Audit Plan*', 'Description*'];
  private readonly requiredHeaders = this.headers.filter(header => header.endsWith('*'));

  private normalizeHeader(value: unknown): string {
    return String(value ?? '')
      .replace(/\*/g, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  open(): void { this.error.set(''); this.resultMessage.set(''); this.file.set(null); this.previewRows.set([]); this.rowErrors.set([]); this.visible.set(true); }
  close(): void { this.visible.set(false); }

  downloadTemplate(): void {
    const sheet = XLSX.utils.aoa_to_sheet([this.headers]);
    sheet['!cols'] = this.headers.map(h => ({ wch: Math.max(18, h.length + 2) }));
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Findings');
    XLSX.writeFile(book, 'findings-import-template.xlsx');
  }

  select(event: Event): void { this.setFile((event.target as HTMLInputElement).files?.[0] ?? null); }
  drop(event: DragEvent): void { event.preventDefault(); this.setFile(event.dataTransfer?.files?.[0] ?? null); }

  upload(): void {
    const file = this.file();
    if (!file) return;
    if (this.rowErrors().length) { this.error.set('Fix the validation errors before uploading.'); return; }
    this.imported.emit({ file, rows: this.previewRows() });
    this.resultMessage.set(`${this.previewRows().length} finding(s) are ready to import.`);
  }

  private read(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const workbook = XLSX.read(reader.result, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const actual = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
        const sourceHeaders = (actual[0] ?? []) as unknown[];
        const sourceKeys = sourceHeaders.map(value => this.normalizeHeader(value));
        const missing = this.requiredHeaders.filter(header => !sourceKeys.includes(this.normalizeHeader(header)));
        const errors = missing.length ? [`Missing required columns: ${missing.join(', ')}`] : [];
        const rawRows = actual.slice(1) as unknown[][];
        const rows = rawRows.map(values => Object.fromEntries(
          this.headers.map(header => {
            const index = sourceKeys.indexOf(this.normalizeHeader(header));
            return [header, index >= 0 ? String(values[index] ?? '').trim() : ''];
          }),
        ));
        rows.forEach((row, index) => {
          const missingValues = this.requiredHeaders.filter(header => !String(row[header] ?? '').trim());
          if (missingValues.length) errors.push(`Row ${index + 2}: missing ${missingValues.join(', ')}`);
        });
        this.previewRows.set(rows);
        this.rowErrors.set(errors);
        this.error.set(errors.length ? 'Validation errors found in the uploaded file.' : '');
      } catch { this.error.set('Unable to read this Excel file.'); }
    };
    reader.readAsArrayBuffer(file);
  }

  private setFile(file: File | null): void {
    this.error.set('');
    if (!file || !/\.(xlsx|xls|csv)$/i.test(file.name)) { this.error.set('Please choose an Excel or CSV file.'); return; }
    if (file.size > 10 * 1024 * 1024) { this.error.set('The file must be 10 MB or smaller.'); return; }
    this.file.set(file);
    this.read(file);
  }
}
