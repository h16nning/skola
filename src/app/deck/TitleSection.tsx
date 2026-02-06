import { genericFail } from "@/components/Notification/Notification";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { TextInput } from "@/components/ui/TextInput";
import { Tooltip } from "@/components/ui/Tooltip";
import { getHotkeyHandler } from "@/lib/hooks/getHotkeyHandler";
import { renameDeck } from "@/logic/deck/renameDeck";
import { IconPlus } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Deck } from "../../logic/deck/deck";
import "./TitleSection.css";

const BASE_URL = "title-section";

type TitleSectionProps = {
  deck: Deck | undefined;
};

export default function TitleSection({ deck }: TitleSectionProps) {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState<string>("");

  useEffect(() => {
    if (deck) setNewTitle(deck?.name);
  }, [deck]);

  useEffect(() => {
    if (!isEditingTitle && newTitle !== "" && deck) {
      renameDeck(deck.id, newTitle).catch(() => {
        genericFail();
      });
    }
  }, [isEditingTitle]);

  return (
    <div className={BASE_URL}>
      {!isEditingTitle ? (
        <h3
          className={`${BASE_URL}__title`}
          onDoubleClick={() => setIsEditingTitle(true)}
        >
          {deck?.name}
        </h3>
      ) : (
        <TextInput
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([
            ["Enter", () => setIsEditingTitle(false)],
            [
              "Escape",
              () => {
                setNewTitle(deck?.name || "");
                setIsEditingTitle(false);
              },
            ],
          ])}
          onBlur={() => setIsEditingTitle(false)}
          autoFocus
          className={`${BASE_URL}__input`}
        />
      )}
      <Tooltip
        label={
          <>
            {t("deck.add-cards-tooltip")}
            <Kbd>n</Kbd>
          </>
        }
      >
        <Button
          leftSection={<IconPlus />}
          variant="default"
          onClick={() => navigate("/new/" + deck?.id)}
          className={`${BASE_URL}__button`}
        >
          {t("deck.add-cards")}
        </Button>
      </Tooltip>
    </div>
  );
}
