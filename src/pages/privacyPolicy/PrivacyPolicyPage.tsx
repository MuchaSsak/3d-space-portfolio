import { useLingui } from "@lingui/react/macro";
import { useEffect } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import type { LanguageValue } from "@/lib/languages";
import { cn } from "@/lib/utils";
import PrivacyPolicyEn from "@/pages/privacyPolicy/content/PrivacyPolicyEn";
import PrivacyPolicyPl from "@/pages/privacyPolicy/content/PrivacyPolicyPl";

const policyByLanguage: Record<LanguageValue, () => React.ReactNode> = {
  en: PrivacyPolicyEn,
  pl: PrivacyPolicyPl,
};

// Native names, so everyone finds their own language
const languageOptions: { value: LanguageValue; label: string }[] = [
  { value: "en", label: "English" },
  { value: "pl", label: "Polski" },
];

const focusRingClassName =
  "rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60";

function PrivacyPolicyPage() {
  const { t } = useLingui();
  const { language, setLanguage } = useLanguage();
  const PrivacyPolicy = policyByLanguage[language];

  useEffect(() => {
    document.title = `${t`Privacy policy`} | Mateusz Muszarski`;
  }, [t, language]);

  // The policy renders after the browser's own jump to the #section of the URL, so jump once it's there
  useEffect(() => {
    const sectionId = decodeURIComponent(window.location.hash.slice(1));
    if (sectionId) document.getElementById(sectionId)?.scrollIntoView();
  }, []);

  return (
    // Printed on white paper, whatever the screen theme
    <div className="min-h-dvh bg-background text-foreground select-text print:[--background:#fff] print:[--foreground:#000] print:[--muted-foreground:#444] print:[--card:#fff] print:[--border:#999]">
      <header className="sticky top-0 z-10 border-b border-foreground/10 bg-background/85 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            href="/"
            className={cn(
              "text-sm text-muted-foreground hover:text-foreground focus-visible:text-foreground transition-colors",
              focusRingClassName
            )}
          >
            <span aria-hidden>← </span>
            {t`Back to the 3D portfolio`}
          </a>

          <div
            role="group"
            aria-label={t`Language`}
            className="flex gap-1 rounded-lg border border-foreground/15 p-0.5"
          >
            {languageOptions.map((languageOption) => (
              <button
                key={languageOption.value}
                type="button"
                lang={languageOption.value}
                aria-pressed={language === languageOption.value}
                onClick={() => setLanguage(languageOption.value)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium transition-colors",
                  focusRingClassName,
                  language === languageOption.value
                    ? "bg-primary/85 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {languageOption.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 pb-[max(3.5rem,env(safe-area-inset-bottom))]">
        <PrivacyPolicy />
      </main>
    </div>
  );
}

export default PrivacyPolicyPage;
