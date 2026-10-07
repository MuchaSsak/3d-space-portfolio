import { useLingui } from "@lingui/react/macro";
import { useId } from "react";

import { type AvailableButtonVariants, Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

type AudioSettingButtonProps = {
  buttonClassName?: string;
  buttonVariant?: AvailableButtonVariants;
  buttonText?: string;
  sideOffset?: number;
  tabIndex?: number;
};

function AudioSettingButton({
  buttonClassName,
  buttonVariant = "secondary",
  buttonText,
  sideOffset,
  tabIndex,
}: AudioSettingButtonProps) {
  const { t } = useLingui();
  const { dispatch, isAudioEnabled, audioVolume } = useSettingsContext();
  const idSuffix = useId();

  function handleSetIsAudioEnabled() {
    dispatch({ type: "settings/setIsAudioEnabled", payload: !isAudioEnabled });
    dispatch({ type: "state/save" });
  }

  function handleSetAudioVolume(newVolume: number) {
    dispatch({ type: "settings/setAudioVolume", payload: newVolume });
    dispatch({ type: "state/save" });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          tabIndex={tabIndex}
          variant={buttonVariant}
          className={buttonClassName}
          aria-label={buttonText ? undefined : t`Audio settings`}
          title={buttonText ? undefined : t`Audio settings`}
        >
          <span aria-hidden className="font-emoji">
            {(!isAudioEnabled || audioVolume === 0) && "🔇"}
            {isAudioEnabled && audioVolume > 0 && audioVolume < 0.5 && "🔉"}
            {isAudioEnabled && audioVolume >= 0.5 && "🔊"}
          </span>
          {buttonText && <span>{buttonText}</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent sideOffset={sideOffset} className="text-sm">
        {/* Label */}
        <p className="text-muted-foreground text-xs">{t`Audio settings`}</p>

        {/* Enable sounds checkbox */}
        <div className="flex items-center gap-2 py-2">
          <Checkbox
            checked={isAudioEnabled}
            onCheckedChange={handleSetIsAudioEnabled}
            id={`enable-sounds-checkbox${idSuffix}`}
          />
          <label htmlFor={`enable-sounds-checkbox${idSuffix}`}>{t`Enable sounds`}</label>
        </div>

        {/* Volume slider */}
        <span id={`volume-label${idSuffix}`}>
          {t`Volume`} <span aria-hidden className="font-emoji">🔊</span>
        </span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs transition-opacity",
              isAudioEnabled ? "opacity-100" : "opacity-50"
            )}
          >
            {Math.round(audioVolume * 100)}%
          </span>
          <Slider
            onValueChange={([newValue]) => handleSetAudioVolume(newValue)}
            value={[audioVolume]}
            thumbAriaLabel={t`Volume`}
            min={0}
            step={0.01}
            max={1}
            disabled={!isAudioEnabled}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AudioSettingButton;
