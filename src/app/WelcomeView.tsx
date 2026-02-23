import { Button } from "@/components/ui/Button";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import "./WelcomeView.css";

const BASE = "welcome-view";

export default function WelcomeView() {
  const [_, setRegistered] = useLocalStorage("registered", false);

  return (
    <div className={BASE}>
      <div className={`${BASE}__container`}>
        <header className={`${BASE}__header`}>
          <h1 className={`${BASE}__title`}>Skola</h1>
          <p className={`${BASE}__tagline`}>
            A local-first spaced-repetition flashcard app right here in your
            browser.
          </p>
        </header>

        <section className={`${BASE}__hero`}>
          <p className={`${BASE}__description`}>
            Your learning materials live in your browser using IndexedDB. No
            account required, no tracking and complete ownership.
          </p>
          <Button
            onClick={() => setRegistered(true)}
            size="lg"
            variant="primary"
          >
            Get Studying
          </Button>
        </section>

        <section className={`${BASE}__features`}>
          <div className={`${BASE}__feature`}>
            <h2 className={`${BASE}__feature-title`}>Local-First Design</h2>
            <p className={`${BASE}__feature-text`}>
              Data stored directly in your browser. Private by default and
              incredibly fast. You are never going to wait for responses from
              some server.
            </p>
          </div>

          <div className={`${BASE}__feature`}>
            <h2 className={`${BASE}__feature-title`}>FSRS Scheduling</h2>
            <p className={`${BASE}__feature-text`}>
              We use the Free Spaced Repetition Scheduler algorithm, a state of
              the art scheduling algorithm that optimizes timing based on your
              past performance.
            </p>
          </div>

          <div className={`${BASE}__feature`}>
            <h2 className={`${BASE}__feature-title`}>Works Everywhere</h2>
            <p className={`${BASE}__feature-text`}>
              Skola is a progressive web app, meaning it can install everywhere.
              It is even availabe offline and optimized for mobile and desktop.
            </p>
          </div>

          <div className={`${BASE}__feature`}>
            <h2 className={`${BASE}__feature-title`}>Rich Card Types</h2>
            <p className={`${BASE}__feature-text`}>
              Create standard, double-sided, and cloze deletion cards with full
              HTML editing capabilities.
            </p>
          </div>

          <div className={`${BASE}__feature`}>
            <h2 className={`${BASE}__feature-title`}>Higher-Order Thinking</h2>
            <p className={`${BASE}__feature-text`}>
              Cognitive prompts challenge you to go beyond memorization by
              rethinking cards you've mastered, encouraging deeper
              understanding.
            </p>
          </div>

          <div className={`${BASE}__feature`}>
            <h2 className={`${BASE}__feature-title`}>Free & Open Source</h2>
            <p className={`${BASE}__feature-text`}>
              Skola is open source and free, it will forever stay that way. We
              just believe thoughtful learning software.
            </p>
          </div>
        </section>

        <section className={`${BASE}__philosophy`}>
          <h2 className={`${BASE}__section-title`}>Philosophy</h2>
          <p className={`${BASE}__body-text`}>
            Spaced repetition software should be open source, yet still
            approachable and friendly. Effective tools shouldn't sacrifice
            design for functionality or lock features behind paywalls. Skola is
            being built by an flashcard enthusiatist who is frustrated with the
            current open-source options.
          </p>
          <p className={`${BASE}__body-text`}>
            <i style={{ fontFamily: "var(--font-serif)" }}>A word on AI.</i>{" "}
            Creating flashcards is part of the learning process. Skola is
            designed to support that work, not bypass it. AI has its place, but
            not in replacing the cognitive effort of card creation. Instead,
            Skola explores how technology can encourage higher-order thinking
            through features like cognitive prompts that challenge you to
            reconsider material you've already learned.
          </p>
        </section>

        <footer className={`${BASE}__footer`}>
          <div className={`${BASE}__footer-branding`}>
            <img src="/logo.svg" alt="" className={`${BASE}__footer-logo`} />
            <span className={`${BASE}__footer-name`}>Skola</span>
          </div>
          <p className={`${BASE}__footer-text`}>
            Still in early development. Expect bugs and evolving features.{" "}
            <a
              href="https://github.com/h16nning/skola"
              target="_blank"
              rel="noopener noreferrer"
              className={`${BASE}__link`}
            >
              Contribute on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
