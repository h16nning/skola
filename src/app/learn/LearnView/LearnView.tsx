import { AppHeaderContent } from "@/app/shell/Header/Header";
import MissingObject from "@/components/MissingObject";
import { Modal } from "@/components/ui/Modal";
import { Paper } from "@/components/ui/Paper";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { useDeckFromUrl } from "@/logic/deck/hooks/useDeckFromUrl";
import { useNote } from "@/logic/note/hooks/useNote";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FinishedLearningView from "../FinishedLearningView/FinishedLearningView";
import LearnViewCurrentCardStateIndicator from "../LearnViewCurrentCardStateIndicator/LearnViewCurrentCardStateIndicator";
import CognitivePromptConnector from "./CognitivePromptConnector";
import "./LearnView.css";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader, { stopwatchResult } from "./LearnViewHeader";
import QuickAddNote from "./QuickAddNote";
import VisualFeedback from "./VisualFeedback";
import { useLearnSession } from "./useLearnSession";

const BASE_URL = "learn-view";

function LearnView() {
  const [useVisualFeedback] = useSetting("useVisualFeedback");
  const [showCognitivePrompts] = useSetting("showCognitivePrompts");
  const [newToReviewRatio] = useSetting("learn_newToReviewRatio");

  const navigate = useNavigate();
  const [deck, isReady, params] = useDeckFromUrl();

  const {
    controller,
    currentRating,
    selectedPrompt,
    showPrompts,
    answerCard,
    togglePrompt,
    closeQuickAdd,
  } = useLearnSession({
    deck,
    learnAll: params === "all",
    newToReviewRatio,
  });

  const cardContent = useNote(controller.currentCard?.note ?? "")?.content;

  const [debouncedFinish] = useDebouncedValue(controller.isFinished, 50);

  useEffect(() => {
    if (controller.isFinished) {
      stopwatchResult && stopwatchResult.pause();
    } else {
      stopwatchResult && stopwatchResult.start();
    }
  }, [controller.isFinished]);

  if (isReady && !deck) {
    return <MissingObject />;
  }

  return (
    <div className={BASE_URL}>
      <AppHeaderContent>
        <LearnViewHeader
          currentCard={controller.currentCard ?? undefined}
          controller={controller}
          deck={deck}
        />
      </AppHeaderContent>

      <div className={`${BASE_URL}__wrapper`}>
        {useVisualFeedback && <VisualFeedback rating={currentRating} />}
        <div className={`${BASE_URL}__card-container`}>
          <div className={`${BASE_URL}__card-stack`}>
            <LearnViewCurrentCardStateIndicator
              currentCardModel={controller.currentCard?.model}
            />
            <Paper className={`${BASE_URL}__card`} shadow="xs" withBorder>
              {!controller.showingAnswer &&
                controller.currentCard &&
                getAdapter(controller.currentCard).displayQuestion(
                  controller.currentCard,
                  cardContent
                )}
              {controller.showingAnswer &&
                controller.currentCard &&
                getAdapter(controller.currentCard).displayAnswer(
                  controller.currentCard,
                  cardContent
                )}
            </Paper>
            {showCognitivePrompts && controller.showingAnswer && (
              <>
                {showPrompts && (
                  <CognitivePromptConnector
                    onToggle={togglePrompt}
                    selectedPrompt={selectedPrompt}
                  />
                )}
                {selectedPrompt &&
                  deck &&
                  typeof controller.currentCard?.note === "string" && (
                    <QuickAddNote
                      deck={deck}
                      sourceNoteId={controller.currentCard.note}
                      prompt={selectedPrompt}
                      onClose={closeQuickAdd}
                    />
                  )}
              </>
            )}
          </div>
        </div>
        <LearnViewFooter controller={controller} answer={answerCard} />

        {debouncedFinish && (
          <Modal
            opened={debouncedFinish}
            onClose={() => navigate("/home")}
            showCloseButton={false}
            fullscreen
          >
            <FinishedLearningView
              statistics={controller.statistics}
              time={stopwatchResult}
              deck={deck}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

export default LearnView;
