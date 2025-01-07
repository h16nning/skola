import { Center, Flex, Modal, Paper } from "@mantine/core";
import { useDebouncedValue, useFullscreen } from "@mantine/hooks";
import { Rating } from "fsrs.js";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardSorts } from "../../../logic/CardSorting";
import { useSetting } from "../../../logic/Settings";
import { getUtils } from "../../../logic/TypeManager";
import { getCardsOf } from "../../../logic/card";
import { useDeckFromUrl } from "../../../logic/deck";
import { useLearning } from "../../../logic/learn";
import { useNote } from "../../../logic/note";
import { AppHeaderContent } from "../../Header/Header";
import MissingObject from "../../custom/MissingObject";
import { generalFail } from "../../custom/Notification/Notification";
import FinishedLearningView from "../FinishedLearningView/FinishedLearningView";
import LearnViewCurrentCardStateIndicator from "../LearnViewCurrentCardStateIndicator/LearnViewCurrentCardStateIndicator";
import classes from "./LearnView.module.css";
import LearnViewFooter from "./LearnViewFooter";
import LearnViewHeader, { stopwatchResult } from "./LearnViewHeader";
import VisualFeedback from "./VisualFeedback";

function LearnView() {
    const { toggle } = useFullscreen();
    const [zenMode] = useSetting("useZenMode");
    const [useVisualFeedback] = useSetting("useVisualFeedback");

    const navigate = useNavigate();
    const [deck, isReady, params] = useDeckFromUrl();

    const [newToReviewRatio] = useSetting("learn_newToReviewRatio");
    const controller = useLearning(
        {
            querier: () => getCardsOf(deck),
            dependencies: [deck],
        },
        {
            learnAll: params === "all",
            newToReviewRatio: newToReviewRatio,
            sort: CardSorts.byCreationDate(1),
        }
    );

    const cardContent = useNote(controller.currentCard?.note ?? "")?.content;

    const [currentRating, setCurrentRating] = useState<Rating | null>(null);

    //ZEN MODE
    useEffect(() => {
        if (zenMode) {
            toggle();
        }
        return () => {
            if (zenMode) {
                toggle();
            }
        };
    }, []);

    const [debouncedFinish] = useDebouncedValue(controller.isFinished, 50);

    const answerButtonPressed = useCallback(
        async (rating: Rating) => {
            try {
                controller.answerCard(rating);
                controller.requestNextCard();
                setCurrentRating(rating);
                setTimeout(() => setCurrentRating(null), 150);
            } catch (error) {
                generalFail();
                console.log(error);
            }
        },
        [controller]
    );

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
                <Center className={classes.cardContainer}>
                    <Paper className={classes.card}>
                        <LearnViewCurrentCardStateIndicator
                            currentCardModel={controller.currentCard?.model}
                        />
                        {!controller.showingAnswer &&
                            controller.currentCard &&
                            getUtils(controller.currentCard).displayQuestion(
                                controller.currentCard,
                                cardContent
                            )}
                        {controller.showingAnswer &&
                            controller.currentCard &&
                            getUtils(controller.currentCard).displayAnswer(
                                controller.currentCard,
                                cardContent
                            )}
                    </Paper>
                </Center>
                <LearnViewFooter
                    controller={controller}
                    answer={answerButtonPressed}
                />

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
