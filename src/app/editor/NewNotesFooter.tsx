import { Button, Kbd, Tooltip } from "@mantine/core";
import { useHotkeys, useOs } from "@mantine/hooks";
import { IconHistory } from "@tabler/icons-react";
import { t } from "i18next";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Deck } from "../../logic/deck/deck";
import classes from "./NewNotesView.module.css";
import NoteSubmitButton from "./NoteSubmitButton";

interface NewNotesFooterProps {
  setRequestedFinish: (finish: boolean) => void;
  deck: Deck | undefined;
}

export default function NewNotesFooter({
  setRequestedFinish,
  deck,
}: NewNotesFooterProps) {
  const navigate = useNavigate();
  const os = useOs();

  const showHistory = useCallback(() => {
    navigate("/notes" + (deck ? `/${deck.id}` : ""), {
      state: { sortFunction: "byCreationDate", sortDirection: false },
    });
  }, [deck, navigate]);

  useHotkeys([["Mod+Shift+H", showHistory]]);

  return (
    <div className={classes.newNotesFooter}>
      <Tooltip
        label={
          <>
            {t("note.edit.see-history-tooltip")}{" "}
            <Kbd>{os === "macos" ? "Cmd" : "Ctrl"}+Shift+H</Kbd>
          </>
        }
      >
        <Button
          leftSection={<IconHistory />}
          variant="default"
          onClick={showHistory}
          tabIndex={-1}
        >
          {t("note.edit.see-history-button")}
        </Button>
      </Tooltip>
      <NoteSubmitButton finish={() => setRequestedFinish(true)} mode="new" />
    </div>
  );
}
