import { useEffect, useState } from "react";
import { Deck } from "../deck";
import { getSubDecks } from "../getSubDecks";

export function useSubDecks(deck?: Deck): [Deck[] | undefined, boolean] {
  const [result, setResult] = useState<[Deck[] | undefined, boolean]>([
    undefined,
    false,
  ]);

  useEffect(() => {
    setResult([undefined, false]);
    void getSubDecks(deck).then((result) => setResult(result));
  }, [deck]);

  return result;
}
