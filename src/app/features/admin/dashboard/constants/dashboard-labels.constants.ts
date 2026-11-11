/** Non-translated dashboard labels, colors, and display maps. */
export const DASHBOARD_RISK_COLORS = {
  Critical: '#dc2626',
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#22c55e',
} as const;

export const DASHBOARD_RFI_STATUS_COLORS = {
  pending: '#3b82f6',
  overdue: '#ef4444',
  'under-review': '#64748b',
  completed: '#22c55e',
  reopened: '#dc2626',
} as const;

export const DASHBOARD_THEME_FALLBACK_COLORS = {
  SurfaceCard: '#ffffff',
  SurfaceBorder: '#e2e8f0',
  Text: '#0f172a',
  TextSecondary: '#64748b',
  Empty: '#94a3b8',
} as const;
