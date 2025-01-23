import "./style/index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import App from "./App";
import HomeView from "./components/HomeView";
import NoteManagerView from "./components/NoteManagerView/NoteManagerView";
import StatsView from "./components/StatsView";
import TodayView from "./components/TodayView";
import DeckView from "./components/deck/DeckView";
import EditNoteView, { NoNoteView } from "./components/editcard/EditNoteView";
import NewNotesView from "./components/editcard/NewNotesView";
import LearnView from "./components/learning/LearnView/LearnView";
import SettingsView from "./components/settings/SettingsView";
import { getNote } from "./logic/note";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const router = createHashRouter(
  [
    {
      element: <App />,
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace={true} />,
        },
        {
          path: "/home",
          element: <HomeView />,
        },
        {
          path: "/settings/:section?",
          element: <SettingsView />,
        },
        {
          path: "/deck/:deckId",
          element: <DeckView />,
        },
        {
          path: "/deck/:deckId/:params",
          element: <DeckView />,
        },
        {
          path: "/new/:deckId?",
          element: <NewNotesView />,
        },
        {
          path: "/learn/:deckId/:params?",
          element: <LearnView />,
        },
        {
          path: "/notes/:deckId?",
          element: <NoteManagerView />,
          children: [
            {
              index: true,
              element: <NoNoteView />,
            },
            {
              path: ":noteId",
              element: <EditNoteView />,
              loader: async ({ params }) => {
                const { noteId } = params;
                if (!noteId) throw new Response("Not Found", { status: 404 });
                return await getNote(noteId);
              },
            },
          ],
        },
        {
          path: "/today",
          element: <TodayView />,
        },
        {
          path: "/stats/:deckId?",
          element: <StatsView />,
        },
      ],
    },
  ],
  { basename: "/" }
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

navigator.serviceWorker.getRegistrations().then((registrations) => {
  for (const registration of registrations) {
    registration.unregister();
  }
});

async function persist() {
  return (
    navigator.storage &&
    navigator.storage.persist &&
    navigator.storage.persist()
  );
}

async function isStoragePersisted() {
  return (
    (await navigator.storage) &&
    navigator.storage.persisted &&
    navigator.storage.persisted()
  );
}

isStoragePersisted().then(async (isPersisted) => {
  if (!isPersisted) {
    console.warn("Storage is not persistant. Trying to make it persistant...");
    if (await persist()) {
      console.log("Successfully made storage persisted");
    } else {
      console.warn("Failed to make storage persisted");
      navigator.userAgent.includes("Safari") &&
        console.info(
          "You are using Safari, storage may be cleared after 7 days of inactivity: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/"
        );
    }
  }
});