export type Repetition = {
  date: Date;
  result: number;
};

export function newRepetition(result: number) {
  return { date: new Date(Date.now()), result: result };
}
