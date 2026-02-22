import { Kbd } from "@/components/ui/Kbd";
import { useDebouncedState } from "@/lib/hooks/useDebouncedState";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useOs } from "@/lib/hooks/useOs";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { getDeck } from "@/logic/deck/getDeck";
import { getSuperDecks } from "@/logic/deck/getSuperDecks";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { useNotesWith } from "@/logic/note/hooks/useNotesWith";
import { Note, NoteType } from "@/logic/note/note";
import { NoteSorts } from "@/logic/note/sort";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
import { IconCards, IconSearch, IconSquare, IconX } from "@tabler/icons-react";
import cx from "clsx";
import { t } from "i18next";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import "./Spotlight.css";
import { IconButton } from "@/components/ui";
import { NavItem } from "@/components/ui/NavItem";

const BASE = "spotlight";

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
    disabled?: boolean;
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
    async function enrich(notes: Note<NoteType>[]) {
      const decks = await Promise.all(
        notes.map(async (note) => {
          const deck = await getDeck(note.deck);
          const superDecks = await getSuperDecks(deck);
          return [
            ...(superDecks[0] ?? []).map((sd) => sd.name),
            deck?.name ?? "Empty",
          ];
        })
      );
      setFilteredNotes(
        notes.map((note, i) => ({ ...note, breadcrumb: decks[i] }))
      );
    }
    enrich(notes ?? []);
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
      <mark className={`${BASE}__highlight`}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function SpotlightCard() {
  const navigate = useNavigate();
  const os = useOs();
  const showShortcutHints = useShowShortcutHints();

  const [query, setQuery, immediateQuery] = useDebouncedState("", 50);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const flatActions = limitedActions.flatMap((g) => g.actions);
  const totalActions = flatActions.length;

  const flatActionsRef = useRef(flatActions);
  flatActionsRef.current = flatActions;
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const totalActionsRef = useRef(totalActions);
  totalActionsRef.current = totalActions;

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setSelectedIndex(0);
    dialog.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setQuery("");
      setSelectedIndex(0);
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [setQuery]);

  useHotkeys([
    [
      os === "macos" ? "meta+k" : "ctrl+k",
      (e) => {
        e.preventDefault();
        open();
      },
      { enableOnInputs: true },
    ],
  ]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const flat = flatActionsRef.current;
      const idx = selectedIndexRef.current;
      const total = totalActionsRef.current;

      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (total > 0) setSelectedIndex((prev) => (prev + 1) % total);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (total > 0) setSelectedIndex((prev) => (prev - 1 + total) % total);
      } else if (e.key === "Enter") {
        e.preventDefault();
        flat[idx]?.onClick();
        close();
      } else if (e.key === "Tab") {
        e.preventDefault();
        const tab = flat[idx]?.tabAction;
        if (tab && !tab.disabled) {
          tab.action();
          close();
        }
      }
    };

    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      <NavItem
        onClick={open}
        label="Search"
        icon={<IconSearch />}
        rightElement={
          showShortcutHints && <Kbd>{os === "macos" ? "⌘" : "Ctrl"} + K</Kbd>
        }
      />

      <dialog
        ref={dialogRef}
        className={`${BASE}__dialog`}
        aria-label={t("spotlight.title", "Command palette")}
        {...({ closedby: "any" } as React.HTMLAttributes<HTMLDialogElement>)}
      >
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
              onClick={close}
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
                            close();
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
      </dialog>
    </>
  );
}
