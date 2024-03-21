import { AreaChart } from "@mantine/charts";
import React, { useMemo } from "react";
import { Card, NoteType } from "../../logic/card";

interface CardHistoryProps {
  card?: Card<NoteType>;
}

export default function CardHistory({ card }: CardHistoryProps) {
  const data = useMemo(() => {
    if (card) {
      return card.history.map((h) => {
        return {
          date: h.review.getTime(),
          rating: h.rating,
        };
      });
    }
    return [];
  }, [card]);

  return (
    <AreaChart
      h={300}
      data={data}
      series={[{ name: "rating", color: "forest" }]}
      dataKey="date"
      curveType="monotone"
      withTooltip={true}
      gridAxis="x"
      yAxisProps={{
        domain: [1, 4],
        tickCount: 4,
        tickFormatter: (value) => {
          switch (value) {
            case 1:
              return "Again";
            case 2:
              return "Hard";
            case 3:
              return "Good";
            case 4:
              return "Easy";
          }
          return "";
        },
      }}
      xAxisProps={{
        domain: ["dataMin", new Date(Date.now()).getTime()],
        scale: "linear",
        tickFormatter: (value) => new Date(value).toLocaleDateString(),
      }}
      connectNulls
    />
  );
}
