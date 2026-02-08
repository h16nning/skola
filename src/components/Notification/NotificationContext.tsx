import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  autoClose?: number | false;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, "id">) => string;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const newNotification = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);

      if (notification.autoClose !== false) {
        const timeout = notification.autoClose || 3000;
        setTimeout(() => {
          hideNotification(id);
        }, timeout);
      }

      return id;
    },
    []
  );

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}
