import {
  MantineSpacing,
  Stack,
  StyleProp,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { TablerIconsProps as IconProps } from "@tabler/icons-react";
import { t } from "i18next";

interface EmptyNoticeProps {
  icon: React.FC<IconProps>;
  title?: string;
  description?: string;
  p?: StyleProp<MantineSpacing>;
  hideTitle?: boolean;
}

function EmptyNotice({
  icon: Icon,
  description,
  title,
  p,
  hideTitle,
}: EmptyNoticeProps) {
  return (
    <Stack gap="0" align="center" p={p}>
      <ThemeIcon variant="white" c="dimmed" size="lg" mb="xs">
        <Icon size={60} />
      </ThemeIcon>
      {hideTitle || (
        <Text fz="md" fw={500}>
          {title || t("global.no-items-title")}
        </Text>
      )}
      <Text fz="sm" c="dimmed">
        {description}
      </Text>
    </Stack>
  );
}

export default EmptyNotice;
