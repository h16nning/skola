import { useSetting } from "@/logic/settings/hooks/useSetting";
import { setSetting } from "@/logic/settings/setSetting";
import { Checkbox, Group, NumberInput, Switch, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { SettingsValues } from "../../logic/settings/Settings";
import { SettingStatus, StatusIndicator } from "./SettingStatus";

interface SettingsInputProps {
  label: string | React.ReactNode;
  description?: JSX.Element | string;
  settingsKey: keyof SettingsValues;
  inputType: "text" | "number" | "switch" | "checkbox";
}

export default function SettingsInput({
  label,
  description,
  inputType,
  settingsKey,
}: SettingsInputProps) {
  const [status, setStatus] = useState(SettingStatus.NONE);
  const [setting] = useSetting(settingsKey);

  const [value, setValue] = useState<SettingsValues[typeof settingsKey]>(
    setting !== undefined ? setting : ""
  );
  const [touched, setTouched] = useState(false);

  const [debounced] = useDebouncedValue<SettingsValues[typeof settingsKey]>(
    value,
    250
  );
  useEffect(() => {
    if (touched) {
      setStatus(SettingStatus.LOADING);
    }
  }, [touched, value]);
  useEffect(() => setValue(setting !== undefined ? setting : ""), [setting]);

  useEffect(() => {
    if (touched) {
      setStatus(SettingStatus.LOADING);
      setSetting(settingsKey, debounced)
        .then(() => setStatus(SettingStatus.SUCCESS))
        .catch(() => setStatus(SettingStatus.FAILED));
    }
  }, [touched, setting, debounced, settingsKey]);

  switch (inputType) {
    case "text":
      return (
        <TextInput
          value={value as string}
          label={label}
          description={description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTouched(true);
            setValue(event.currentTarget.value);
          }}
          rightSection={<StatusIndicator status={status} />}
        ></TextInput>
      );
    case "switch":
      return (
        <Group align="start" wrap="nowrap" gap="xs" justify="space-between">
          <Switch
            checked={value as boolean | undefined}
            label={label}
            description={description}
            labelPosition="left"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTouched(true);
              setValue(event.currentTarget.checked);
            }}
          />
          <StatusIndicator status={status} />
        </Group>
      );
    case "checkbox":
      return (
        <Group align="start" wrap="nowrap" gap="xs" justify="space-between">
          <Checkbox
            checked={value as boolean | undefined}
            label={label}
            description={description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTouched(true);
              setValue(event.currentTarget.checked);
            }}
          />
          <StatusIndicator status={status} />
        </Group>
      );
    case "number":
      return (
        <NumberInput
          value={value as number}
          label={label}
          description={description}
          onChange={(e) => {
            setTouched(true);
            setValue(e);
          }}
          rightSection={<StatusIndicator status={status} />}
        />
      );
  }
  return <>Input type not found</>;
}
