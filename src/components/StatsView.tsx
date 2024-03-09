import { BarChart, DonutChart } from "@mantine/charts";
import { Center, SegmentedControl, Stack, Title } from "@mantine/core";
import { State } from "fsrs.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../logic/db";
import { AppHeaderContent } from "./Header/Header";
import { getDeck, useDecks } from "../logic/deck";
import { getAllCards, getCardsOf, getSimplifiedStatesOf } from "../logic/card";
import SelectDecksHeader from "./custom/SelectDecksHeader";

function StatsView() {
  const [decks] = useDecks();
  const navigate = useNavigate();

  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">(
    "month"
  );
  const deckId = useParams().deckId;

  const [reviewData, setReviewData] = useState<
    {
      day: string;
      [State.Review]: number;
      [State.Learning]: number;
      [State.New]: number;
    }[]
  >([]);

  useEffect(() => {
    loadStatistics();
    async function loadStatistics() {
      const temporaryArray = [];
      const now = new Date();
      const days = timeFrame === "week" ? 7 : timeFrame === "month" ? 30 : 365;

      for (let i = 0; i < days; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const formattedDate = date.toISOString().split("T")[0];

        const dbquery = deckId
          ? db.statistics.where({ deck: deckId, day: formattedDate })
          : db.statistics.where("day").equals(formattedDate);
        const stats = await dbquery.toArray();

        temporaryArray.push({
          day: formattedDate,
          [State.Review]: stats?.reduce(
            (acc, stat) => acc + stat.cards[State.Review],
            0
          ),
          [State.Learning]: stats?.reduce(
            (acc, stat) =>
              acc + stat.cards[State.Learning] + stat.cards[State.Relearning],
            0
          ),
          [State.New]: stats?.reduce(
            (acc, stat) => acc + stat.cards[State.New],
            0
          ),
        });
      }
      setReviewData(await Promise.all(temporaryArray));
    }
  }, [timeFrame, deckId]);

  const [cardStateData, setCardStateData] = useState<
    { name: string; value: number; color: string }[]
  >([]);

  useEffect(() => {
    loadCardStateData();
    async function loadCardStateData() {
      const cards = await (deckId
        ? getDeck(deckId).then((deck) => getCardsOf(deck))
        : getAllCards());
      const simplifiedStateData = getSimplifiedStatesOf(cards ?? []);
      setCardStateData([
        {
          name: "New",
          value: simplifiedStateData.new,
          color: "grape.6",
        },
        {
          name: "Learning",
          value: simplifiedStateData.learning,
          color: "orange.6",
        },
        {
          name: "Review",
          value: simplifiedStateData.review,
          color: "blue.6",
        },
        {
          name: "Not Due",
          value: simplifiedStateData.notDue,
          color: "gray.6",
        },
      ]);
    }
  }, [deckId]);

  return (
    <>
      <AppHeaderContent>
        <Center>
          <Title order={3}>Statistics</Title>
        </Center>
      </AppHeaderContent>

      <Stack w="100%" maw="600px" gap="xl">
        <SelectDecksHeader
          label="Showing Statistics of"
          decks={decks}
          onSelect={(deckId) => navigate(`/stats/${deckId}`)}
        />

        <Stack gap="xs">
          <SegmentedControl
            data={[
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "year", label: "Year" },
            ]}
            size="xs"
            value={timeFrame}
            onChange={(value) =>
              setTimeFrame(value as "week" | "month" | "year")
            }
          />
          <BarChart
            h={500}
            data={reviewData}
            dataKey="day"
            type="stacked"
            withLegend
            xAxisProps={{
              reversed: true,
            }}
            series={[
              {
                name: State.Review.toString(),
                label: "Review",
                color: "blue.6",
              },
              {
                name: State.Learning.toString(),
                label: "Learning",
                color: "orange.6",
              },
              { name: State.New.toString(), label: "New", color: "grape.6" },
            ]}
            tickLine="y"
          />
        </Stack>
        <DonutChart
          size={160}
          data={cardStateData}
          withLabels
          tooltipDataSource="segment"
        />
      </Stack>
    </>
  );
}

export default StatsView;
