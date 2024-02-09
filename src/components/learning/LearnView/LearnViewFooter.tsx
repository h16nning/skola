import { Button, Group } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import AnswerCardButton from "./AnswerCardButton";
import { LearnController } from "../../../logic/learn";
import classes from "./LearnView.module.css";
import { Rating } from "fsrs.js";

interface LearnViewFooterProps {
  controller: LearnController;
  answer: Function;
}
function LearnViewFooter({ controller, answer }: LearnViewFooterProps) {
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
              !controller.showingAnswer
                ? controller.showAnswer()
                : answer(Rating.Good),
          ],
          [
            "Enter",
            () =>
              !controller.showingAnswer
                ? controller.showAnswer()
                : answer(Rating.Good),
          ],
        ]
      : []
  );

  return (
    <Group className={classes.footerContainer} justify="center">
      {controller.showingAnswer ? (
        <Group gap="xs" wrap="nowrap" justify="center" w="100%" maw="25rem">
          <AnswerCardButton
            label="Again"
            timeInfo={
              (controller.currentCardRepeatInfo &&
                controller.currentCardRepeatInfo[
                  Rating.Again
                ]?.card.due.toLocaleDateString()) ??
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
                ]?.card.due.toLocaleDateString()) ??
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
                ]?.card.due.toLocaleDateString()) ??
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
                ]?.card.due.toLocaleDateString()) ??
              ""
            }
            color="cyan"
            action={() => answer(Rating.Easy)}
          />
        </Group>
      ) : (
        <Button onClick={controller.showAnswer} h="2.5rem">
          Show Answer
        </Button>
      )}
    </Group>
  );
}

export default LearnViewFooter;

/**/
