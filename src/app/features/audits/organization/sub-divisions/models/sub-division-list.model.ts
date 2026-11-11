import type { StaticSubDivision } from './sub-division-static-data.model';

export interface EnrichedSubDivision extends StaticSubDivision {
  divisionCode: string;
  divisionName: string;
}
