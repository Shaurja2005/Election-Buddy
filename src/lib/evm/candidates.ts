/**
 * Invented parties and candidates. This is a civic tutorial, not a mock
 * election: no real party name, symbol or candidate appears here, because
 * neutrality is a product principle and a realistic ballot would read as
 * endorsement.
 */
export interface MockCandidate {
  id: string;
  serial: number;
  nameKey: string;
  partyKey: string;
  /** Key into the authored symbol set. */
  symbol: "leaf" | "river" | "sun" | "hill";
}

export const MOCK_CANDIDATES: MockCandidate[] = [
  { id: "a", serial: 1, nameKey: "evm.candidate.a", partyKey: "evm.party.a", symbol: "leaf" },
  { id: "b", serial: 2, nameKey: "evm.candidate.b", partyKey: "evm.party.b", symbol: "river" },
  { id: "c", serial: 3, nameKey: "evm.candidate.c", partyKey: "evm.party.c", symbol: "sun" },
  { id: "d", serial: 4, nameKey: "evm.candidate.d", partyKey: "evm.party.d", symbol: "hill" },
];

export const NOTA_SERIAL = MOCK_CANDIDATES.length + 1;
