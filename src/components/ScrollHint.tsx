import { useLingui } from "@lingui/react/macro";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@/components/icons";
import { useScrollContext } from "@/contexts/ScrollContext";
import { cn } from "@/lib/utils";

const keyPressAnimation = "animate-[key-press_2.4s_ease-in-out_infinite]";

type KeycapProps = {
  Icon: typeof ChevronUpIcon;
  // Seconds into the loop at which the key gets "pressed", none keeps it idle
  pressDelay?: number;
};

function Keycap({ Icon, pressDelay }: KeycapProps) {
  return (
    <span
      className={cn(
        "grid place-items-center size-5 rounded-[5px] border border-foreground/50 bg-background/40",
        pressDelay !== undefined && keyPressAnimation
      )}
      style={
        pressDelay !== undefined
          ? { animationDelay: `${pressDelay}s` }
          : undefined
      }
    >
      <Icon className="size-3.5" strokeWidth={2.5} />
    </span>
  );
}

/**
 * How to move on: mouse wheel or arrow keys, on touch screens a swipe up or the previous/next buttons
 */
function ScrollHint({ isVisible }: { isVisible: boolean }) {
  const { t } = useLingui();
  const { scrollBy } = useScrollContext();

  return (
    <div
      // Taps inside the hint don't count as activity, so it doesn't vanish under the finger
      data-scroll-hint
      inert={!isVisible}
      className={cn(
        "select-none text-foreground/85 transition-opacity duration-500 filter-[drop-shadow(0_1px_4px_rgb(0_0_0/0.85))]",
        isVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none **:[animation-play-state:paused]"
      )}
    >
      {/* Mouse and keyboard */}
      <div
        className="flex items-center gap-3 pointer-coarse:hidden"
        aria-hidden
      >
        <span className="relative block w-4.5 h-7 rounded-full border-2 border-current">
          <span className="absolute left-1/2 top-1.25 -ml-[1.5px] w-0.75 h-1.5 rounded-full bg-current animate-[scroll-wheel_1.6s_ease-in-out_infinite]" />
        </span>

        <span className="w-px h-6 bg-current opacity-30" />

        <span className="grid grid-cols-3 gap-0.5">
          <span className="col-start-2">
            <Keycap Icon={ChevronUpIcon} />
          </span>
          <Keycap Icon={ChevronLeftIcon} />
          <Keycap Icon={ChevronDownIcon} pressDelay={0} />
          <Keycap Icon={ChevronRightIcon} pressDelay={1.2} />
        </span>
      </div>

      {/* Touch: swipe up, or tap through the sections */}
      <div className="hidden pointer-coarse:flex items-center gap-4">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="grid place-items-center size-10 rounded-xl border border-foreground/50 bg-background/40 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label={t`Previous section`}
        >
          <ChevronUpIcon className="size-5" strokeWidth={2.5} aria-hidden />
        </button>

        <span className="flex flex-col items-center" aria-hidden>
          <ChevronUpIcon className="size-4 opacity-60" strokeWidth={2.5} />
          <span className="relative block w-5 h-9">
            <span className="absolute left-1/2 top-1 bottom-1 w-px -ml-px bg-current opacity-25" />
            <span className="absolute left-1/2 bottom-0 -ml-2 size-4 rounded-full border-2 border-current bg-foreground/30 animate-[swipe-up_1.8s_ease-out_infinite]" />
          </span>
        </span>

        <button
          type="button"
          onClick={() => scrollBy(1)}
          className={cn(
            "grid place-items-center size-10 rounded-xl border border-foreground/50 bg-background/40 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
            keyPressAnimation
          )}
          aria-label={t`Next section`}
        >
          <ChevronDownIcon className="size-5" strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default ScrollHint;
