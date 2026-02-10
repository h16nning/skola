import { Checkbox } from "@/components/ui/Checkbox";
import { NumberInput } from "@/components/ui/NumberInput";
import { Switch } from "@/components/ui/Switch";
import { TextInput } from "@/components/ui/TextInput";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { setSetting } from "@/logic/settings/setSetting";
import React, { useEffect, useState } from "react";
import { SettingsValues } from "../../logic/settings/Settings";
import "./SettingsInput.css";

const BASE = "settings-input";

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
  const [setting] = useSetting(settingsKey);

  const [value, setValue] = useState<SettingsValues[typeof settingsKey]>(
    setting !== undefined ? setting : ""
  );
  const [touched, setTouched] = useState(false);

  const [debounced] = useDebouncedValue<SettingsValues[typeof settingsKey]>(
    value,
    250
  );

  useEffect(() => setValue(setting !== undefined ? setting : ""), [setting]);

  useEffect(() => {
    if (touched) {
      setSetting(settingsKey, debounced);
    }
  }, [touched, setting, debounced, settingsKey]);

  switch (inputType) {
    case "text":
      return (
        <div className={BASE}>
          <TextInput
            value={value as string}
            label={label}
            description={description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTouched(true);
              setValue(event.currentTarget.value);
            }}
          />
        </div>
      );
    case "switch":
      return (
        <div className={`${BASE} ${BASE}--switch`}>
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
        </div>
      );
    case "checkbox":
      return (
        <div className={`${BASE} ${BASE}--checkbox`}>
          <Checkbox
            checked={value as boolean | undefined}
            label={label}
            description={description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTouched(true);
              setValue(event.currentTarget.checked);
            }}
          />
        </div>
      );
    case "number":
      return (
        <div className={BASE}>
          <NumberInput
            value={value as number}
            label={label}
            description={description}
            onChange={(e) => {
              setTouched(true);
              setValue(e);
            }}
          />
        </div>
      );
  }
  return <>Input type not found</>;
}
