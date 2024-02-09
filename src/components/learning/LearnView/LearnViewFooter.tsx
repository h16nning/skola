import { Button, Group } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import AnswerCardButton from "../../../logic/AnswerCardButton";
import { LearnController } from "../../../logic/learn";
import classes from "./LearnView.module.css";
import { Rating } from "fsrs.js";

interface LearnViewFooterProps {
  controller: LearnController;
  answer: Function;
  showingAnswer: boolean;
  setShowingAnswer: Function;
}
function LearnViewFooter({
  controller,
  answer,
  showingAnswer,
  setShowingAnswer,
}: LearnViewFooterProps) {
  useHotkeys(
    !controller.isFinished
      ? [
          ["1", () => answer(Rating.Again)],
          ["2", () => answer(Rating.Hard)],
          ["3", () => answer(Rating.Good)],
          ["4", () => answer(Rating.Easy)],
          [
            "Space",
            () =>
              !showingAnswer ? setShowingAnswer(true) : answer(Rating.Good),
          ],
          [
            "Enter",
            () =>
              !showingAnswer ? setShowingAnswer(true) : answer(Rating.Good),
          ],
        ]
      : []
  );

  return (
    <Group className={classes.footerContainer} justify="center">
      {showingAnswer ? (
        <Group gap="xs" wrap="nowrap" justify="center" w="100%" maw="25rem">
          <AnswerCardButton
            label="Again"
            timeInfo={
              (controller.currentCardRepeatInfo &&
                controller.currentCardRepeatInfo[
                  Rating.Again
                ]?.card.due.toDateString()) ??
              ""
            }
            color="red"
            action={() => answer(Rating.Again)}
          />
          <AnswerCardButton
            label="Hard"
            timeInfo={
              (controller.currentCardRepeatInfo &&
                controller.currentCardRepeatInfo[
                  Rating.Hard
                ]?.card.due.toDateString()) ??
              ""
            }
            color="yellow"
            action={() => answer(Rating.Hard)}
          />
          <AnswerCardButton
            label="Good"
            timeInfo={
              (controller.currentCardRepeatInfo &&
                controller.currentCardRepeatInfo[
                  Rating.Good
                ]?.card.due.toDateString()) ??
              ""
            }
            color="green"
            action={() => answer(Rating.Good)}
          />
          <AnswerCardButton
            label="Easy"
            timeInfo={
              (controller.currentCardRepeatInfo &&
                controller.currentCardRepeatInfo[
                  Rating.Easy
                ]?.card.due.toDateString()) ??
              ""
            }
            color="blue"
            action={() => answer(Rating.Easy)}
          />
        </Group>
      ) : (
        <Button onClick={() => setShowingAnswer(true)} h="2.5rem">
          Show Answer
        </Button>
      )}
    </Group>
  );
}

export default LearnViewFooter;

/**/
