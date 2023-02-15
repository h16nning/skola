import { Route, Routes } from "react-router-dom";
import CHome from "./CHome";
import CSettings from "./settings/CSettings";

export default function CMain() {
    return (
        <Routes>
            <Route path="/" element={<CHome />} />
            <Route path="/settings" element={<CSettings />} />
        </Routes>
    );
}
