import { useEffect, useState } from "react";
import { Deck } from "../deck";
import { getSuperDecks } from "../getSuperDecks";

export function useSuperDecks(deck?: Deck): [Deck[] | undefined, boolean] {
  const [result, setResult] = useState<[Deck[] | undefined, boolean]>([
    undefined,
    false,
  ]);

  useEffect(() => {
    setResult([undefined, false]);
    void getSuperDecks(deck).then((result) => setResult(result));
  }, [deck]);

  return result;
}
