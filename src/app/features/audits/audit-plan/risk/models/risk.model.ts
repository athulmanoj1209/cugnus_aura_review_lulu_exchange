/* ── Shared Risk types — import from here in ALL risk components ── */

import {
  RiskControlEffectiveness,
  RiskResidualLevels,
  RiskStatuses,
  RiskTypes,
  RISK_EFFECTIVENESS_ADJUSTMENT,
  RISK_LEVEL_THRESHOLDS,
  RISK_MIN_RESIDUAL_SCORE,
} from '../constants/risk.constants';

export type RiskType = typeof RiskTypes[keyof typeof RiskTypes];

export type ControlEffectiveness = typeof RiskControlEffectiveness[keyof typeof RiskControlEffectiveness];
export type RiskStatus = typeof RiskStatuses[keyof typeof RiskStatuses];
export type ResidualLevel = typeof RiskResidualLevels[keyof typeof RiskResidualLevels];

export interface RiskFile {
  name: string;
  size: number;
  url?: string;
  file?: File;
}

export interface Risk {
  id: string;
  riskType: RiskType;
  title: string;
  description: string;
  company: string;
  division: string;
  subDivision: string;
  impact: number;
  likelihood: number;
  inherentScore: number;
  keyControls?: string;
  controlEffectiveness: ControlEffectiveness;
  residualScore: number;
  residualLevel: ResidualLevel;
  owner: string;
  dateIdentified: Date;
  lastUpdated: Date;
  status: RiskStatus;
  linkedScopes: string[];
  linkedFindings: string[];
  linkedObservations: string[];
  supportingFiles: RiskFile[];
}

/* ── Shared calculation helpers ── */

export function calcInherent(impact: number, likelihood: number): number {
  return impact * likelihood;
}

export function calcResidualScore(inherent: number, ce: ControlEffectiveness): number {
  return Math.max(RISK_MIN_RESIDUAL_SCORE, inherent - RISK_EFFECTIVENESS_ADJUSTMENT[ce]);
}

export function calcResidualLevel(score: number): ResidualLevel {
  if (score <= RISK_LEVEL_THRESHOLDS.LowMax)    return RiskResidualLevels.Low;
  if (score <= RISK_LEVEL_THRESHOLDS.MediumMax) return RiskResidualLevels.Medium;
  return RiskResidualLevels.High;
}
