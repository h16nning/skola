import { Button, Group, Kbd, TextInput, Title, Tooltip } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Deck, renameDeck } from "../../logic/deck";
import { generalFail } from "../custom/Notification/Notification";

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
        generalFail();
      });
    }
  }, [isEditingTitle]);

  return (
    <Group justify="space-between" align="center" w="100%">
      {!isEditingTitle ? (
        <Title
          order={3}
          lineClamp={1}
          onDoubleClick={() => setIsEditingTitle(true)}
        >
          {deck?.name}
        </Title>
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
        >
          {t("deck.add-cards")}
        </Button>
      </Tooltip>
    </Group>
  );
}
