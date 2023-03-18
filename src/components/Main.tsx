import { Route, Routes } from "react-router-dom";
import HomeView from "./HomeView";
import SettingsView from "./settings/SettingsView";
import DeckView from "./deck/DeckView";
import NewCardView from "./editcard/NewCard";
import LearnView from "./learning/LearnView";
import CardManagerView from "./CardManagerView";
import { Center } from "@mantine/core";
import React from "react";

export default function Main() {
  return (
    <Center
      px="md"
      pt="5rem"
      mt="-4rem"
      sx={(theme) => ({
        overflowY: "scroll",
        height: "100vh",
        alignItems: "start",
      })}
    >
      <Routes>
        <Route path="/home" element={<HomeView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/deck/*" element={<DeckView />} />
        <Route path="/new/*" element={<NewCardView />} />
        <Route path="/learn/*" element={<LearnView />} />
        <Route path="/cards/*" element={<CardManagerView />} />
      </Routes>
    </Center>
  );
}
