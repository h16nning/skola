import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect } from "react";
import "./WelcomeView.css";

const BASE = "welcome-view";

export default function WelcomeView() {
  const [_, setRegistered] = useLocalStorage("registered", false);

  useEffect(() => {}, []);

  return (
    <div className={BASE}>
      <div className={`${BASE}__container`}>
        <div className={`${BASE}__logo-wrapper`}>
          <img
            src="/logo.svg"
            alt=""
            className={`${BASE}__logo ${BASE}__logo-blur`}
          />
        </div>

        <div className={`${BASE}__section`}>
          <h1 className={`${BASE}__title`}>Welcome to Skola!</h1>
          <p className={`${BASE}__subtitle`}>
            A flash card learning app here in your browser.
          </p>

          <div className={`${BASE}__feature-list`}>
            {[
              "No sign-up required",
              "Free and open source",
              "Directly in your browser",
              "No tracking",
            ].map((item) => (
              <div key={item} className={`${BASE}__feature-item`}>
                <svg
                  className={`${BASE}__check-icon`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className={`${BASE}__feature-text`}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Alert variant="info" icon={<IconInfoCircle />}>
          Please note that this app is still in early development. You may
          encounter bugs and missing features. If you find any issues, consider
          reporting them on the{" "}
          <a
            href="https://www.github.com/h16nning/skola"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
          .
        </Alert>

        <div className={`${BASE}__section`}>
          <h3 className={`${BASE}__heading`}>About the project</h3>
          <p className={`${BASE}__text`}>
            Skola is a project developed by a student aiming to provide an
            alternative to spaced repetition apps like Anki and SuperMemo. It is
            open-source and completely free to use. The focus lies on creating a
            fun to use and intuitive experience. You can find more information
            on the{" "}
            <a
              href="https://www.github.com/h16nning/skola"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>

        <div className={`${BASE}__section`}>
          <h3 className={`${BASE}__heading`}>About privacy</h3>
          <p className={`${BASE}__text`}>
            Privacy is a priority of this project. Skola saves decks and cards
            locally in your browser using the IndexedDB API. Furthermore local
            storage and cookies are being used to store relevant data. We do not
            collect any personal data. Currently, a syncing feature is under
            development allowing you to store your data in the cloud. However,
            this feature is totally optional.
          </p>
        </div>

        <div className={`${BASE}__actions`}>
          <Button onClick={() => setRegistered(true)} variant="primary">
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}
