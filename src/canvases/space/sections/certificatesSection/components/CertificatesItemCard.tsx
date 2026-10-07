import { useLingui } from "@lingui/react/macro";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { CertificateData } from "@/lib/constants";

type CertificatesItemCardProps = {
  certificateData: CertificateData;
};

function CertificatesItemCard({
  certificateData: { Title, Period, authorName, websiteLink, Icon },
}: CertificatesItemCardProps) {
  const { t } = useLingui();

  return (
    <li>
      <Card className="w-[26rem] short:w-[22rem] max-w-full z-10 relative bg-card/70 gap-2 short:py-4 short:gap-1 backdrop-blur-sm hover:[box-shadow:0_0_0.5rem_#FFFC54] transition-[box-shadow]">
        <CardHeader>
          <CardTitle className="text-2xl short:text-lg max-w-[88%] leading-tight">
            <h3>
              <Title />
            </h3>
          </CardTitle>

          <div
            className="absolute top-4 right-4 text-2xl short:text-lg size-8 short:size-6 grid place-items-center [&_svg]:size-8 short:[&_svg]:size-6"
            aria-hidden
          >
            <Icon />
          </div>
        </CardHeader>

        <CardFooter className="justify-between gap-x-4 text-muted-foreground flex-wrap short:text-sm">
          <a
            className="hover:text-[#FFFC54] transition-colors hover:underline focus-visible:underline focus-visible:text-[#FFFC54] rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-[#FFFC54]/40"
            href={websiteLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {authorName}
            <span className="sr-only"> {t`(opens in a new tab)`}</span>
          </a>

          <span>
            <Period />
          </span>
        </CardFooter>
      </Card>
    </li>
  );
}

export default CertificatesItemCard;
