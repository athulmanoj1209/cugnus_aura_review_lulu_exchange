/** Non-translated labels and option metadata for the audit-frequency lookup module. */
export const AUDITFREQUENCY_SORT_OPTIONS = [
  { label: 'Name (A–Z)', value: 'name_asc' },
  { label: 'Name (Z–A)', value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc' },
];

export const AUDITFREQUENCY_SORT_ICONS = {
  Unsorted: 'pi-sort-alt',
  Asc: 'pi-sort-amount-up-alt',
  Desc: 'pi-sort-amount-down-alt',
} as const;
