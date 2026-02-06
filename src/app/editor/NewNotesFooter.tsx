import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { Tooltip } from "@/components/ui/Tooltip";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useOs } from "@/lib/hooks/useOs";
import { Deck } from "@/logic/deck/deck";
import { IconHistory } from "@tabler/icons-react";
import { t } from "i18next";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="new-notes-view__footer">
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
