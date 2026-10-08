import { i18n } from "@lingui/core";
import { t } from "@lingui/core/macro";

import {
  BlenderLogo,
  ExpoLogo,
  JavaScriptLogo,
  NextJsLogo,
  NpmLogo,
  ReactLogo,
  SupabaseLogo,
  TanstackQueryLogo,
  ThreeJsLogo,
  TypeScriptLogo,
} from "@/components/icons";

// EmailJS
export const EMAILJS_PUBLIC_KEY = "Unh7wKuX7D61UVGOX";
export const EMAILJS_SERVICE_ID = "service_ygvcefb";
export const EMAILJS_TEMPLATE_ID = "template_4e3jgyp";

// Links
export const CONTACT_EMAIL = "hi@muszarski.com";
export const GITHUB_LINK = "https://github.com/MuchaSsak";
// Self-hosted, so no visitor data reaches GitHub just by loading the page
export const AVATAR_IMG_SRC = "/assets/pictures/mateusz_muszarski_avatar.jpg";
export const INSTAGRAM_LINK = "https://www.instagram.com/mat.muszarski/";
export const LINKEDIN_LINK =
  "https://www.linkedin.com/in/mateusz-muszarski-b1168a28a/";
// The main, fully responsive portfolio
export const WEBSITE_LINK = "https://muszarski.com";
export const SOURCE_CODE_LINK = "https://github.com/MuchaSsak/3d-space-portfolio";
// Separate lightweight page (privacy-policy/index.html), outside of the 3D experience
export const PRIVACY_POLICY_LINK = "/privacy-policy/";

export function getWebsiteLink(language: string) {
  return `${WEBSITE_LINK}/${language}/`;
}

export function getResumeLink(language: string) {
  return `/mateusz-muszarski-cv-${language}.pdf`;
}

const shortDateFormat: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
};

// Parses "YYYY-MM-DD" as a local date (new Date() would parse it as UTC and shift the day in some time zones)
function parseLocalDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateRange(startedDate: string, endedDate: string) {
  return `${i18n.date(parseLocalDate(startedDate), shortDateFormat)} – ${i18n.date(
    parseLocalDate(endedDate),
    shortDateFormat
  )}`;
}

// Job experience
export type JobExperienceId = "cetuspro" | "neoteric" | "beniaminek";
export type JobExperienceItemDialogData = {
  id: JobExperienceId;
  logoImgSrc: string;
  learnMoreUrl: string;
  countryEmoji: string;
  Period: () => string;
  Location: () => string;
  Occupation: () => string;
  company: string;
  Description: () => string;
  Responsibilities: () => React.ReactNode;
  SkillsNeeded: () => React.ReactNode;
};
export const JOB_EXPERIENCE_LIST: Record<
  JobExperienceId,
  JobExperienceItemDialogData
> = {
  cetuspro: {
    id: "cetuspro",
    logoImgSrc: "/assets/textures/asteroids/cetuspro_logo.webp",
    learnMoreUrl: "https://cetuspro.com/",
    countryEmoji: "🇵🇱",
    Period: () => t`June 2026 – now`,
    Location: () => t`Remote, Poland`,
    Occupation: () => t`Developer (intern)`,
    company: "Cetuspro",
    Description: () =>
      t`Real commercial projects for a Polish software house, worked on remotely.`,
    Responsibilities: () => (
      <>
        <li>{t`built PstrykWeb: bespoke websites for local businesses, ordered through one online form`}</li>
        <li>{t`built the public configurator, the online order form`}</li>
        <li>{t`shipped it to production on Vercel`}</li>
      </>
    ),
    SkillsNeeded: () => (
      <>
        <li>Next.js</li>
        <li>TypeScript</li>
        <li>Vercel</li>
      </>
    ),
  },

  neoteric: {
    id: "neoteric",
    logoImgSrc: "/assets/textures/asteroids/neoteric_logo.webp",
    learnMoreUrl: "https://neoteric.eu/",
    countryEmoji: "🇵🇱",
    Period: () => t`2026 · 6 weeks`,
    Location: () => t`Poland`,
    Occupation: () => t`Developer (intern)`,
    company: "Neoteric",
    Description: () =>
      t`An internship brief: build Clockful, a role-based time tracker, only with AI agents and against a deadline.`,
    Responsibilities: () => (
      <>
        <li>{t`built Clockful from a 15-requirement spec in about 9 days`}</li>
        <li>{t`directed the AI agents and verified everything they built, from the database rules to the tests`}</li>
        <li>{t`118 automated tests (49 Vitest, 69 Playwright)`}</li>
        <li>{t`Postgres row-level security on all 5 tables, with an audit trigger`}</li>
      </>
    ),
    SkillsNeeded: () => (
      <>
        <li>Next.js</li>
        <li>Supabase / PostgreSQL</li>
        <li>TanStack Query</li>
        <li>Vitest, Playwright</li>
        <li>Claude Code</li>
      </>
    ),
  },

  beniaminek: {
    id: "beniaminek",
    logoImgSrc: "/assets/textures/asteroids/beniaminek_logo.png",
    learnMoreUrl: "http://beniaminek03.pl/",
    countryEmoji: "🇵🇱",
    Period: () => formatDateRange("2025-05-07", "2025-05-30"),
    Location: () => t`Starogard Gdański, Pomerania, Poland`,
    Occupation: () => t`Programmer (intern)`,
    company: "KS Beniaminek 03",
    Description: () =>
      t`A one-month internship as a programmer that grew my soft and social skills.`,
    Responsibilities: () => (
      <>
        <li>{t`developing a website`}</li>
        <li>{t`technical support`}</li>
        <li>{t`helping other employees with various problems`}</li>
        <li>{t`creating spreadsheets`}</li>
        <li>{t`writing and creating social media posts`}</li>
      </>
    ),
    SkillsNeeded: () => (
      <>
        <li>{t`front-end development`}</li>
        <li>{t`IT troubleshooting`}</li>
        <li>{t`working with people`}</li>
      </>
    ),
  },
};

// Certificates
export type CertificateData = {
  Title: () => React.ReactNode;
  authorName: string;
  websiteLink: string;
  Period: () => React.ReactNode;
  Icon: () => React.ReactNode;
  isRelevant: boolean;
};

export const CERTIFICATES_LIST: CertificateData[] = [
  {
    Title: () => t`INF.02 · INF.03 · INF.04 vocational qualifications`,
    authorName: "CKE / OKE",
    websiteLink: "https://cke.gov.pl/",
    Period: () => t`Programming technician`,
    Icon: () => <span className="font-emoji">🎓</span>,
    isRelevant: true,
  },
  {
    Title: () => t`Three.js Journey — Learn WebGL with Three.js`,
    authorName: "Bruno Simon",
    websiteLink: "https://threejs-journey.com",
    Period: () => formatDateRange("2024-12-02", "2025-01-30"),
    Icon: () => <ThreeJsLogo />,
    isRelevant: true,
  },
  {
    Title: () =>
      t`The Ultimate React Course 2024: React, Next.js, Redux & More`,
    authorName: "Jonas Schmedtmann",
    websiteLink: "https://www.udemy.com/course/the-ultimate-react-course/",
    Period: () => formatDateRange("2023-08-27", "2023-12-30"),
    Icon: () => <ReactLogo />,
    isRelevant: true,
  },
  {
    Title: () => t`The Complete JavaScript Course 2023: From Zero to Expert!`,
    authorName: "Jonas Schmedtmann",
    websiteLink: "https://www.udemy.com/course/the-complete-javascript-course/",
    Period: () => formatDateRange("2023-03-28", "2023-09-10"),
    Icon: () => <JavaScriptLogo />,
    isRelevant: true,
  },
  {
    Title: () => t`Complete Blender Megacourse: Beginner to Expert`,
    authorName: "Skillademia Academy",
    websiteLink:
      "https://www.udemy.com/course/complete-blender-megacourse-beginner-to-expert/",
    Period: () => formatDateRange("2023-07-21", "2023-08-13"),
    Icon: () => <BlenderLogo />,
    isRelevant: true,
  },
  {
    Title: () => t`UX Writing: Microcopy, User Research, Accessibility & More`,
    authorName: "Proficient Courses",
    websiteLink:
      "https://www.udemy.com/course/ux-writing-the-art-of-user-centered-copy/",
    Period: () => formatDateRange("2025-09-03", "2025-09-11"),
    Icon: () => <span className="font-emoji">✍️</span>,
    isRelevant: false,
  },
  {
    Title: () => t`Marketing Psychology and Consumer Behavior`,
    authorName: "Proficient Courses",
    websiteLink: "https://www.udemy.com/course/marketing-psychology/",
    Period: () => formatDateRange("2025-08-28", "2025-09-03"),
    Icon: () => <span className="font-emoji">🧠</span>,
    isRelevant: false,
  },
  {
    Title: () =>
      t`European Solidarity Corps volunteering: sea turtle conservation in Demre, Türkiye`,
    authorName: "LIDOSK",
    websiteLink:
      "https://lidosk.org/en/announcements/caretta-caretta-2025-esc-team-volunteering-project-application-form",
    Period: () => formatDateRange("2025-07-14", "2025-09-08"),
    Icon: () => <span className="font-emoji">🐢</span>,
    isRelevant: false,
  },
  {
    Title: () => t`Youth Entrepreneurship in Palanga, Lithuania`,
    authorName: "Elektrėnų kultūros centras",
    websiteLink: "https://kcelektrenai.lt/",
    Period: () => formatDateRange("2025-07-11", "2025-07-16"),
    Icon: () => <span className="font-emoji">💼</span>,
    isRelevant: false,
  },
  {
    Title: () =>
      t`Developing Infrastructure to Work with Youth in Daugirdiškės, Lithuania`,
    authorName: "Elektrėnų kultūros centras",
    websiteLink: "https://kcelektrenai.lt/",
    Period: () => formatDateRange("2025-06-11", "2025-06-16"),
    Icon: () => <span className="font-emoji">🏗️</span>,
    isRelevant: false,
  },
  {
    Title: () => t`Digital Youth Work Methods in Saraiķi, Latvia`,
    authorName: "YOU+",
    websiteLink: "https://www.youpluss.lv/",
    Period: () => formatDateRange("2025-05-27", "2025-06-06"),
    Icon: () => <span className="font-emoji">💻</span>,
    isRelevant: false,
  },
  {
    Title: () =>
      t`Alternative Participation of Rural Youth in Bakuriani, Georgia`,
    authorName: "Umbrella",
    websiteLink: "https://umbrellayouth.org/",
    Period: () => formatDateRange("2025-05-08", "2025-05-08"),
    Icon: () => <span className="font-emoji">📢</span>,
    isRelevant: false,
  },
  {
    Title: () =>
      t`CompTIA A+ Core 1 (220-1101) Complete Course & Practice Exam`,
    authorName: "Jason Dion",
    websiteLink: "https://www.udemy.com/course/comptia-a-core-1/",
    Period: () => formatDateRange("2023-03-19", "2023-04-11"),
    Icon: () => <span className="font-emoji">🛠️</span>,
    isRelevant: false,
  },
];

// Projects
export type TechTag = {
  label: string;
  Icon?: (props: React.ComponentProps<"svg">) => React.ReactNode;
};

export type ProjectLink = {
  Label: () => string;
  // External link, or the contact section of the experience when it's missing
  href?: string;
  variant: "primary" | "secondary";
};

export type ProjectData = {
  id: string;
  Title: () => string;
  Kicker: () => string;
  Description: () => React.ReactNode;
  tags: TechTag[];
  thumbnailImgUrl: string;
  ThumbnailAlt: () => string;
  links: ProjectLink[];
  Note?: () => string;
};

const sourceCodeLabel = () => t`Source code`;

export const PROJECTS_LIST: ProjectData[] = [
  {
    id: "pstrykweb",
    Title: () => "PstrykWeb",
    Kicker: () => t`Client work · Cetuspro · 2026`,
    Description: () =>
      t`Bespoke websites for local businesses, ordered through one online form. I built it for Cetuspro, a Polish software house.`,
    tags: [
      { label: "Next.js", Icon: NextJsLogo },
      { label: "TypeScript", Icon: TypeScriptLogo },
      { label: "Vercel" },
    ],
    thumbnailImgUrl: "/assets/pictures/pstrykweb_thumbnail.webp",
    ThumbnailAlt: () => t`Home page of pstrykweb.pl`,
    links: [
      {
        Label: () => t`View it live`,
        href: "https://pstrykweb.pl/",
        variant: "primary",
      },
    ],
  },
  {
    id: "linkoglot",
    Title: () => "Linkoglot",
    Kicker: () => t`Own product · solo · 2026`,
    Description: () =>
      t`Snap a photo, get flashcards. A subscription language-learning app in 30 languages, built and shipped solo to both app stores.`,
    tags: [
      { label: "Expo", Icon: ExpoLogo },
      { label: "React Native", Icon: ReactLogo },
      { label: "Supabase", Icon: SupabaseLogo },
      { label: "RevenueCat" },
    ],
    thumbnailImgUrl: "/assets/pictures/linkoglot_thumbnail.webp",
    ThumbnailAlt: () =>
      t`Linkoglot turning a photo of a street into a flashcard`,
    links: [
      {
        Label: () => "App Store",
        href: "https://apps.apple.com/app/id6768303316",
        variant: "primary",
      },
      {
        Label: () => "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.linkoglot.app",
        variant: "primary",
      },
    ],
  },
  {
    id: "clockful",
    Title: () => "Neoteric Clockful",
    Kicker: () => t`Internship · Neoteric · 2026`,
    Description: () =>
      t`A role-based time tracker built only with AI agents in about 9 days: 118 automated tests and row-level security on every table.`,
    tags: [
      { label: "Next.js", Icon: NextJsLogo },
      { label: "Supabase", Icon: SupabaseLogo },
      { label: "TanStack Query", Icon: TanstackQueryLogo },
      { label: "Playwright" },
    ],
    thumbnailImgUrl: "/assets/pictures/clockful_thumbnail.webp",
    ThumbnailAlt: () => t`Illustration of the Clockful time tracker dashboard`,
    links: [
      {
        Label: () => t`Ask for a walkthrough`,
        variant: "primary",
      },
    ],
    Note: () => t`Code private · no public deployment`,
  },
  {
    id: "malatro",
    Title: () => "Malatro",
    Kicker: () => t`Personal · 2026`,
    Description: () =>
      t`A Balatro-style card game where every card is a real Polish matura maths task. Built with AI.`,
    tags: [{ label: "React", Icon: ReactLogo }, { label: "WebGL" }],
    thumbnailImgUrl: "/assets/pictures/malatro_thumbnail.webp",
    ThumbnailAlt: () => t`Sign in screen of Malatro`,
    links: [
      {
        Label: sourceCodeLabel,
        href: "https://github.com/MuchaSsak/malatro",
        variant: "secondary",
      },
      {
        Label: () => t`View it live`,
        href: "https://malatro.vercel.app",
        variant: "primary",
      },
    ],
  },
  {
    id: "lingui-translate-ai",
    Title: () => "lingui-translate-ai",
    Kicker: () => t`Open source · npm · 2026`,
    Description: () =>
      t`An npx CLI that translates Lingui catalogs with an LLM. It grew out of Linkoglot.`,
    tags: [
      { label: "TypeScript", Icon: TypeScriptLogo },
      { label: "Node.js" },
      { label: "npm", Icon: NpmLogo },
    ],
    thumbnailImgUrl: "/assets/pictures/lingui_translate_ai_thumbnail.webp",
    ThumbnailAlt: () => t`Terminal running lingui-translate-ai`,
    links: [
      {
        Label: sourceCodeLabel,
        href: "https://github.com/MuchaSsak/lingui-translate-ai",
        variant: "secondary",
      },
      {
        Label: () => t`View on npm`,
        href: "https://www.npmjs.com/package/lingui-translate-ai",
        variant: "primary",
      },
    ],
  },
  {
    id: "yws",
    Title: () => "Youth Work Synergy",
    Kicker: () => t`Client work · 2025`,
    Description: () =>
      t`A 3D landing page for Youth Work Synergy, an organisation in Luxembourg.`,
    tags: [
      { label: "three.js", Icon: ThreeJsLogo },
      { label: "Next.js", Icon: NextJsLogo },
      { label: "GSAP" },
    ],
    thumbnailImgUrl: "/assets/pictures/yws_lu_thumbnail.webp",
    ThumbnailAlt: () => t`Home page of yws.lu`,
    links: [
      {
        Label: sourceCodeLabel,
        href: "https://github.com/MuchaSsak/yws.lu",
        variant: "secondary",
      },
      {
        Label: () => t`View it live`,
        href: "https://yws.lu",
        variant: "primary",
      },
    ],
  },
  {
    id: "beniaminek-screensaver",
    Title: () => t`Club screensaver`,
    Kicker: () => t`Client work · 2025`,
    Description: () =>
      t`A GPGPU particle screensaver for a sports club, in React Three Fiber.`,
    tags: [
      { label: "React Three Fiber", Icon: ThreeJsLogo },
      { label: "GLSL" },
      { label: "TypeScript", Icon: TypeScriptLogo },
    ],
    thumbnailImgUrl: "/assets/pictures/beniaminek03_screensaver_thumbnail.webp",
    ThumbnailAlt: () => t`Particle screensaver with the club's logo`,
    links: [
      {
        Label: sourceCodeLabel,
        href: "https://github.com/MuchaSsak/beniaminek03-screensaver",
        variant: "secondary",
      },
      {
        Label: () => t`View it live`,
        href: "https://beniaminek03-screensaver.vercel.app",
        variant: "primary",
      },
    ],
  },
];
