import { Loader } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

export enum SettingStatus {
  NONE,
  LOADING,
  SUCCESS,
  FAILED,
}

export function StatusIndicator({ status }: { status: SettingStatus }) {
  switch (status) {
    case SettingStatus.NONE:
      return null;
    case SettingStatus.LOADING:
      return <Loader size="xs" />;
    case SettingStatus.SUCCESS:
      return <IconCheck color="green" />;
    case SettingStatus.FAILED:
      return <IconX color="red" />;
  }
}
