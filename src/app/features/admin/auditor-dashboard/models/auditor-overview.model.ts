export interface KpiCard {
  label: string;
  value: string;
  icon: string;
  cardClass: string;
  /** Optional action key — cards with an action are rendered as clickable. */
  action?: string;
}
