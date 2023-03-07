import { Route, Routes } from "react-router-dom";
import HomeView from "./HomeView";
import SettingsView from "./settings/SettingsView";
import DeckView from "./deck/DeckView";
import NewCardView from "./editcard/NewCard";
import LearnView from "./learning/LearnView";
import CardManagerView from "./CardManagerView";

export default function Main() {
  return (
    <Routes>
      <Route path="/home" element={<HomeView />} />
      <Route path="/settings" element={<SettingsView />} />
      <Route path="/deck/*" element={<DeckView />} />
      <Route path="/new/*" element={<NewCardView />} />
      <Route path="/learn/*" element={<LearnView />} />
      <Route path="/cards/*" element={<CardManagerView />} />
    </Routes>
  );
}
