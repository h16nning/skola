import React, { useEffect, useState } from "react";
import { setSetting, SettingsValues, useSetting } from "../../logic/Settings";
import { SettingStatus, StatusIndicator } from "./SettingStatus";
import { useDebouncedValue } from "@mantine/hooks";
import { Checkbox, Group, Switch, TextInput } from "@mantine/core";

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

  const [value, setValue] =
    useState<SettingsValues[typeof settingsKey]>(setting);
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
  useEffect(() => setValue(setting), [setting]);

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
        <Group align="start" noWrap spacing="xs" position="apart">
          <Switch
            checked={value as boolean | undefined}
            label={label}
            description={description}
            labelPosition="left"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTouched(true);
              setValue(event.currentTarget.checked);
            }}
          ></Switch>
          <StatusIndicator status={status} />
        </Group>
      );
    case "checkbox":
      return (
        <Group align="start" noWrap spacing="xs" position="apart">
          <Checkbox
            checked={value as boolean | undefined}
            label={label}
            description={description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTouched(true);
              setValue(event.currentTarget.checked);
            }}
          ></Checkbox>
          <StatusIndicator status={status} />
        </Group>
      );
  }
  return <>Input type not found</>;
}
