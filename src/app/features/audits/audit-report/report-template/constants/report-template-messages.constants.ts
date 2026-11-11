/* ── User-facing text for the report template module ──────────────────── */

/** Inline errors on the Add/Edit dialog's file picker and upload. */
export const REPORT_TEMPLATE_FILE_ERRORS = {
  InUse: $localize`:@@audit.reportTemplate.fileInUseError:This template is currently in use and its file cannot be replaced.`,
  DocxOnly: $localize`:@@audit.reportTemplate.docxOnlyError:Only .docx files are supported.`,
  FileRequired: $localize`:@@audit.reportTemplate.fileRequiredError:Please select a .docx file to upload.`,
} as const;

export const REPORT_TEMPLATE_UPLOAD_ERRORS = {
  UnexpectedResponse: $localize`:@@audit.reportTemplate.unexpectedResponse:Unexpected response from server.`,
  UploadFailed: $localize`:@@audit.reportTemplate.uploadFailed:Failed to upload template. Please try again.`,
} as const;
