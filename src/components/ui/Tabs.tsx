import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import "./Tabs.css";

const BASE = "tabs";

interface TabsContextValue {
  value: string | null;
  onChange: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within Tabs");
  }
  return context;
}

type TabsVariant = "default" | "outline" | "pills";

interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  className?: string;
}

export function Tabs({
  children,
  defaultValue,
  value: controlledValue,
  onChange: controlledOnChange,
  variant = "default",
  className = "",
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue || null
  );

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;
  const onChange = controlledOnChange || setUncontrolledValue;

  const classes = [BASE, `${BASE}--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <TabsContext.Provider value={{ value, onChange, variant }}>
      <div className={classes}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

function TabsList({ children, className = "" }: TabsListProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (listRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
        const hasOverflow = scrollWidth > clientWidth;

        setShowLeftGradient(hasOverflow && scrollLeft > 0);
        setShowRightGradient(
          hasOverflow && scrollLeft < scrollWidth - clientWidth - 1
        );
      }
    };

    checkScroll();

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", checkScroll);
    }

    window.addEventListener("resize", checkScroll);

    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [children]);

  const wrapperClasses = [
    `${BASE}__list-wrapper`,
    showLeftGradient && `${BASE}__list-wrapper--show-left`,
    showRightGradient && `${BASE}__list-wrapper--show-right`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      <div ref={listRef} className={`${BASE}__list`}>
        {children}
      </div>
    </div>
  );
}

interface TabsTabProps {
  children: ReactNode;
  value: string;
  className?: string;
}

function TabsTab({ children, value, className = "" }: TabsTabProps) {
  const { value: activeValue, onChange } = useTabsContext();
  const isActive = activeValue === value;

  const classes = [
    `${BASE}__tab`,
    isActive && `${BASE}__tab--active`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={() => onChange(value)}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
}

interface TabsPanelProps {
  children: ReactNode;
  value: string;
  className?: string;
}

function TabsPanel({ children, value, className = "" }: TabsPanelProps) {
  const { value: activeValue } = useTabsContext();

  if (activeValue !== value) {
    return null;
  }

  const classes = [`${BASE}__panel`, className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="tabpanel">
      {children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;
