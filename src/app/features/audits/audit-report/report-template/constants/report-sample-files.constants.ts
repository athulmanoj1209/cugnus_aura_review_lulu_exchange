import {
  CLIENT_MODE_VALUE,
  INTERNAL_AUDIT_CLIENT_KEY_VALUE,
  type InternalAuditClientKey,
} from '@/app/core/config/client-mode';

/**
 * Placeholder report/template .docx files served from public/assets until the
 * backend serves files per-report/per-template. Which client's pair is used
 * follows CLIENT_MODE_VALUE / INTERNAL_AUDIT_CLIENT_KEY_VALUE:
 *  - audit-firm                     → dar-exchange
 *  - internal-audit dar-exchange    → dar-exchange
 *  - internal-audit xyz-broadcast   → dar-exchange
 *  - internal-audit lulu-exchange   → lulu-international-exchange
 */
interface ReportSampleFiles {
  folder: string;
  reportFileName: string;
  templateFileName: string;
}

const ORG_STATIC_DATA_BASE_PATH = 'assets/data/org-static-data';

const DAR_EXCHANGE_SAMPLE_FILES: ReportSampleFiles = {
  folder: 'dar-exchange',
  reportFileName: 'ABC Broadcast - IA  Draft H1_2025 1.0-Report.docx',
  templateFileName: 'ABC Broadcast - IA  Draft H1_2025 1.0-Template.docx',
};

const LULU_EXCHANGE_SAMPLE_FILES: ReportSampleFiles = {
  folder: 'lulu-international-exchange',
  reportFileName: 'Lulu International Exchange - IA  Draft H1_2025 1.0-Report.docx',
  templateFileName: 'Lulu International Exchange - IA  Draft H1_2025 1.0-Template.docx',
};

const REPORT_SAMPLE_FILES_BY_CLIENT: Record<InternalAuditClientKey, ReportSampleFiles> = {
  'dar-exchange': DAR_EXCHANGE_SAMPLE_FILES,
  'xyz-broadcast': DAR_EXCHANGE_SAMPLE_FILES,
  'lulu-exchange': LULU_EXCHANGE_SAMPLE_FILES,
};

const ACTIVE_REPORT_SAMPLE_FILES: ReportSampleFiles =
  CLIENT_MODE_VALUE === 'internal-audit'
    ? REPORT_SAMPLE_FILES_BY_CLIENT[INTERNAL_AUDIT_CLIENT_KEY_VALUE]
    : DAR_EXCHANGE_SAMPLE_FILES;

const sampleFileUrl = (fileName: string): string =>
  `${ORG_STATIC_DATA_BASE_PATH}/${ACTIVE_REPORT_SAMPLE_FILES.folder}/${encodeURIComponent(fileName)}`;

/** Sample generated report for the active client. */
export const REPORT_SAMPLE_REPORT_FILE_URL = sampleFileUrl(ACTIVE_REPORT_SAMPLE_FILES.reportFileName);

/** Sample report template for the active client. */
export const REPORT_SAMPLE_TEMPLATE_FILE_URL = sampleFileUrl(ACTIVE_REPORT_SAMPLE_FILES.templateFileName);
