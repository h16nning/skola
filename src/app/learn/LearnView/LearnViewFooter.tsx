import { Button } from "@/components/ui/Button";
import { Group } from "@/components/ui/Group";
import i18n from "@/i18n";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { LearnController } from "@/logic/learn";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { Rating } from "fsrs.js";
import { t } from "i18next";
import AnswerCardButton from "./AnswerCardButton";
import "./LearnViewFooter.css";

const BASE = "learn-view-footer";

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
  const [enableHardAndEasy] = useSetting("#learn_enableHardAndEasy");

  const baseHotkeys: [string, () => void][] = [
    ["1", () => controller.showingAnswer && answer(Rating.Again)],
    ["3", () => controller.showingAnswer && answer(Rating.Good)],
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
        ["2", () => controller.showingAnswer && answer(Rating.Hard)],
        ["4", () => controller.showingAnswer && answer(Rating.Easy)],
      ]
    : [];

  useHotkeys(
    !controller.isFinished ? [...baseHotkeys, ...hardAndEasyHotkeys] : []
  );

  return (
    <Group className={BASE} justify="center">
      {controller.showingAnswer ? (
        <div className={BASE + "__buttons"}>
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
        </div>
      ) : (
        <Button
          onClick={controller.showAnswer}
          style={{ height: "2.5rem" }}
          variant="primary"
        >
          {t("learning.show-answer")}
        </Button>
      )}
    </Group>
  );
}

export default LearnViewFooter;
