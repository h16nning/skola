import { NoteType } from "@/logic/note/note";
import { Card } from "../../logic/card/card";

interface CardHistoryProps {
  card?: Card<NoteType>;
}

export default function CardHistory({}: CardHistoryProps) {
  return (
    <p>
      Not available at the moment. See <a href="/stats">Statistics</a>
    </p>
  );
}
