import { useLingui } from "@lingui/react/macro";

import { ExternalLinkIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { ProjectData } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ProjectsItemCardProps = {
  projectData: ProjectData;
  isFront: boolean;
  onSelect: () => void;
  onRequestContact: (subject: string) => void;
};

function ProjectsItemCard({
  projectData: {
    Title,
    Kicker,
    Description,
    tags,
    links,
    Note,
    thumbnailImgUrl,
    ThumbnailAlt,
  },
  isFront,
  onSelect,
  onRequestContact,
}: ProjectsItemCardProps) {
  const { t } = useLingui();
  const title = Title();
  const primaryLiveLink = links.find(
    (link) => link.variant === "primary" && link.href
  )?.href;

  return (
    <article
      aria-label={title}
      className="relative w-[36rem] rounded-xl border bg-card/80 text-card-foreground backdrop-blur-sm overflow-hidden shadow-xl transition-[box-shadow,border-color] duration-300 hover:[box-shadow:0_0_1rem_var(--primary),0_0_0.125rem_var(--foreground)] has-[:focus-visible]:[box-shadow:0_0_1rem_var(--primary),0_0_0.125rem_var(--foreground)]"
    >
      <div inert={!isFront} className="flex flex-col">
        {/* Thumbnail image */}
        {primaryLiveLink ? (
          <a
            tabIndex={-1}
            target="_blank"
            rel="noopener noreferrer"
            href={primaryLiveLink}
            className="h-64 w-full overflow-hidden relative block group/thumbnail"
            aria-hidden
          >
            <img
              src={thumbnailImgUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-64 w-full object-cover object-top transition-transform duration-300 group-hover/thumbnail:scale-105"
            />
          </a>
        ) : (
          <img
            src={thumbnailImgUrl}
            alt={ThumbnailAlt()}
            loading="lazy"
            decoding="async"
            className="h-64 w-full object-cover object-top"
          />
        )}

        <div className="flex flex-col gap-3 px-6 pt-5 pb-6">
          {/* Kicker */}
          <p className="text-sm font-semibold uppercase tracking-wider text-[#ffea80]">
            <Kicker />
          </p>

          {/* Title */}
          <h3 className="text-4xl font-bold leading-tight">{title}</h3>

          {/* Description */}
          <p className="text-xl text-card-foreground/80 leading-snug">
            <Description />
          </p>

          {/* Tech tags */}
          <ul
            className="flex flex-wrap items-center gap-2 pt-1"
            aria-label={t`Built with`}
          >
            {tags.map(({ label, Icon }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1 text-sm font-medium"
              >
                {Icon && <Icon className="size-4" aria-hidden />}
                {label}
              </li>
            ))}
          </ul>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
            {Note && (
              <p className="mr-auto text-sm text-muted-foreground">
                <Note />
              </p>
            )}

            {links.map(({ Label, href, variant }) => {
              const label = Label();
              const className = cn(
                "h-auto px-6 py-3 rounded-xl text-lg",
                variant === "primary"
                  ? "bg-primary/70 hover:bg-primary border border-[color-mix(in_srgb,var(--primary)_80%,var(--foreground))]"
                  : "text-foreground"
              );

              // Links without a URL lead to the contact form
              if (!href)
                return (
                  <Button
                    key={label}
                    variant={variant === "primary" ? "default" : "outline"}
                    className={className}
                    onClick={() => onRequestContact(t`${title} walkthrough`)}
                  >
                    {label}
                  </Button>
                );

              return (
                <Button
                  key={label}
                  asChild
                  variant={variant === "primary" ? "default" : "outline"}
                  className={className}
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                    <ExternalLinkIcon aria-hidden className="size-4!" />
                    <span className="sr-only">{t`(opens in a new tab)`}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards in the back bring themselves to the front when clicked */}
      {!isFront && (
        <button
          type="button"
          onClick={onSelect}
          className="absolute inset-0 z-10 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-primary/60 rounded-xl"
        >
          <span className="sr-only">{t`Show project ${title}`}</span>
        </button>
      )}
    </article>
  );
}

export default ProjectsItemCard;
