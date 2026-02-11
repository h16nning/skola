import {
  addFailed,
  successfullyAdded,
} from "@/components/Notification/Notification";
import { EditMode } from "@/logic/NoteTypeAdapter";
import { Deck } from "@/logic/deck/deck";
import { Note, NoteType } from "@/logic/note/note";
import { Editor } from "@tiptap/react";
import { useCallback, useEffect, useRef } from "react";
import { UseNoteEditorProps, useNoteEditor } from "./NoteEditor";

export function useDebouncedAutoSave(
  autoSaveFn: () => Promise<void>,
  delay = 10
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      autoSaveFn();
    }, delay);
  }, [autoSaveFn, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedSave;
}

export function useAutoSave<T extends NoteType>(
  mode: EditMode,
  note: Note<T> | null,
  getContent: () => any,
  updateFn: (params: any, note: Note<T>) => Promise<void>
) {
  const autoSave = useCallback(async () => {
    if (mode === "edit" && note) {
      try {
        await updateFn(getContent(), note);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }
  }, [mode, note, getContent, updateFn]);

  return useDebouncedAutoSave(autoSave);
}

export function useNoteEditorWithAutoSave(
  props: UseNoteEditorProps & {
    contentRef: React.MutableRefObject<string>;
    onContentChange: () => void;
  }
) {
  const { contentRef, onContentChange, ...editorProps } = props;

  return useNoteEditor({
    ...editorProps,
    onUpdate: ({ editor, transaction }) => {
      contentRef.current = editor.getHTML();
      onContentChange();
      editorProps.onUpdate?.({ editor, transaction });
    },
  });
}

export function useNoteCreation<T extends NoteType>(
  mode: EditMode,
  deck: Deck,
  getContent: () => any,
  createFn: (
    params: any,
    deck: Deck
  ) => Promise<string | undefined> | undefined,
  clearFn: () => void,
  requestedFinish?: boolean,
  setRequestedFinish?: (finish: boolean) => void
) {
  const handleCreate = useCallback(async () => {
    if (mode === "new") {
      try {
        await createFn(getContent(), deck);
        clearFn();
        successfullyAdded();
      } catch {
        addFailed();
      }
    }
  }, [mode, deck, getContent, createFn, clearFn]);

  useEffect(() => {
    if (requestedFinish && mode === "new") {
      handleCreate();
      setRequestedFinish?.(false);
    }
  }, [requestedFinish, mode, handleCreate, setRequestedFinish]);

  return handleCreate;
}

export function useClearEditors(...editors: (Editor | null)[]) {
  return useCallback(() => {
    editors.forEach((editor, index) => {
      editor?.commands.setContent("");
      if (index === 0) {
        editor?.commands.focus();
      }
    });
  }, [editors]);
}
