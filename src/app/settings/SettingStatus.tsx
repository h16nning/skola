import { Spinner } from "@/components/ui/Spinner";
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
      return <Spinner size="xs" />;
    case SettingStatus.SUCCESS:
      return <IconCheck size={16} color="green" />;
    case SettingStatus.FAILED:
      return <IconX size={16} color="red" />;
  }
}
