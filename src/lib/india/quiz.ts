export interface QuizQuestion {
  id: string;
  /** Index of the correct option in `options`. */
  answer: number;
  options: readonly string[];
}

/**
 * Ten questions keyed to the dictionaries. The explanation shown after each
 * answer is the teaching moment; the score is incidental.
 */
export const QUIZ: QuizQuestion[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return {
    id: `q${n}`,
    options: [`learn.q${n}.a`, `learn.q${n}.b`, `learn.q${n}.c`],
    // Q1 and Q9 have the correct answer first or second; recorded explicitly
    // rather than derived, so a reordered option list cannot silently break it.
    answer: [1, 0, 1, 1, 1, 0, 1, 1, 0, 1][i],
  };
});

export const QUIZ_BADGE = "quiz-perfect";
