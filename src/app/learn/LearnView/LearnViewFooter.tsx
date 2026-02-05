import { Button, Group } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { Rating } from "fsrs.js";
import { t } from "i18next";
import i18n from "../../../i18n";
import { LearnController } from "../../../logic/learn";
import { useSetting } from "../../../logic/settings/hooks/useSetting";
import AnswerCardButton from "./AnswerCardButton";
import classes from "./LearnView.module.css";

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const MINUTE_IN_MILLISECONDS = 1000 * 60;
interface LearnViewFooterProps {
  controller: LearnController;
  answer: Function;
}

function timeStringForRating(rating: Rating, controller: LearnController) {
  if (!controller.currentCardRepeatInfo) {
    return "";
  }
  const rtf = new Intl.RelativeTimeFormat(i18n.language, {
    style: "short",
    numeric: "auto",
  });

  const timeDifference =
    controller.currentCardRepeatInfo[rating]?.card.due.getTime() - Date.now();
  if (timeDifference >= DAY_IN_MILLISECONDS * 30) {
    return rtf.format(
      Math.round(timeDifference / (DAY_IN_MILLISECONDS * 30)),
      "month"
    );
  } else if (timeDifference >= DAY_IN_MILLISECONDS * 0.9) {
    return rtf.format(Math.round(timeDifference / DAY_IN_MILLISECONDS), "day");
  } else {
    return (
      "~ " +
      rtf.format(Math.round(timeDifference / MINUTE_IN_MILLISECONDS), "minute")
    );
  }
}

function LearnViewFooter({ controller, answer }: LearnViewFooterProps) {
  const [enableHardAndEasy] = useSetting("learn_enableHardAndEasy");

  const baseHotkeys: [string, () => void][] = [
    ["1", () => answer(Rating.Again)],
    ["3", () => answer(Rating.Good)],
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
  ];

  const hardAndEasyHotkeys: [string, () => void][] = enableHardAndEasy
    ? [
        ["2", () => answer(Rating.Hard)],
        ["4", () => answer(Rating.Easy)],
      ]
    : [];

  useHotkeys(!controller.isFinished ? [...baseHotkeys, ...hardAndEasyHotkeys] : []);

  return (
    <Group className={classes.footerContainer} justify="center">
      {controller.showingAnswer ? (
        <Group gap="xs" wrap="nowrap" justify="center" w="100%" maw="25rem">
          <AnswerCardButton
            label={t("learning.rate-again")}
            timeInfo={timeStringForRating(Rating.Again, controller)}
            color="red"
            action={() => answer(Rating.Again)}
          />
          {enableHardAndEasy && (
            <AnswerCardButton
              label={t("learning.rate-hard")}
              timeInfo={timeStringForRating(Rating.Hard, controller)}
              color="yellow"
              action={() => answer(Rating.Hard)}
            />
          )}
          <AnswerCardButton
            label={t("learning.rate-good")}
            timeInfo={timeStringForRating(Rating.Good, controller)}
            color="green"
            action={() => answer(Rating.Good)}
          />
          {enableHardAndEasy && (
            <AnswerCardButton
              label={t("learning.rate-easy")}
              timeInfo={timeStringForRating(Rating.Easy, controller)}
              color="blue"
              action={() => answer(Rating.Easy)}
            />
          )}
        </Group>
      ) : (
        <Button onClick={controller.showAnswer} h="2.5rem" variant="light">
          {t("learning.show-answer")}
        </Button>
      )}
    </Group>
  );
}

export default LearnViewFooter;

/**/
