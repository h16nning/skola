import { Button } from "@mantine/core";
import { Deck } from "../../logic/deck";
import classes from "./NewNotesView.module.css";
import NoteSubmitButton from "./NoteSubmitButton";
import { useNavigate } from "react-router-dom";

interface NewNotesFooterProps {
  setRequestedFinish: (finish: boolean) => void;
  deck: Deck | undefined;
}

export default function NewNotesFooter({
  setRequestedFinish,
  deck,
}: NewNotesFooterProps) {
  const navigate = useNavigate();
  return (
    <div className={classes.newNotesFooter}>
      <Button
        leftSection="🔍"
        variant="default"
        onClick={() =>
          navigate("/notes" + (deck ? `/${deck.id}` : ""), {
            state: { sortFunction: "byCreationDate", sortDirection: false },
          })
        }
      >
        See History
      </Button>
      <NoteSubmitButton finish={() => setRequestedFinish(true)} mode="new" />
    </div>
  );
}
