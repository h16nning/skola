import React from "react";
import {
  Anchor,
  Title,
  Button,
  createStyles,
  Group,
  Modal,
  Stack,
  Text,
  Space,
} from "@mantine/core";
import { Card, CardType } from "../logic/card";

interface DebugCardModalProps {
  opened: boolean;
  setOpened: Function;
  card?: Card<CardType>;
}

function DebugCardModal({ opened, setOpened, card }: DebugCardModalProps) {
  const { classes } = createStyles((theme) => ({
    table: {
      fontSize: theme.fontSizes.xs,
      textAlign: "left",
      "& th": { width: "25%", verticalAlign: "top" },
      "& thead": {
        fontFamily: theme.headings.fontFamily,
        fontSize: theme.fontSizes.sm,
      },
      "& thead th": {
        padding: 0,
        paddingTop: theme.spacing.md,
      },
    },
    title: {
      display: "block",
    },
  }))();
  try {
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      title="Debug"
    >
      <Stack justify="space-between">
        {card ? (
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
              <tr>
                <th>DueDate:</th>
                <td>{card.dueDate?.toLocaleString()}</td>
              </tr>
            </tbody>
            <tbody>
              <thead>
                <th>Model</th>
              </thead>
              <tr>
                <th>Interval:</th>
                <td>{card.model.interval}</td>
              </tr>
              <tr>
                <th>Learned:</th>
                <td>{card.model.learned ? "true" : "false"}</td>
              </tr>
              <tr>
                <th>Repetitions:</th>
                <td>{card.model.repetitions}</td>
              </tr>
              <tr>
                <th>Ease Factor:</th>
                <td>{card.model.easeFactor}</td>
              </tr>
            </tbody>
            <tbody>
              <thead>
                <th>History</th>
              </thead>
              {card.history.map((repetition) => (
                <>
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
                </>
              ))}
            </tbody>
          </table>
        ) : (
          <Text color="dimmed" fz="sm">
            This card could not be found.
          </Text>
        )}
        <Group position="right">
          <Button onClick={() => setOpened(false)}>Close</Button>
        </Group>
      </Stack>
    </Modal>
  )} catch (e) {
    console.error(e);
    return <Text c="red" fw="700" fz="sm">Faulty cart</Text>;
  }
}

export default DebugCardModal;
