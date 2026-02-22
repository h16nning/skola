import { Note, NoteType } from "@/logic/note/note";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseNoteSelectionOptions {
  notes: Note<NoteType>[] | undefined;
  onOpenNote?: (note: Note<NoteType> | undefined) => void;
}

interface UseNoteSelectionReturn {
  selectedNoteIds: Set<string>;
  openedNote: Note<NoteType> | undefined;
  setOpenedNote: (note: Note<NoteType> | undefined) => void;
  handleNoteClick: (
    note: Note<NoteType>,
    index: number,
    event: React.MouseEvent
  ) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  clearSelection: () => void;
  setRowRef: (index: number, element: HTMLTableRowElement | null) => void;
}

export function useNoteSelection({
  notes,
  onOpenNote,
}: UseNoteSelectionOptions): UseNoteSelectionReturn {
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(
    new Set()
  );
  const [openedNote, setOpenedNote] = useState<Note<NoteType> | undefined>();
  const [anchorIndex, setAnchorIndex] = useState<number>(-1);
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const openedNoteRef = useRef<Note<NoteType> | undefined>(openedNote);
  const anchorIndexRef = useRef<number>(anchorIndex);

  useEffect(() => {
    openedNoteRef.current = openedNote;
  }, [openedNote]);

  useEffect(() => {
    anchorIndexRef.current = anchorIndex;
  }, [anchorIndex]);

  useEffect(() => {
    if (onOpenNote) {
      onOpenNote(openedNote);
    }
  }, [openedNote, onOpenNote]);

  const setRowRef = useCallback(
    (index: number, element: HTMLTableRowElement | null) => {
      if (element) {
        rowRefs.current.set(index, element);
      } else {
        rowRefs.current.delete(index);
      }
    },
    []
  );

  const scrollToIndex = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const element = rowRefs.current.get(index);
      if (!element) return;

      const container = element.closest(".note-table");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const padding = 80;
      const isAboveView = elementRect.top < containerRect.top + padding;
      const isBelowView = elementRect.bottom > containerRect.bottom - padding;

      if (isAboveView || isBelowView) {
        const elementTop = element.offsetTop;
        const containerHeight = container.clientHeight;
        const elementHeight = element.clientHeight;

        let targetScroll: number;
        if (isAboveView) {
          targetScroll = elementTop - padding;
        } else {
          targetScroll = elementTop - containerHeight + elementHeight + padding;
        }

        container.scrollTo({
          top: targetScroll,
          behavior: behavior || "smooth",
        });
      }
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelectedNoteIds(new Set());
    setOpenedNote(undefined);
    setAnchorIndex(-1);
  }, []);

  const handleNoteClick = useCallback(
    (note: Note<NoteType>, index: number, event: React.MouseEvent) => {
      if (!notes) return;

      const isMetaKey = event.metaKey || event.ctrlKey;
      const isShiftKey = event.shiftKey;

      if (isShiftKey) {
        const startIndex =
          anchorIndexRef.current !== -1 ? anchorIndexRef.current : 0;
        const start = Math.min(startIndex, index);
        const end = Math.max(startIndex, index);
        const rangeIds = new Set(notes.slice(start, end + 1).map((n) => n.id));
        setSelectedNoteIds(rangeIds);
        setOpenedNote(note);
      } else if (isMetaKey) {
        setSelectedNoteIds((prevSelectedNoteIds) => {
          const newSelection = new Set(prevSelectedNoteIds);
          if (newSelection.has(note.id)) {
            newSelection.delete(note.id);
            if (note.id === openedNoteRef.current?.id) {
              const remainingIds = Array.from(newSelection);
              const newOpenedNote =
                remainingIds.length > 0
                  ? notes.find(
                      (n) => n.id === remainingIds[remainingIds.length - 1]
                    )
                  : undefined;
              setOpenedNote(newOpenedNote);
            }
          } else {
            newSelection.add(note.id);
            setOpenedNote(note);
          }
          return newSelection;
        });
        setAnchorIndex(index);
      } else {
        setSelectedNoteIds(new Set([note.id]));
        setOpenedNote(note);
        setAnchorIndex(index);
      }
    },
    [notes]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!notes || notes.length === 0) return;

      const currentIndex = openedNoteRef.current
        ? notes.findIndex((n) => n.id === openedNoteRef.current?.id)
        : -1;

      if ((event.metaKey || event.ctrlKey) && event.key === "a") {
        event.preventDefault();
        setSelectedNoteIds((prevSelectedNoteIds) => {
          const allIds = new Set(notes.map((n) => n.id));
          const allSelected = notes.every((n) => prevSelectedNoteIds.has(n.id));

          if (allSelected) {
            clearSelection();
            return new Set();
          } else {
            if (!openedNoteRef.current && notes.length > 0) {
              setOpenedNote(notes[0]);
              setAnchorIndex(0);
            }
            return allIds;
          }
        });
      } else if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        const lastIndex = notes.length - 1;
        if (lastIndex !== currentIndex) {
          const nextNote = notes[lastIndex];
          setSelectedNoteIds(new Set([nextNote.id]));
          setOpenedNote(nextNote);
          scrollToIndex(lastIndex, "instant");
        }
      } else if ((event.metaKey || event.ctrlKey) && event.key === "ArrowUp") {
        event.preventDefault();
        const firstIndex = 0;
        if (firstIndex !== currentIndex) {
          const nextNote = notes[firstIndex];
          setSelectedNoteIds(new Set([nextNote.id]));
          setOpenedNote(nextNote);
          scrollToIndex(firstIndex, "instant");
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex =
          currentIndex < notes.length - 1 ? currentIndex + 1 : currentIndex;
        if (nextIndex !== currentIndex) {
          const nextNote = notes[nextIndex];
          if (event.shiftKey) {
            const startIndex =
              anchorIndexRef.current !== -1
                ? anchorIndexRef.current
                : currentIndex;
            const start = Math.min(startIndex, nextIndex);
            const end = Math.max(startIndex, nextIndex);
            const rangeIds = new Set(
              notes.slice(start, end + 1).map((n) => n.id)
            );
            setSelectedNoteIds(rangeIds);
          } else {
            setSelectedNoteIds(new Set([nextNote.id]));
            setAnchorIndex(nextIndex);
          }
          setOpenedNote(nextNote);
          scrollToIndex(nextIndex);
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        if (prevIndex !== currentIndex) {
          const prevNote = notes[prevIndex];
          if (event.shiftKey) {
            const startIndex =
              anchorIndexRef.current !== -1
                ? anchorIndexRef.current
                : currentIndex;
            const start = Math.min(startIndex, prevIndex);
            const end = Math.max(startIndex, prevIndex);
            const rangeIds = new Set(
              notes.slice(start, end + 1).map((n) => n.id)
            );
            setSelectedNoteIds(rangeIds);
          } else {
            setSelectedNoteIds(new Set([prevNote.id]));
            setAnchorIndex(prevIndex);
          }
          setOpenedNote(prevNote);
          scrollToIndex(prevIndex);
        }
      }
    },
    [notes, clearSelection, scrollToIndex]
  );

  return {
    selectedNoteIds,
    openedNote,
    setOpenedNote,
    handleNoteClick,
    handleKeyDown,
    clearSelection,
    setRowRef,
  };
}
