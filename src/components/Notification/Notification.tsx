import { useNotifications } from "./NotificationContext";

let showNotificationFn:
  | ((notification: {
      title: string;
      message: string;
      type: "success" | "error" | "info";
      autoClose?: number | false;
    }) => string)
  | null = null;

export function setNotificationHandler(handler: typeof showNotificationFn) {
  showNotificationFn = handler;
}

function showNotification(
  title: string,
  message: string,
  type: "success" | "error" | "info",
  autoClose?: number | false
) {
  if (!showNotificationFn) {
    console.warn("Notification system not initialized");
    return;
  }
  return showNotificationFn({ title, message, type, autoClose });
}

export function successfullySaved() {
  return showNotification(
    "Card Saved",
    "The changes have been saved!",
    "success",
    3000
  );
}

export function successfullyAdded() {
  return showNotification(
    "Card Added",
    "Card added successfully!",
    "success",
    1000
  );
}

export function successfullyMovedCardTo(deckName: string) {
  return showNotification(
    "Card Moved",
    `Card moved to ${deckName}!`,
    "success",
    1000
  );
}

export function successfullyMovedNoteTo(deckName: string) {
  return showNotification(
    "Note Moved",
    `Note moved to ${deckName}!`,
    "success",
    1000
  );
}

export function successfullyMovedDeckTo(deckName: string) {
  return showNotification(
    "Deck Moved",
    `Deck moved to ${deckName}!`,
    "success",
    1000
  );
}

export function successfullyDeleted(type: "card" | "deck" | "note") {
  const titles = {
    card: "Card Deleted",
    deck: "Deck Deleted",
    note: "Note Deleted",
  };
  return showNotification(
    titles[type],
    "This object has been deleted!",
    "success",
    1000
  );
}

export function saveFailed() {
  return showNotification(
    "Something went wrong!",
    "The changes could not be saved. Please try again later!",
    "error",
    1500
  );
}

export function addFailed() {
  return showNotification(
    "Something went wrong!",
    "The card could not be added. Please try again later!",
    "error",
    1500
  );
}

export function deleteFailed(type: "card" | "deck" | "note") {
  const typeLabels = { card: "Card", deck: "Deck", note: "Note" };
  return showNotification(
    `${typeLabels[type]} Could Not Be Deleted`,
    "There was an error deleting this object. Please try again later!",
    "error",
    1500
  );
}

export function genericFail() {
  return showNotification(
    "Something went wrong!",
    "This action could not be completed. Please try again later!",
    "error",
    1500
  );
}

export function test() {
  return showNotification("Test", "This is a description", "info", 3000);
}

export function useNotificationSetup() {
  const { showNotification: show } = useNotifications();

  if (!showNotificationFn) {
    setNotificationHandler(show);
  }
}
