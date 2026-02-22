import { IconButton } from "@/components/ui";
import { Kbd } from "@/components/ui/Kbd";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { IconCards, IconSearch, IconSquare, IconX } from "@tabler/icons-react";
import cx from "clsx";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import type { SpotlightGroup } from "./types";
import { useSearchNote } from "./useSearchNote";
import { highlightQuery } from "./utils";

const BASE = "spotlight";

interface SpotlightContentProps {
  query: string;
  immediateQuery: string;
  setQuery: (query: string) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onClose: () => void;
}

export function SpotlightContent({
  query,
  immediateQuery,
  setQuery,
  selectedIndex,
  setSelectedIndex,
  onClose,
}: SpotlightContentProps) {
  const navigate = useNavigate();

  const [allDecks] = useDecks();
  const filteredNotes = useSearchNote(query);

  const filteredDecks = (allDecks ?? []).filter((deck) =>
    deck.name.toLowerCase().includes(query.toLowerCase())
  );

  const possibleActions: SpotlightGroup[] = [
    {
      group: "Decks",
      actions: filteredDecks.map((deck) => ({
        id: deck.id,
        label: deck.name,
        description: deck.description,
        onClick: () => navigate(`/deck/${deck.id}`),
        leftSection: <IconCards />,
        tabAction: {
          label: "to study",
          action: () => navigate(`/learn/${deck.id}`),
          disabled:
            deck.statCache &&
            deck.statCache.counts.new +
              deck.statCache.counts.learning +
              deck.statCache.counts.review ===
              0,
        },
      })),
    },
    {
      group: "Notes",
      actions: filteredNotes.map((note) => ({
        id: note.id,
        label: getAdapter(note).getSortFieldFromNoteContent(note.content),
        description: note.breadcrumb.join(" > "),
        onClick: () => navigate(`/notes?deck=${note.deck}&note=${note.id}`),
        leftSection: <IconSquare />,
      })),
    },
  ];

  const limitedActions: SpotlightGroup[] = [];
  let actionCount = 0;
  for (const group of possibleActions) {
    if (actionCount >= 10) break;
    const slots = 10 - actionCount;
    const groupActions = group.actions.slice(0, slots);
    if (groupActions.length > 0) {
      limitedActions.push({ group: group.group, actions: groupActions });
      actionCount += groupActions.length;
    }
  }

  const totalActions = limitedActions.flatMap((g) => g.actions).length;

  return (
    <div className={`${BASE}__content`}>
      <div className={`${BASE}__search-wrapper`}>
        <IconSearch className={`${BASE}__search-icon`} stroke={2} />
        <input
          autoFocus
          type="text"
          className={`${BASE}__search-input`}
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
          value={immediateQuery}
        />
        <IconButton
          className={`${BASE}__close-button`}
          onClick={onClose}
          size="sm"
        >
          <IconX />
        </IconButton>
      </div>

      <div className={`${BASE}__results`}>
        {totalActions === 0 ? (
          <div className={`${BASE}__empty`}>
            {t("spotlight.no-results")}
          </div>
        ) : (
          limitedActions.map((group, groupIndex) => {
            const groupStartIndex = limitedActions
              .slice(0, groupIndex)
              .reduce((acc, g) => acc + g.actions.length, 0);

            return (
              <div key={group.group} className={`${BASE}__group`}>
                <div className={`${BASE}__group-label`}>{group.group}</div>
                {group.actions.map((action, localIndex) => {
                  const globalIndex = groupStartIndex + localIndex;
                  return (
                    <button
                      type="button"
                      key={action.id}
                      className={cx(`${BASE}__action`, {
                        [`${BASE}__action--selected`]:
                          globalIndex === selectedIndex,
                      })}
                      onClick={() => {
                        action.onClick();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      {action.leftSection && (
                        <span className={`${BASE}__action-icon`}>
                          {action.leftSection}
                        </span>
                      )}
                      <div className={`${BASE}__action-content`}>
                        <div className={`${BASE}__action-label`}>
                          {highlightQuery(action.label, query)}
                        </div>
                        {action.description && (
                          <div className={`${BASE}__action-description`}>
                            {action.description}
                          </div>
                        )}
                      </div>
                      {action.tabAction &&
                        !action.tabAction.disabled &&
                        globalIndex === selectedIndex && (
                          <span className={`${BASE}__action-tab`}>
                            <Kbd>Tab</Kbd> {action.tabAction.label}
                          </span>
                        )}
                    </button>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
