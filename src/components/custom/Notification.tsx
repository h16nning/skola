import { notifications } from "@mantine/notifications";
import {
  IconArrowsExchange,
  IconArrowsMove,
  IconCheck,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React from "react";
import { swap } from "../../logic/ui";
import { MantineTheme } from "@mantine/core";

const toastStyles = (theme: MantineTheme) => ({
  root: {
    border: "none",
    backgroundColor: swap(theme, "gray", 9, 0),
    boxShadow: theme.shadows.xl,
    padding: "0.5rem",
    margin: "0 auto",
    width: "fit-content",
  },
  title: {
    color: swap(theme, "gray", 0, 9),
    fontSize: "0.85rem",
  },
  description: {
    color: swap(theme, "gray", 4, 6),
    fontSize: "0.8rem",
  },
  icon: {
    width: "1.4rem",
    height: "1.4rem",
    marginRight: "0.625rem",
    "& svg": {
      width: "0.7rem",
      height: "0.7rem",
    },
  },
});
export function successfullySaved() {
  return notifications.show({
    title: "Card Saved",
    message: "The changes have been saved!",
    color: "green",
    withCloseButton: false,
    icon: <IconCheck />,
    styles: toastStyles,
  });
}

export function successfullyAdded() {
  return notifications.show({
    title: "Card Added",
    message: "Card added successfully!",
    autoClose: 1000,
    color: "teal",
    withCloseButton: false,
    icon: <IconCheck />,
    styles: toastStyles,
  });
}

export function successfullyMovedTo(deckName: string) {
  return notifications.show({
    title: "Card Moved",
    message: `Card moved to ${deckName}!`,
    autoClose: 1000,
    color: "teal",
    withCloseButton: false,
    icon: <IconArrowsExchange />,
    styles: toastStyles,
  });
}

export function successfullyDeleted(type: "card" | "deck") {
  return notifications.show({
    title: { card: "Card Deleted", deck: "Deck Deleted" }[type],
    message: "This object has been deleted!",
    autoClose: 1000,
    color: "teal",
    withCloseButton: false,
    icon: <IconTrash />,
    styles: toastStyles,
  });
}

export function saveFailed() {
  return notifications.show({
    title: "Something went wrong!",
    message: "The changes could not be saved. Please try again later!",
    autoClose: 1500,
    color: "red",
    withCloseButton: false,
    icon: <IconX />,
    styles: toastStyles,
  });
}

export function addFailed() {
  return notifications.show({
    title: "Something went wrong!",
    message: "The card could not be added. Please try again later!",
    autoClose: 1500,
    color: "red",
    withCloseButton: false,
    icon: <IconX />,
    styles: toastStyles,
  });
}

export function deleteFailed(type: "card" | "deck") {
  return notifications.show({
    title: { card: "Card", deck: "Deck" }[type] + " Could Not Be Deleted",
    message: "There was an error deleting this object. Please try again later!",
    autoClose: 1500,
    color: "red",
    withCloseButton: false,
    icon: <IconX />,
    styles: toastStyles,
  });
}

export function generalFail() {
  return notifications.show({
    title: "Something went wrong!",
    message: "This action could not be completed. Please try again later!",
    autoClose: 1500,
    color: "red",
    withCloseButton: false,
    icon: <IconX />,
    styles: toastStyles,
  });
}

export function test() {
  return notifications.show({
    title: "Test",
    message: "This is a description",
    color: "teal",
    withCloseButton: false,
    icon: <IconCheck />,
    styles: toastStyles,
  });
}
