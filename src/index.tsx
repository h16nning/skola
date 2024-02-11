import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import reportWebVitals from "./reportWebVitals";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import TodayView from "./components/TodayView";
import StatsView from "./components/StatsView";
import EditCardView, { NoCardView } from "./components/editcard/EditCardView";
import CardManagerView from "./components/CardManagerView/CardManagerView";
import LearnView from "./components/learning/LearnView/LearnView";
import NewCardsView from "./components/editcard/NewCardsView";
import DeckView from "./components/deck/DeckView";
import SettingsView from "./components/settings/SettingsView";
import HomeView from "./components/HomeView";
import { getCard } from "./logic/card";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const router = createBrowserRouter([
  {
    path: "/",
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
        element: <NewCardsView />,
      },
      {
        path: "/learn/:deckId",
        element: <LearnView />,
      },
      {
        path: "/cards/:deckId?",
        element: <CardManagerView />,
        children: [
          {
            index: true,
            element: <NoCardView />,
          },
          {
            path: ":cardId",
            element: <EditCardView />,
            loader: async ({ params }) => {
              const { cardId } = params;
              if (!cardId) throw new Response("Not Found", { status: 404 });
              return await getCard(cardId);
            },
          },
        ],
      },
      {
        path: "/today",
        element: <TodayView />,
      },
      {
        path: "/stats",
        element: <StatsView />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

async function persist() {
  return (
    (await navigator.storage) &&
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
  if (isPersisted) {
    console.log(":) Storage is successfully persisted.");
  } else {
    console.log(":( Storage is not persisted.");
    console.log("Trying to persist..:");
    if (await persist()) {
      console.log(":) We successfully turned the storage to be persisted.");
    } else {
      console.log(":( Failed to make storage persisted");
    }
  }
});

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVEfaa9jF_fCHGiDGp1SL7A64KY2a_4Bg",
  authDomain: "skola-cards.firebaseapp.com",
  projectId: "skola-cards",
  storageBucket: "skola-cards.appspot.com",
  messagingSenderId: "517096864681",
  appId: "1:517096864681:web:32b586f02e5fae8eaa22b8",
  measurementId: "G-E1P08QX0MX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
