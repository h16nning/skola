import classes from "./NewNotesView.module.css";
import NoteSubmitButton from "./NoteSubmitButton";

interface NewNotesFooterProps {
  setRequestedFinish: (finish: boolean) => void;
}

export default function NewNotesFooter({
  setRequestedFinish,
}: NewNotesFooterProps) {
  return (
    <div className={classes.newNotesFooter}>
      <NoteSubmitButton finish={() => setRequestedFinish(true)} mode="new" />
    </div>
  );
}
