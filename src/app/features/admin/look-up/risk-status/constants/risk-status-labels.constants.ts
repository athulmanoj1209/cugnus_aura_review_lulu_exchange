/** Non-translated labels and option metadata for the risk-status lookup module. */
export const RISKSTATUS_SORT_OPTIONS = [
  { label: 'Name (A–Z)', value: 'name_asc' },
  { label: 'Name (Z–A)', value: 'name_desc' },
  { label: 'Newest First', value: 'date_desc' },
  { label: 'Oldest First', value: 'date_asc' },
];

export const RISKSTATUS_SORT_ICONS = {
  Unsorted: 'pi-sort-alt',
  Asc: 'pi-sort-amount-up-alt',
  Desc: 'pi-sort-amount-down-alt',
} as const;
