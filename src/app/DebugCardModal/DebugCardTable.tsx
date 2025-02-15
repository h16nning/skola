import { NoteType } from "@/logic/note/note";
import { Anchor, Space, Stack, Text } from "@mantine/core";
import { Rating, State } from "fsrs.js";
import { Fragment } from "react";
import { Card } from "../../logic/card/card";
import classes from "./DebugCard.module.css";

export default function DebugCardTable({
  card,
}: { card: Card<NoteType> | undefined }) {
  return card ? (
    <Stack className={classes.container}>
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
            <th>Custom Order:</th>
            <td>{card.customOrder}</td>
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
      </table>
      <table className={classes.table}>
        <thead>
          <th>FSRS Model</th>
        </thead>
        <tbody>
          <tr>
            <th>Due:</th>
            <td>
              {card.model.due.toLocaleDateString()},
              {card.model.due.toLocaleTimeString()}
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
            <td>
              {card.model.last_review.toLocaleDateString()},
              {card.model.last_review.toLocaleTimeString()}
            </td>
          </tr>
        </tbody>
      </table>
      <table className={classes.table}>
        <thead>
          <th>History</th>
        </thead>
        <tbody>
          {card.history.length}
          {card.history.map((log) => (
            <Fragment key={log.review.toISOString()}>
              <tr>
                <th>Date: </th>
                <td>
                  {log.review.toLocaleDateString()},
                  {log.review.toLocaleTimeString()}
                </td>
              </tr>
              <tr>
                <th>Result: </th>
                <td>
                  {Rating[log.rating]} ({log.rating})
                </td>
              </tr>
              <tr>
                <th>State: </th>
                <td>
                  {State[log.state]} ({log.state})
                </td>
              </tr>
              <tr>
                <th>Elapsed Days: </th>
                <td>{log.elapsed_days}</td>
              </tr>
              <tr>
                <th>Scheduled Days: </th>
                <td>{log.scheduled_days}</td>
              </tr>
              <tr>
                <Space h="xs" />
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </Stack>
  ) : (
    <Text color="dimmed" fz="sm">
      This card could not be found.
    </Text>
  );
}
