/**
 * National Lok Sabha voter turnout, as published by the Election Commission
 * of India. National figures only: state-level series are not committed here
 * because a plausible-looking wrong number is worse than an absent one.
 */
export interface TurnoutYear {
  year: number;
  /** Percentage of registered electors who voted. */
  turnout: number;
}

export const LOK_SABHA_TURNOUT: TurnoutYear[] = [
  { year: 1989, turnout: 61.95 },
  { year: 1991, turnout: 56.93 },
  { year: 1996, turnout: 57.94 },
  { year: 1998, turnout: 61.97 },
  { year: 1999, turnout: 59.99 },
  { year: 2004, turnout: 58.07 },
  { year: 2009, turnout: 58.21 },
  { year: 2014, turnout: 66.44 },
  { year: 2019, turnout: 67.40 },
  { year: 2024, turnout: 65.79 },
];

export const TURNOUT_SOURCE = "Election Commission of India";
export const TURNOUT_SOURCE_URL = "https://www.eci.gov.in";
