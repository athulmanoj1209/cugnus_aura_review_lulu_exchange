import type { RfiClientHeadKind } from '../constants/rfi-client.constants';

/** Which head the client page is simulating — a whole division or a single sub-division. */
export interface SimulatedHead {
  kind: RfiClientHeadKind;
  name: string;
}
