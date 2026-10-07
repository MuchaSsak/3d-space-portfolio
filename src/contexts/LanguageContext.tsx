import React, { createContext, useContext, useEffect, useState } from "react";

import { AVAILABLE_LANGUAGES, i18n, type LanguageValue } from "@/lib/languages";

/**
 * Types
 */
type LanguageContext = {
  language: LanguageValue;
  setLanguage: React.Dispatch<React.SetStateAction<LanguageValue>>;
};

const languageLocalStorageKey = "language";

function isAvailableLanguage(value: unknown): value is LanguageValue {
  return AVAILABLE_LANGUAGES.some(
    (availableLanguage) => availableLanguage.value === value
  );
}

// Detect the user's browser language and check if it's supported in the list. If not, pick English
function getBrowserLanguage(): LanguageValue {
  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const browserLanguage of browserLanguages) {
    const browserLanguageValue = browserLanguage?.split("-")[0];
    if (isAvailableLanguage(browserLanguageValue)) return browserLanguageValue;
  }

  return "en";
}

function getInitialLanguage(): LanguageValue {
  try {
    const savedLanguage = JSON.parse(
      localStorage.getItem(languageLocalStorageKey) ?? "null"
    );
    if (isAvailableLanguage(savedLanguage)) return savedLanguage;
  } catch {
    // Ignore unavailable storage or corrupted values
  }

  return getBrowserLanguage();
}

// Activate the language synchronously so the first render is already translated
const initialLanguage = getInitialLanguage();
i18n.activate(initialLanguage);

export const LanguageContext = createContext<LanguageContext>({
  language: initialLanguage,
  setLanguage: () => {},
});

/**
 * Provider
 */
export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<LanguageValue>(initialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(languageLocalStorageKey, JSON.stringify(language));
    } catch {
      // The language simply isn't remembered when storage is unavailable
    }

    // Update language for i18n client and assistive technologies
    if (i18n.locale !== language) i18n.activate(language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined)
    throw new Error("useLanguage was used outside of LanguageContextProvider!");
  return context;
}
