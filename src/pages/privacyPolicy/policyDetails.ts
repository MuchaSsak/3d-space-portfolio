import { CONTACT_EMAIL, WEBSITE_LINK } from "@/lib/constants";

// Facts shared by every language version of the privacy policy, so they never drift apart
export const POLICY_DETAILS = {
  version: "1.0",
  // Bump together with the version on every change of the policy
  effectiveDate: "2026-10-07",
  lastUpdatedDate: "2026-10-07",
  websiteUrl: "https://3d-space-folio.vercel.app",
  mainWebsiteUrl: WEBSITE_LINK,
  controllerName: "Mateusz Muszarski",
  contactEmail: CONTACT_EMAIL,
  hostingProvider: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA",
  emailDeliveryProvider: "EmailJS Pte. Ltd.",
  supervisoryAuthorityUrl: "https://uodo.gov.pl",
} as const;

// Parses "YYYY-MM-DD" as a local date, so the day never shifts with the time zone
export function formatPolicyDate(isoDate: string, locale: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(year, month - 1, day)
  );
}
