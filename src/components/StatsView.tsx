import { Center, Text, Title } from "@mantine/core";
import { AppHeaderContent } from "./Header/Header";

function StatsView() {
  return (
    <Text>
      <AppHeaderContent>
        <Center>
          <Title order={3}>Statistics</Title>
        </Center>
      </AppHeaderContent>
      The statistics view is under development.
    </Text>
  );
}

export default StatsView;
