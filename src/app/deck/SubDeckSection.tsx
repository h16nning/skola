import { Button } from "@/components/ui";
import { useSubDecks } from "@/logic/deck/hooks/useSubDecks";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Deck } from "../../logic/deck/deck";
import DeckTable from "./DeckTable";
import NewDeckModal from "./NewDeckModal";

interface SubDeckSectionProps {
  deck?: Deck;
}

function SubDeckSection({ deck }: SubDeckSectionProps) {
  const [subDecks, areSubDecksReady] = useSubDecks(deck);
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const [t] = useTranslation();
  function NewSubDeckButton() {
    return (
      <Button
        disabled={!deck || !areSubDecksReady || !subDecks}
        variant="default"
        leftSection={<IconPlus />}
        style={{ alignSelf: "end" }}
        onClick={() => {
          if (deck) {
            setNewDeckModalOpened(true);
          }
        }}
      >
        {t("deck.subdeck.add-subdeck-button")}
      </Button>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-lg)",
          alignItems: "center",
          width: "100%",
        }}
      >
        <NewSubDeckButton />
        {areSubDecksReady &&
          (subDecks ? (
            <DeckTable deckList={subDecks} isReady={true} />
          ) : (
            <span>{t("deck.subdeck.load-fail")}</span>
          ))}
      </div>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
        superDeck={deck}
      />
    </>
  );
}

export default SubDeckSection;
