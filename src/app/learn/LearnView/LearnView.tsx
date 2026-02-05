import { AppHeaderContent } from "@/app/shell/Header/Header";
import MissingObject from "@/components/MissingObject";
import { useDeckFromUrl } from "@/logic/deck/hooks/useDeckFromUrl";
import { useNote } from "@/logic/note/hooks/useNote";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { Center, Flex, Modal, Paper, Stack } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FinishedLearningView from "../FinishedLearningView/FinishedLearningView";
import LearnViewCurrentCardStateIndicator from "../LearnViewCurrentCardStateIndicator/LearnViewCurrentCardStateIndicator";
import CognitivePromptConnector from "./CognitivePromptConnector";
import classes from "./LearnView.module.css";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader, { stopwatchResult } from "./LearnViewHeader";
import QuickAddNote from "./QuickAddNote";
import { useLearnSession } from "./useLearnSession";
import VisualFeedback from "./VisualFeedback";

function LearnView() {
  const [useVisualFeedback] = useSetting("useVisualFeedback");
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
    <div className={classes.learnView}>
      <AppHeaderContent>
        <LearnViewHeader
          currentCard={controller.currentCard ?? undefined}
          controller={controller}
          deck={deck}
        />
      </AppHeaderContent>

      <Flex
        direction="column"
        justify="space-between"
        h="100%"
        w="100%"
        className={classes.learnViewWrapper}
      >
        {useVisualFeedback && <VisualFeedback rating={currentRating} />}
        <Center className={classes.cardContainer} h="100%">
          <Stack w="100%" align="center" gap={0}>
            <Paper className={classes.card}>
              <LearnViewCurrentCardStateIndicator
                currentCardModel={controller.currentCard?.model}
              />
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
            {controller.showingAnswer && (
              <>
                {showPrompts && (
                  <CognitivePromptConnector
                    onToggle={togglePrompt}
                    selectedPrompt={selectedPrompt}
                  />
                )}
                {selectedPrompt && deck && (
                  <QuickAddNote
                    deck={deck}
                    prompt={selectedPrompt}
                    onClose={closeQuickAdd}
                  />
                )}
              </>
            )}
          </Stack>
        </Center>
        <LearnViewFooter controller={controller} answer={answerCard} />

        <Modal
          opened={debouncedFinish}
          onClose={() => navigate("/home")}
          fullScreen
          closeOnClickOutside={false}
          closeOnEscape={false}
          withCloseButton={false}
          transitionProps={{ transition: "fade" }}
        >
          <FinishedLearningView
            statistics={controller.statistics}
            time={stopwatchResult}
            deckId={deck?.id}
          />
        </Modal>
      </Flex>
    </div>
  );
}

export default LearnView;
