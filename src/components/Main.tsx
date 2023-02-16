import { Route, Routes } from "react-router-dom";
import HomeView from "./HomeView";
import SettingsView from "./settings/SettingsView";
import CategoryView from "./CategoryView";

export default function Main() {
    return (
        <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/category/*" element={<CategoryView />} />
        </Routes>
    );
}
