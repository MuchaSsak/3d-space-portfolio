import { useLingui } from "@lingui/react/macro";

import {
  type AvailableButtonVariants,
  buttonVariants,
} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import {
  AVAILABLE_GRAPHICS_SETTINGS,
  useSettingsContext,
} from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

type GraphicsSettingButtonProps = {
  buttonClassName?: string;
  buttonVariant?: AvailableButtonVariants;
  buttonText?: string;
  sideOffset?: number;
  tabIndex?: number;
};

function GraphicsSettingButton({
  buttonClassName,
  buttonVariant = "secondary",
  buttonText,
  sideOffset,
  tabIndex,
}: GraphicsSettingButtonProps) {
  const { t } = useLingui();
  const {
    graphicsPresetValue,
    graphicsPresetIcon,
    GraphicsPresetLabel,
    dispatch,
  } = useSettingsContext();

  function handleSetGraphicsSettings(newValue: string) {
    dispatch({
      type: "settings/setGraphicsSettings",
      payload: newValue,
    });
    dispatch({ type: "state/save" });
  }

  return (
    <Select value={graphicsPresetValue} onValueChange={handleSetGraphicsSettings}>
      <SelectTrigger
        iconClassName="hidden"
        tabIndex={tabIndex}
        aria-label={buttonText ? undefined : t`Graphics: ${String(GraphicsPresetLabel())}`}
        title={buttonText ? undefined : t`Graphics settings`}
        className={cn(
          buttonVariants({
            variant: buttonVariant,
            size: "icon",
            className: buttonClassName,
          })
        )}
      >
        <span aria-hidden className="font-emoji">{graphicsPresetIcon}</span>
        {buttonText && <span>{buttonText}</span>}
      </SelectTrigger>
      <SelectContent sideOffset={sideOffset} align="center">
        <SelectGroup>
          <SelectLabel>{t`Graphics settings`}</SelectLabel>

          {(
            Object.keys(
              AVAILABLE_GRAPHICS_SETTINGS
            ) as (keyof typeof AVAILABLE_GRAPHICS_SETTINGS)[]
          ).map((graphicsPreset) => {
            const GraphicsPresetLabel =
              AVAILABLE_GRAPHICS_SETTINGS[graphicsPreset].GraphicsPresetLabel;

            return (
              <SelectItem
                key={
                  AVAILABLE_GRAPHICS_SETTINGS[graphicsPreset]
                    .graphicsPresetValue
                }
                value={
                  AVAILABLE_GRAPHICS_SETTINGS[graphicsPreset]
                    .graphicsPresetValue
                }
                className={`justify-end focus-visible:ring-foreground ${
                  AVAILABLE_GRAPHICS_SETTINGS[graphicsPreset]
                    .graphicsPresetValue === graphicsPresetValue
                    ? "bg-[color-mix(in_oklab,var(--color-primary)_50%,transparent)!important]"
                    : undefined
                }`}
              >
                <GraphicsPresetLabel />{" "}
                <span aria-hidden className="font-emoji">
                  {AVAILABLE_GRAPHICS_SETTINGS[graphicsPreset].graphicsPresetIcon}
                </span>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default GraphicsSettingButton;
