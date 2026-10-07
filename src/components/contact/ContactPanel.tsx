import gsap from "gsap";
import { useEffect, useRef } from "react";

import ContactFormContent from "@/components/contact/ContactFormContent";
import { useScrollContext } from "@/contexts/ScrollContext";
import { useIsCompactScreen } from "@/hooks/useMediaQuery";
import { contactFormScrollProgress } from "@/lib/sections";
import { cn } from "@/lib/utils";

/**
 * Scrollable contact form for small screens (phones), where the form doesn't fit next to Neptune
 */
function ContactPanel() {
  const { scrollProgress } = useScrollContext();
  const isCompactScreen = useIsCompactScreen();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isActive = scrollProgress === contactFormScrollProgress;

  // Fade in while the camera approaches Neptune
  useEffect(() => {
    const scrollAreaEl = scrollAreaRef.current;
    if (!scrollAreaEl) return;

    if (isActive) scrollAreaEl.scrollTo({ top: 0 });
    const tween = gsap.to(scrollAreaEl, {
      opacity: isActive ? 1 : 0,
      delay: isActive ? 1.5 : 0,
      duration: isActive ? 1 : 0.4,
    });

    return () => {
      tween.kill();
    };
  }, [isActive, isCompactScreen]);

  if (!isCompactScreen) return null;

  return (
    <div
      ref={scrollAreaRef}
      data-scroll-area
      inert={!isActive}
      aria-hidden={isActive ? undefined : true}
      className={cn(
        "fixed inset-0 z-[25] overflow-y-auto overflow-x-hidden scrollbar-hidden opacity-0 overscroll-contain",
        isActive ? "pointer-events-auto" : "pointer-events-none select-none"
      )}
    >
      <div className="ml-auto mr-[max(1rem,6vw)] w-[min(27.5rem,calc(100vw-2rem))] pt-[calc(env(safe-area-inset-top)+4.5rem)] pb-28">
        <ContactFormContent className="rounded-xl border border-foreground/10 bg-background/70 backdrop-blur-md p-5" />
      </div>
    </div>
  );
}

export default ContactPanel;
