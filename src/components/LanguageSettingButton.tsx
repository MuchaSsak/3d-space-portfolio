import { useLingui } from "@lingui/react/macro";

import { type AvailableButtonVariants, Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AVAILABLE_LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/utils";

type LanguageSettingButtonProps = {
  buttonClassName?: string;
  buttonVariant?: AvailableButtonVariants;
  buttonText?: string;
  sideOffset?: number;
  tabIndex?: number;
};

function LanguageSettingButton({
  buttonClassName,
  buttonVariant = "secondary",
  buttonText,
  sideOffset,
  tabIndex,
}: LanguageSettingButtonProps) {
  const { t } = useLingui();
  const { language, setLanguage } = useLanguage();
  const currentLanguage = AVAILABLE_LANGUAGES.find(
    (availableLanguage) => availableLanguage.value === language
  )!;

  return (
    <Combobox
      value={language}
      setValue={setLanguage}
      items={AVAILABLE_LANGUAGES}
      iconClassName="font-emoji"
      placeholderLabel={t`language`}
      align="start"
      sideOffset={sideOffset}
    >
      <Button
        variant={buttonVariant}
        size="icon"
        className={cn("font-emoji", buttonClassName)}
        tabIndex={tabIndex}
        aria-label={buttonText ? undefined : t`Language: ${currentLanguage.label}`}
        title={buttonText ? undefined : t`Language`}
      >
        <span aria-hidden className="font-emoji">
          {currentLanguage.Icon}
        </span>
        {buttonText && <span>{buttonText}</span>}
      </Button>
    </Combobox>
  );
}

export default LanguageSettingButton;
