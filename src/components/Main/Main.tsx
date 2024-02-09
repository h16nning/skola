import classes from "./Main.module.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomeView from "../HomeView";
import SettingsView from "../settings/SettingsView";
import DeckView from "../deck/DeckView";
import NewCardView from "../editcard/NewCardsView";
import LearnView from "../learning/LearnView/LearnView";
import CardManagerView from "../CardManagerView/CardManagerView";
import { AppShell, Center, Text, Title } from "@mantine/core";
import React from "react";
import TodayView from "../TodayView";
import { AppHeaderContent } from "../Header/Header";

export default function Main() {
  return (
    <AppShell.Main>
      <Center className={classes.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace={true} />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="/settings/*" element={<SettingsView />} />
          <Route path="/deck/*" element={<DeckView />} />
          <Route path="/new/*" element={<NewCardView />} />
          <Route path="/learn/*" element={<LearnView />} />
          <Route path="/cards/*" element={<CardManagerView />} />
          <Route path="/today" element={<TodayView />} />

          <Route
            path="/stats"
            element={
              <Text>
                <AppHeaderContent>
                  <Center>
                    <Title order={3}>Statistics</Title>
                  </Center>
                </AppHeaderContent>
                The statistics view is under development.
              </Text>
            }
          />
        </Routes>
      </Center>
    </AppShell.Main>
  );
}
