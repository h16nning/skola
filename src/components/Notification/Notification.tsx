import { notifications } from "@mantine/notifications";
import {
  IconArrowsExchange,
  IconCheck,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React from "react";
import classes from "./Notification.module.css";

export function successfullySaved() {
  return notifications.show({
    title: "Card Saved",
    message: "The changes have been saved!",
    color: "green",
    withCloseButton: false,
    icon: <IconCheck />,
    className: classes,
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
    className: classes,
  });
}

export function successfullyMovedCardTo(deckName: string) {
  return notifications.show({
    title: "Card Moved",
    message: `Card moved to ${deckName}!`,
    autoClose: 1000,
    color: "teal",
    withCloseButton: false,
    icon: <IconArrowsExchange />,
    className: classes,
  });
}

export function successfullyMovedDeckTo(deckName: string) {
  return notifications.show({
    title: "Deck Moved",
    message: `Deck moved to ${deckName}!`,
    autoClose: 1000,
    color: "teal",
    withCloseButton: false,
    icon: <IconArrowsExchange />,
    className: classes,
  });
}

export function successfullyDeleted(type: "card" | "deck" | "note") {
  return notifications.show({
    title: { card: "Card Deleted", deck: "Deck Deleted", note: "Note Deleted" }[
      type
    ],
    message: "This object has been deleted!",
    autoClose: 1000,
    color: "teal",
    withCloseButton: false,
    icon: <IconTrash />,
    className: classes,
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
    className: classes,
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
    className: classes,
  });
}

export function deleteFailed(type: "card" | "deck" | "note") {
  return notifications.show({
    title:
      { card: "Card", deck: "Deck", note: "Note" }[type] +
      " Could Not Be Deleted",
    message: "There was an error deleting this object. Please try again later!",
    autoClose: 1500,
    color: "red",
    withCloseButton: false,
    icon: <IconX />,
    className: classes,
  });
}

export function genericFail() {
  return notifications.show({
    title: "Something went wrong!",
    message: "This action could not be completed. Please try again later!",
    autoClose: 1500,
    color: "red",
    withCloseButton: false,
    icon: <IconX />,
    className: classes,
  });
}

export function test() {
  return notifications.show({
    title: "Test",
    message: "This is a description",
    color: "teal",
    withCloseButton: false,
    icon: <IconCheck />,
    className: classes,
  });
}
