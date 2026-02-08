import { useCallback, useState } from "react";

export interface ListStateHandlers<T> {
  setState: (items: T[]) => void;
  append: (...items: T[]) => void;
  prepend: (...items: T[]) => void;
  insert: (index: number, ...items: T[]) => void;
  remove: (...indices: number[]) => void;
  reorder: (params: { from: number; to: number }) => void;
  setItem: (index: number, item: T) => void;
  setItemProp: <K extends keyof T>(index: number, prop: K, value: T[K]) => void;
  applyWhere: (
    condition: (item: T, index: number) => boolean,
    transform: (item: T) => T
  ) => void;
}

export function useListState<T>(
  initialValue: T[] = []
): [T[], ListStateHandlers<T>] {
  const [state, setState] = useState(initialValue);

  const append = useCallback((...items: T[]) => {
    setState((current) => [...current, ...items]);
  }, []);

  const prepend = useCallback((...items: T[]) => {
    setState((current) => [...items, ...current]);
  }, []);

  const insert = useCallback((index: number, ...items: T[]) => {
    setState((current) => [
      ...current.slice(0, index),
      ...items,
      ...current.slice(index),
    ]);
  }, []);

  const remove = useCallback((...indices: number[]) => {
    setState((current) =>
      current.filter((_, index) => !indices.includes(index))
    );
  }, []);

  const reorder = useCallback((params: { from: number; to: number }) => {
    setState((current) => {
      const cloned = [...current];
      const item = cloned[params.from];
      cloned.splice(params.from, 1);
      cloned.splice(params.to, 0, item);
      return cloned;
    });
  }, []);

  const setItem = useCallback((index: number, item: T) => {
    setState((current) => {
      const cloned = [...current];
      cloned[index] = item;
      return cloned;
    });
  }, []);

  const setItemProp = useCallback(
    <K extends keyof T>(index: number, prop: K, value: T[K]) => {
      setState((current) => {
        const cloned = [...current];
        cloned[index] = { ...cloned[index], [prop]: value };
        return cloned;
      });
    },
    []
  );

  const applyWhere = useCallback(
    (
      condition: (item: T, index: number) => boolean,
      transform: (item: T) => T
    ) => {
      setState((current) =>
        current.map((item, index) =>
          condition(item, index) ? transform(item) : item
        )
      );
    },
    []
  );

  const handlers: ListStateHandlers<T> = {
    setState,
    append,
    prepend,
    insert,
    remove,
    reorder,
    setItem,
    setItemProp,
    applyWhere,
  };

  return [state, handlers];
}
