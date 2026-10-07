import { useLingui } from "@lingui/react/macro";

const linkClassName =
  "text-foreground underline underline-offset-2 decoration-foreground/40 hover:decoration-foreground focus-visible:decoration-foreground rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 break-words";

export type PolicySection = {
  // Same in every language, so links to a section work whatever the language
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
};

type PolicyDocumentProps = {
  title: string;
  meta: React.ReactNode;
  summaryTitle: string;
  summary: React.ReactNode;
  tableOfContentsTitle: string;
  sections: PolicySection[];
};

/**
 * Layout shared by the language versions of the privacy policy: the short summary first, then the full text
 */
function PolicyDocument({
  title,
  meta,
  summaryTitle,
  summary,
  tableOfContentsTitle,
  sections,
}: PolicyDocumentProps) {
  return (
    <article className="text-foreground/90 leading-relaxed">
      <header className="flex flex-col gap-3 border-b border-foreground/15 pb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
          {title}
        </h1>
        <div className="text-sm text-muted-foreground">{meta}</div>
      </header>

      <aside
        aria-labelledby="summary"
        className="mt-8 rounded-xl border border-foreground/15 bg-card/60 p-5 sm:p-6"
      >
        <h2 id="summary" className="text-lg font-bold text-foreground">
          {summaryTitle}
        </h2>
        <div className="mt-3 space-y-2 text-sm">{summary}</div>
      </aside>

      <nav aria-labelledby="table-of-contents" className="mt-8">
        <h2
          id="table-of-contents"
          className="text-lg font-bold text-foreground"
        >
          {tableOfContentsTitle}
        </h2>
        <ol className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className={linkClassName}>
                {section.number} {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="mt-12 scroll-mt-20"
        >
          <h2
            id={`${section.id}-heading`}
            className="text-xl sm:text-2xl font-bold text-foreground"
          >
            {section.number} {section.title}
          </h2>
          <div className="mt-4 flex flex-col gap-3">{section.content}</div>
        </section>
      ))}
    </article>
  );
}

// Numbered paragraph, the number stays explicit so a clause can be cited (e.g. "Section 4.2")
export function Clause({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 min-w-9 tabular-nums font-medium text-muted-foreground">
        {n}.
      </span>
      <div className="min-w-0 space-y-2">{children}</div>
    </div>
  );
}

export function ClauseList({ children }: { children: React.ReactNode }) {
  return (
    <ol className="list-[lower-alpha] pl-5 space-y-1.5 marker:text-muted-foreground">
      {children}
    </ol>
  );
}

export function PolicyTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-foreground/15">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-card/60 text-foreground">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-3 py-2 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-foreground/15 align-top">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Link to another section of the policy
export function SectionLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <a href={`#${to}`} className={linkClassName}>
      {children}
    </a>
  );
}

export function EmailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className={linkClassName}>
      {email}
    </a>
  );
}

export function ExternalLink({ href }: { href: string }) {
  const { t } = useLingui();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClassName}
    >
      {href.replace(/^https?:\/\//, "")}
      <span className="sr-only"> {t`(opens in a new tab)`}</span>
    </a>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-foreground/10 px-1.5 py-0.5 text-[0.85em]">
      {children}
    </code>
  );
}

export default PolicyDocument;
