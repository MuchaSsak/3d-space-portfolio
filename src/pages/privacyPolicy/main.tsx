import "@/index.css";

import { I18nProvider } from "@lingui/react";
import { createRoot } from "react-dom/client";

import LanguageProvider from "@/contexts/LanguageContext";
import { i18n } from "@/lib/languages";
import PrivacyPolicyPage from "@/pages/privacyPolicy/PrivacyPolicyPage";

// Standalone page: none of the 3D experience is loaded here
createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <I18nProvider i18n={i18n}>
      <PrivacyPolicyPage />
    </I18nProvider>
  </LanguageProvider>
);
