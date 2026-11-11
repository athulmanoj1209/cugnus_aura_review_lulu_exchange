export interface HourlyRateItem {
  id: number;
  rate: number;
  createdOn: string;
  status: 'active' | 'inactive';
}
