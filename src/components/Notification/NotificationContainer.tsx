import React from "react";
import { useNotifications } from "./NotificationContext";
import "./NotificationContainer.css";

const BASE_URL = "notification-container";

export function NotificationContainer() {
  const { notifications } = useNotifications();

  return (
    <div className={BASE_URL}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${BASE_URL}__item ${BASE_URL}__item--${notification.type}`}
          role="alert"
        >
          <div className={`${BASE_URL}__content`}>
            <div className={`${BASE_URL}__title`}>{notification.title}</div>
            <div className={`${BASE_URL}__message`}>{notification.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
