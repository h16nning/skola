import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";
import { useCardsOf } from "@/logic/card/hooks/useCardsOf";
import { useStatesOf } from "@/logic/card/hooks/useStatesOf";
import { useSubDecks } from "@/logic/deck/hooks/useSubDecks";
import { useSuperDecks } from "@/logic/deck/hooks/useSuperDecks";
import { State } from "fsrs.js";
import { Deck } from "../../logic/deck/deck";
import "./DebugDeckModal.css";

const BASE = "debug-deck-modal";

interface DebugDeckModalProps {
  opened: boolean;
  setOpened: (value: boolean) => void;
  deck?: Deck;
}

function DebugDeckModal({ opened, setOpened, deck }: DebugDeckModalProps) {
  const [cards] = useCardsOf(deck);
  const states = useStatesOf(cards ?? []);
  const [superDecks] = useSuperDecks(deck);
  const [subDecks] = useSubDecks(deck);

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Debug">
      <div className={BASE}>
        {deck ? (
          <table className={`${BASE}__table`}>
            <tbody>
              <tr>
                <th>Name:</th>
                <td>{deck.name}</td>
              </tr>
              <tr>
                <th>ID:</th>
                <td>{deck.id}</td>
              </tr>
              <tr>
                <th>SubDecks:</th>
                <td>
                  {subDecks?.map((s, index) => (
                    <span key={s.id}>
                      <a href={"/deck/" + s.id} className={`${BASE}__link`}>
                        {s.name}
                      </a>
                      {index < subDecks.length - 1 && ", "}
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <th>SuperDecks:</th>
                <td>
                  {superDecks?.map((s, index) => (
                    <span key={s.id}>
                      <a href={"/deck/" + s.id} className={`${BASE}__link`}>
                        {s.name}
                      </a>
                      {index < superDecks.length - 1 && ", "}
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <th>Cards:</th>
                <td className={`${BASE}__ids`}>{deck.cards.join(", ")}</td>
              </tr>
              <tr>
                <th>Notes:</th>
                <td className={`${BASE}__ids`}>{deck.notes.join(", ")}</td>
              </tr>
              <tr>
                <th>Direct Card Length:</th>
                <td>{deck.cards.length}</td>
              </tr>
              <tr>
                <th>Contained Card Length:</th>
                <td>{cards?.length}</td>
              </tr>
              <tr>
                <th colSpan={2} className={`${BASE}__section-header`}>
                  States
                </th>
              </tr>
              <tr>
                <th>New:</th>
                <td>{states[State.New]}</td>
              </tr>
              <tr>
                <th>Learning:</th>
                <td>{states[State.Learning]}</td>
              </tr>
              <tr>
                <th>Review:</th>
                <td>{states[State.Review]}</td>
              </tr>
              <tr>
                <th>Relearning:</th>
                <td>{states[State.Relearning]}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <Text size="sm" variant="dimmed">
            No deck
          </Text>
        )}
      </div>
    </Modal>
  );
}

export default DebugDeckModal;
