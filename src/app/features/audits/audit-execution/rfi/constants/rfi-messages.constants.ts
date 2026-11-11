/* ── User-facing text for the RFI module ──────────────────────────────── */

export const RFI_INVALID_FIELD_MESSAGE = 'Invalid field.';

/** Validation messages for the Add RFI form, keyed by control → error key. */
export const RFI_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  company: { required: 'Company / organization is required.' },
  division: { required: 'Division is required.' },
  subDivision: { required: 'Sub-division is required — this division has sub-divisions.' },
  auditScope: { required: 'Audit scope is required.' },
  subScope: { required: 'Sub scope is required.' },
  title: {
    required: 'Title is required.',
    minlength: 'Title must be at least 10 characters.',
    maxlength: 'Title cannot exceed 500 characters.',
  },
  description: {
    required: 'Description is required.',
    minlength: 'Description must be at least 10 characters.',
    maxlength: 'Description cannot exceed 500 characters.',
  },
  dueDate: {
    required: 'Due date is required.',
    dueDateInvalid: 'Due date cannot be earlier than today.',
  },
  owner: { required: 'Owner is required.' },
  documents: { required: 'Please upload at least one document.' },
};

/* ── Toasts ───────────────────────────────────────────────────────────── */

export const RFI_TOAST_MESSAGES = {
  Added: 'New RFI has been added successfully.',
  Accepted: 'The client response has been accepted successfully.',
  AcceptedTitle: 'RFI Approved',
  rejected: (reason: string) => `RFI response rejected. Reason: ${reason}`,
  RejectedTitle: 'RFI Rejected',
  FeatureUnderDevelopment: 'This Feature is under development',
} as const;

/** In-drawer p-toast messages (MessageService) on the Add RFI form. */
export const RFI_FORM_NOTICES = {
  InvalidFileTypeSummary: 'Invalid File Type',
  invalidFileType: (fileName: string) => `${fileName} is not a supported file type.`,
  FileTooLargeSummary: 'File Too Large',
  fileTooLarge: (fileName: string, maxMb: number) => `${fileName} exceeds the ${maxMb} MB limit.`,
  RfiRequiredSummary: 'RFI Required',
  RfiRequired: 'Please select an RFI template from the library.',
  ValidationSummary: 'Validation Error',
  FixBeforeProceeding: 'Please fix all highlighted fields before proceeding.',
  MissingDueDateSummary: 'Missing Due Date',
  missingDueDates: (count: number) => `${count} question(s) are missing a due date. Please add due dates before submitting.`,
  DueDateConflictSummary: 'Due Date Conflict',
  DueDateConflict: 'Question due dates cannot be later than the RFI due date.',
} as const;

/** In-drawer p-toast messages on the View RFI drawer. */
export const RFI_PROFILE_NOTICES = {
  ReasonRequiredSummary: 'Reason Required',
  ReasonRequired: 'Please provide a reason for rejection before submitting.',
} as const;

/** p-toast messages on the questionnaire (com/questionare-section). */
export const RFI_QUESTIONNAIRE_NOTICES = {
  InvalidDueDateSummary: 'Invalid Due Date',
  InvalidDueDate: 'Due date cannot be in the past. Please select a future date.',
  UploadErrorSummary: 'Upload Error',
  SelectOneExcelFile: 'Please select exactly one Excel file.',
  EmptyFileSummary: 'Empty File',
  NoDataRowsInExcel: 'The uploaded Excel file has no data rows.',
  NoDataRowsInFile: 'No data rows found in the file.',
  PastDueDateRemovedSummary: 'Past Due Date Removed',
  pastDueDatesCleared: (count: number) => `${count} row(s) had a due date in the past and were cleared.`,
  NoDataSummary: 'No Data',
  NoImportableRows: 'No importable rows found in the file.',
  ImportSuccessfulSummary: 'Import Successful',
  rowsImported: (count: number) => `${count} row(s) imported.`,
  InvalidFormatSummary: 'Invalid Format',
  AnswersColumnMissing: 'Column "Answers" not found. Please use the exported template.',
  NoAnswersFoundSummary: 'No Answers Found',
  NoAnswersFound: 'No answer data found in the Answers column.',
  AnswersImportedSummary: 'Answers Imported',
  answersImported: (count: number) => `${count} answer(s) imported successfully.`,
} as const;

/* ── Dialogs ──────────────────────────────────────────────────────────── */

export const RFI_CONFIRM_DIALOGS = {
  NoQuestionnaire: {
    title: 'No Questionnaire',
    message: 'No questions have been added to the questionnaire. Would you like to proceed and submit the RFI without a questionnaire?',
    confirmLabel: 'Yes, Proceed',
    cancelLabel: 'Cancel',
  },
  Accept: {
    title: 'Accept RFI Response',
    message: 'Are you sure you want to accept this client response? This action will mark the RFI as completed.',
    confirmLabel: 'Yes, Accept',
    cancelLabel: 'Cancel',
  },
  Reject: {
    title: 'Reject RFI Response',
    message: (reason: string) => `You are about to reject this RFI response. Reason: "${reason}". This action cannot be undone.`,
    confirmLabel: 'Yes, Reject',
    cancelLabel: 'Cancel',
  },
} as const;

/* ── Reference documents ──────────────────────────────────────────────── */


/* ── Listing text ─────────────────────────────────────────────────────── */

/** Filter chip prefixes on the listing popover. */
