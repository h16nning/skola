import classes from "./DebugCard.module.css";
import { Fragment } from "react";
import { Card, CardType } from "../../logic/card";
import { Anchor, Space, Text } from "@mantine/core";

export default function DebugCardTable({
  card,
}: { card: Card<CardType> | undefined }) {
  return card ? (
    <table className={classes.table}>
      <tbody>
        <tr>
          <th>Card Type:</th>
          <td>{card.content.type}</td>
        </tr>
        <tr>
          <th>ID:</th>
          <td>{card.id}</td>
        </tr>
        <tr>
          <th>Content:</th>
          <td>{JSON.stringify(card.content)}</td>
        </tr>
        <tr>
          <th>Decks:</th>
          <td>
            <Anchor href={"/deck/" + card.deck}>{card.deck}</Anchor>,{" "}
          </td>
        </tr>
      </tbody>
      <tbody>
        <thead>
          <th>FSRS Model</th>
        </thead>
        <tr>
          <th>Due:</th>
          <td>
            {card.model.due.toLocaleTimeString() +
              " " +
              card.model.due.toDateString()}
          </td>
        </tr>
        <tr>
          <th>Stability:</th>
          <td>{card.model.stability}</td>
        </tr>
        <tr>
          <th>Difficulty:</th>
          <td>{card.model.difficulty}</td>
        </tr>
        <tr>
          <th>Elapsed Days:</th>
          <td>{card.model.elapsed_days}</td>
        </tr>
        <tr>
          <th>Scheduled Days:</th>
          <td>{card.model.scheduled_days}</td>
        </tr>
        <tr>
          <th>Repetitions:</th>
          <td>{card.model.reps}</td>
        </tr>
        <tr>
          <th>Lapses:</th>
          <td>{card.model.lapses}</td>
        </tr>
        <tr>
          <th>State:</th>
          <td>{card.model.state}</td>
        </tr>
        <tr>
          <th>Last Review:</th>
          <td>{card.model.last_review.toDateString()}</td>
        </tr>
      </tbody>
      <tbody>
        <thead>
          <th>History</th>
        </thead>
        {card.history.map((repetition) => (
          <Fragment key={repetition.date.toISOString()}>
            <tr>
              <th>Date: </th>
              <td>
                {(typeof repetition.date === "number"
                  ? new Date(repetition.date)
                  : repetition.date
                ).toLocaleString()}
              </td>
            </tr>
            <tr>
              <th>Result: </th>
              <td>{repetition.result}</td>
            </tr>
            <tr>
              <Space h="xs" />
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  ) : (
    <Text color="dimmed" fz="sm">
      This card could not be found.
    </Text>
  );
}
