export type Repetition = {
  date: Date;
  result: number;
};

export function newRepetition(result: number) {
  return { date: Date.now(), result: result };
}
