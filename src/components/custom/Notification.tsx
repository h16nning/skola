import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import React from "react";

export function successfullySaved() {
  return notifications.show({
    title: "Saved!",
    message: "The changes have been saved sucessfully!",
    autoClose: 1000,
    color: "green",
    withCloseButton: false,
    icon: <IconCheck />,
  });
}

export function successfullyAdded() {
  return notifications.show({
    title: "Added!",
    message: "The card has been added sucessfully!",
    autoClose: 1000,
    color: "green",
    withCloseButton: false,
    icon: <IconCheck />,
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
  });
}
