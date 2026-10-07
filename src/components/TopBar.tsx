import { useLingui } from "@lingui/react/macro";

import AudioSettingButton from "@/components/AudioSettingButton";
import CreditsDialogButton from "@/components/CreditsDialogButton";
import GraphicsSettingButton from "@/components/GraphicsSettingButton";
import { DownloadIcon, MailIcon } from "@/components/icons";
import LanguageSettingButton from "@/components/LanguageSettingButton";
import ResetSettingsDialogButton from "@/components/ResetSettingsDialogButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollContext } from "@/contexts/ScrollContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import {
  CONTACT_EMAIL,
  getResumeLink,
  getWebsiteLink,
  GITHUB_AVATAR_LINK,
} from "@/lib/constants";
import { contactFormScrollProgress } from "@/lib/sections";

function TopBar() {
  const { t } = useLingui();
  const { language } = useLanguage();
  const { hasStartedExperience } = useSettingsContext();
  const { goToScrollProgress } = useScrollContext();

  return (
    <header
      // Hidden behind the startup screen until the experience starts
      inert={!hasStartedExperience}
      className="fixed top-0 left-0 w-full pt-[max(0.5rem,env(safe-area-inset-top))] short:pt-[max(0.25rem,env(safe-area-inset-top))] pb-2 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-8 z-40 justify-between flex items-center gap-2 pointer-events-none [&>*]:pointer-events-auto"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Main portfolio link */}
        <a
          target="_blank"
          rel="noopener"
          href={getWebsiteLink(language)}
          className="group flex items-center gap-2 rounded-full pr-2 opacity-85 hover:opacity-100 focus-visible:opacity-100 transition-opacity outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        >
          <Avatar className="size-7 transition-transform group-hover:scale-110">
            <AvatarImage
              width={28}
              height={28}
              src={GITHUB_AVATAR_LINK}
              alt=""
            />
            <AvatarFallback>MM</AvatarFallback>
          </Avatar>
          <span className="flex flex-col leading-tight max-sm:sr-only">
            <span className="text-sm font-bold text-foreground">
              Mateusz Muszarski
            </span>
            <span className="text-xs text-muted-foreground max-sm:hidden">
              {t`Full-stack developer`}
            </span>
          </span>
          <span className="sr-only">{t`(main portfolio, opens in a new tab)`}</span>
        </a>

        {/* Contact email link */}
        <a
          className="text-muted-foreground text-sm hover:text-foreground transition-colors focus-visible:text-foreground hover:underline focus-visible:underline max-lg:hidden ml-2 rounded-sm outline-none"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Calls to action */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 bg-background/50! max-[30rem]:px-2"
        >
          <a href={getResumeLink(language)} target="_blank" rel="noopener" download>
            <DownloadIcon aria-hidden />
            <span>
              <span className="max-[24rem]:sr-only">{t`CV`}</span>
              <span className="sr-only"> {t`(PDF)`}</span>
            </span>
          </a>
        </Button>
        <Button
          size="sm"
          className="h-8 bg-primary/85 hover:bg-primary border border-[color-mix(in_srgb,var(--primary)_70%,var(--foreground))] max-[30rem]:px-2"
          onClick={() => goToScrollProgress(contactFormScrollProgress)}
        >
          <MailIcon aria-hidden className="max-[30rem]:hidden" />
          {t`Hire me`}
        </Button>

        <span className="w-px h-5 bg-foreground/20 mx-1 max-sm:hidden" aria-hidden />

        {/* Settings buttons */}
        <LanguageSettingButton
          buttonClassName="size-8 p-2 text-xs"
          buttonVariant="outline"
        />
        <GraphicsSettingButton
          buttonClassName="size-8 p-2 text-xs"
          buttonVariant="outline"
        />
        <AudioSettingButton
          buttonClassName="size-8 p-2 text-xs"
          buttonVariant="outline"
        />
        <CreditsDialogButton />
        <ResetSettingsDialogButton />
      </div>
    </header>
  );
}

export default TopBar;
