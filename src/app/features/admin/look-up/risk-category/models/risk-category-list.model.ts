export interface RiskCategoryItem {
  id: number;
  name: string;
  description: string;
  createdOn: string;
  status: 'active' | 'inactive';
}
