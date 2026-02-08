import { getAdapter } from "@/logic/NoteTypeAdapter";
import { getDeck } from "@/logic/deck/getDeck";
import { getSuperDecks } from "@/logic/deck/getSuperDecks";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { useNotesWith } from "@/logic/note/hooks/useNotesWith";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { NoteSorts } from "@/logic/note/sort";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
import { IconCards, IconSearch, IconSquare } from "@tabler/icons-react";
import cx from "clsx";
import { t } from "i18next";
import { useEffect, useState, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Kbd } from "@/components/ui/Kbd";
import { useDebouncedState } from "@/lib/hooks/useDebouncedState";
import { useOs } from "@/lib/hooks/useOs";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import "./Spotlight.css";

const BASE_URL = "spotlight";

interface NoteWithPreview extends Note<NoteType> {
  breadcrumb: string[];
}

interface SpotlightAction {
  id: string;
  label: string;
  description?: string;
  onClick: () => void;
  leftSection?: ReactNode;
  tabAction?: {
    label: string;
    action: () => void;
  };
}

interface SpotlightGroup {
  group: string;
  actions: SpotlightAction[];
}

const useSearchNote = (filter: string) => {
  const [filteredNotes, setFilteredNotes] = useState<NoteWithPreview[]>([]);
  const [notes] = useNotesWith(
    (n) =>
      n
        .toArray()
        .then((m) =>
          m
            .filter((note) =>
              getAdapter(note)
                .getSortFieldFromNoteContent(note.content)
                .toLowerCase()
                .includes(filter.toLowerCase())
            )
            .sort(NoteSorts.bySortField(1))
        ),
    [filter]
  );
  useEffect(() => {
    async function filterNotes(notes: Note<NoteType>[]) {
      const decksPromises = notes?.map(async (note) => {
        const deck = await getDeck(note.deck);
        const superDecks = await getSuperDecks(deck);
        return [
          ...(superDecks[0] || []).map((sd) => sd.name),
          deck?.name || "Empty",
        ];
      });
      const decks = await Promise.all(decksPromises);
      setFilteredNotes(
        notes.map((note, i) => ({
          ...note,
          breadcrumb: decks[i],
        }))
      );
    }
    filterNotes(notes || []);
  }, [notes]);

  return filteredNotes;
};

function highlightQuery(text: string, query: string): ReactNode {
  if (!query) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className={`${BASE_URL}__highlight`}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function SpotlightCard({
  minimalMode,
}: { minimalMode: boolean }) {
  const navigate = useNavigate();
  const os = useOs();
  const showShortcutHints = useShowShortcutHints();

  const [opened, setOpened] = useState(false);
  const [query, setQuery, immediateQuery] = useDebouncedState("", 250);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [allDecks] = useDecks();
  const filteredNotes = useSearchNote(query);

  const filteredDecks = (allDecks || []).filter((deck) =>
    deck.name.toLowerCase().includes(query.toLowerCase())
  );

  const possibleActions: SpotlightGroup[] = [
    {
      group: "Decks",
      actions: [
        ...filteredDecks.map((deck) => ({
          id: deck.id,
          label: deck.name,
          description: deck.description,
          onClick: () => navigate(`/deck/${deck.id}`),
          leftSection: (
            <IconCards
              style={{ width: "1.5rem", height: "1.5rem" }}
              stroke={1.5}
            />
          ),
          tabAction: {
            label: "to study",
            action: () => navigate(`/learn/${deck.id}`),
          },
        })),
      ],
    },
    {
      group: "Notes",
      actions: [
        ...filteredNotes.map((note) => ({
          id: note.id,
          label: getAdapter(note).getSortFieldFromNoteContent(note.content),
          description: note.breadcrumb.join(" > "),
          onClick: () => navigate(`/deck/${note.deck}`),
          leftSection: (
            <IconSquare
              style={{ width: "1.5rem", height: "1.5rem" }}
              stroke={1.5}
            />
          ),
        })),
      ],
    },
  ];

  const limitedActions: SpotlightGroup[] = [];
  let actionCount = 0;
  for (const group of possibleActions) {
    if (actionCount >= 10) break;
    const availableSlots = 10 - actionCount;
    const groupActions = group.actions.slice(0, availableSlots);
    if (groupActions.length > 0) {
      limitedActions.push({ group: group.group, actions: groupActions });
      actionCount += groupActions.length;
    }
  }

  const flatActions = limitedActions.flatMap((group) => group.actions);
  const totalActions = flatActions.length;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (opened && !dialog.open) {
      dialog.showModal();
      searchInputRef.current?.focus();
      setSelectedIndex(0);
    } else if (!opened && dialog.open) {
      dialog.close();
      setQuery("");
    }
  }, [opened, setQuery]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClick(event: MouseEvent) {
      if (event.target === dialog) {
        setOpened(false);
      }
    }

    function handleCancel(event: Event) {
      event.preventDefault();
      setOpened(false);
    }

    dialog.addEventListener("click", handleClick);
    dialog.addEventListener("cancel", handleCancel);

    return () => {
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, []);

  useHotkeys([
    [
      os === "macos" ? "meta+k" : "ctrl+k",
      (e) => {
        e.preventDefault();
        setOpened((prev) => !prev);
      },
    ],
  ]);

  useEffect(() => {
    if (!opened) return;

    function handleKeyDown(event: KeyboardEvent) {
      event.stopPropagation();

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (totalActions > 0) {
          setSelectedIndex((prev) => (prev + 1) % totalActions);
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (totalActions > 0) {
          setSelectedIndex((prev) => (prev - 1 + totalActions) % totalActions);
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (flatActions[selectedIndex]) {
          flatActions[selectedIndex].onClick();
          setOpened(false);
        }
      } else if (event.key === "Tab") {
        event.preventDefault();
        if (flatActions[selectedIndex]?.tabAction) {
          flatActions[selectedIndex].tabAction!.action();
          setOpened(false);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [opened, selectedIndex, totalActions, flatActions]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpened(true)}
        className={cx(`${BASE_URL}__button`, {
          [`${BASE_URL}__button--minimal`]: minimalMode,
        })}
      >
        {minimalMode ? (
          <IconSearch className={`${BASE_URL}__button-icon`} />
        ) : (
          <>
            <span className={`${BASE_URL}__button-section`}>
              <IconSearch className={`${BASE_URL}__button-icon`} />
              Search
            </span>
            {showShortcutHints && (
              <span className={`${BASE_URL}__button-section`}>
                <Kbd>{`${os === "macos" ? "⌘" : "Ctrl"} + K`}</Kbd>
              </span>
            )}
          </>
        )}
      </button>

      <dialog ref={dialogRef} className={`${BASE_URL}__dialog`}>
        <div className={`${BASE_URL}__content`}>
          <div className={`${BASE_URL}__search-wrapper`}>
            <IconSearch className={`${BASE_URL}__search-icon`} stroke={2} />
            <input
              ref={searchInputRef}
              type="text"
              className={`${BASE_URL}__search-input`}
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              value={immediateQuery}
            />
          </div>

          <div className={`${BASE_URL}__results`}>
            {totalActions === 0 ? (
              <div className={`${BASE_URL}__empty`}>
                {t("spotlight.no-results")}
              </div>
            ) : (
              limitedActions.map((group, groupIndex) => {
                const groupStartIndex = limitedActions
                  .slice(0, groupIndex)
                  .reduce((acc, g) => acc + g.actions.length, 0);

                return (
                  <div key={group.group} className={`${BASE_URL}__group`}>
                    <div className={`${BASE_URL}__group-label`}>
                      {group.group}
                    </div>
                    {group.actions.map((action, localIndex) => {
                      const globalIndex = groupStartIndex + localIndex;

                      return (
                        <button
                          type="button"
                          key={action.id}
                          className={cx(`${BASE_URL}__action`, {
                            [`${BASE_URL}__action--selected`]:
                              globalIndex === selectedIndex,
                          })}
                          onClick={() => {
                            action.onClick();
                            setOpened(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          {action.leftSection && (
                            <span className={`${BASE_URL}__action-icon`}>
                              {action.leftSection}
                            </span>
                          )}
                          <div className={`${BASE_URL}__action-content`}>
                            <div className={`${BASE_URL}__action-label`}>
                              {highlightQuery(action.label, query)}
                            </div>
                            {action.description && (
                              <div
                                className={`${BASE_URL}__action-description`}
                              >
                                {action.description}
                              </div>
                            )}
                          </div>
                          {action.tabAction &&
                            globalIndex === selectedIndex && (
                              <span className={`${BASE_URL}__action-tab`}>
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
      </dialog>
    </>
  );
}
