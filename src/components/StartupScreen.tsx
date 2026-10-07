import { useLingui } from "@lingui/react/macro";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useSound from "use-sound";

import musicSound from "@/assets/music/music.ogg";
import airPressureReleaseSfx from "@/assets/sfx/air_pressure_release.ogg";
import sciFiDoorOpenSfx from "@/assets/sfx/sci_fi_door_close.ogg";
import AudioSettingButton from "@/components/AudioSettingButton";
import GraphicsSettingButton from "@/components/GraphicsSettingButton";
import LanguageSettingButton from "@/components/LanguageSettingButton";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { getWebsiteLink, PRIVACY_POLICY_LINK } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Never keep people waiting forever if some asset can't be loaded
const maxSceneLoadingWaitMs = 15000;

function StartupScreen() {
  const { t } = useLingui();
  const { language } = useLanguage();
  const {
    dispatch,
    hasStartedExperience,
    isAudioEnabled,
    audioVolume,
    hasIgnoredMobileWarning,
  } = useSettingsContext();
  const volume = isAudioEnabled ? audioVolume : 0;
  const [playSciFiDoorOpenSfx] = useSound(sciFiDoorOpenSfx, { volume });
  const [playAirPressureReleaseSfx] = useSound(airPressureReleaseSfx, {
    volume,
  });
  const [playMusicSound, { sound: musicHowl }] = useSound(musicSound, {
    volume,
    loop: true,
  });
  const startupScreenContainerRef = useRef<HTMLDivElement>(null);
  const settingsButtonsContainerRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const leftOverlayPanelRef = useRef<HTMLImageElement>(null);
  const rightOverlayPanelRef = useRef<HTMLImageElement>(null);
  const [hasLoadedBackgroundImage, setHasLoadedBackgroundImage] =
    useState(false);
  const [hasWaitedTooLong, setHasWaitedTooLong] = useState(false);

  // Loading progress of the 3D scene (textures, models, fonts)
  const { progress, active, total } = useProgress();
  const [hasLoadedScene, setHasLoadedScene] = useState(false);
  const isReady =
    (hasLoadedBackgroundImage || hasWaitedTooLong) && hasLoadedScene;

  // Latched: assets loaded later on (e.g. when a section mounts) must not disable START again
  useEffect(() => {
    if (hasLoadedScene) return;
    if ((total > 0 && !active && progress >= 100) || hasWaitedTooLong)
      setHasLoadedScene(true);
  }, [hasLoadedScene, total, active, progress, hasWaitedTooLong]);

  function handlePlayStartExperienceSounds() {
    gsap.delayedCall(0, playSciFiDoorOpenSfx);
    gsap.delayedCall(3.75, playAirPressureReleaseSfx);

    gsap.delayedCall(5, playMusicSound);
  }

  function handleStartExperience() {
    if (hasStartedExperience) return;
    dispatch({ type: "experience/start" });
    handlePlayStartExperienceSounds();
  }

  // Pause the music in background tabs
  useEffect(() => {
    if (!musicHowl) return;
    let wasPlaying = false;

    function handleVisibilityChange() {
      if (document.hidden) {
        wasPlaying = musicHowl.playing();
        if (wasPlaying) musicHowl.pause();
      } else if (wasPlaying) {
        musicHowl.play();
        wasPlaying = false;
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [musicHowl]);

  // Set hasLoadedBackgroundImage on image load (the image can already be complete when coming from the cache)
  useEffect(() => {
    const backgroundImageEl = backgroundImageRef.current;
    if (backgroundImageEl?.complete && backgroundImageEl.naturalWidth > 0)
      setHasLoadedBackgroundImage(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setHasWaitedTooLong(true),
      maxSceneLoadingWaitMs
    );
    return () => clearTimeout(timeoutId);
  }, []);

  // Focus the start button once it's ready, so Enter / Space starts the experience
  useEffect(() => {
    const isBlockingOverlayShown = !!document.querySelector(
      "[data-blocking-overlay]"
    );
    if (isReady && !hasStartedExperience && !isBlockingOverlayShown)
      startButtonRef.current?.focus({ preventScroll: true });
  }, [isReady, hasStartedExperience, hasIgnoredMobileWarning]);

  // GSAP animations
  useEffect(() => {
    /**
     * On entry animations
     */
    // Fade in background image
    if (hasLoadedBackgroundImage)
      gsap.to(backgroundImageRef.current, {
        filter: "brightness(100%)",
        duration: 4,
        ease: "sine.inOut",
      });

    if (hasLoadedBackgroundImage)
      gsap.to(settingsButtonsContainerRef.current, {
        opacity: 1,
        duration: 4,
        delay: 1.5,
      });

    /**
     * On start experience animations
     */
    if (!hasStartedExperience) return;

    // Startup screen disappear when side panels are closed in
    gsap.to(startupScreenContainerRef.current, {
      display: "none",
      duration: 0.01,
      delay: 2.8,
    });

    // Left panel slide in
    gsap
      .timeline()
      .to(leftOverlayPanelRef.current, {
        x: 0,
        delay: 0.25,
        duration: 2.5,
        ease: "bounce.out",
      })
      .to(leftOverlayPanelRef.current, {
        x: "-100%",
        ease: "sine.inOut",
        boxShadow: "0 0 0 transparent",
        delay: 1,
        duration: 2,
      })
      .to(leftOverlayPanelRef.current, { display: "none" });

    // Right panel slide in
    gsap
      .timeline()
      .to(rightOverlayPanelRef.current, {
        x: 0,
        delay: 0.25,
        duration: 2.5,
        ease: "bounce.out",
      })
      .to(rightOverlayPanelRef.current, {
        x: "100%",
        ease: "sine.inOut",
        boxShadow: "0 0 0 transparent",
        delay: 1,
        duration: 2,
      })
      .to(rightOverlayPanelRef.current, { display: "none" });
  }, [hasStartedExperience, hasLoadedBackgroundImage]);

  const loadingPercentage = Math.round(
    hasLoadedScene ? 100 : Math.min(progress, 99)
  );

  return (
    <div
      ref={startupScreenContainerRef}
      inert={hasStartedExperience}
      className="fixed inset-0 z-[60] flex justify-center bg-black items-center overflow-hidden"
    >
      {/* Who and what this is */}
      <header className="absolute top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-10 text-center select-none w-max max-w-[calc(100vw-2rem)]">
        <h1 className="text-lg font-bold tracking-wide text-foreground/90">
          Mateusz Muszarski
        </h1>
        <p className="text-sm text-foreground/60">
          {t`Full-stack product engineer · 3D space portfolio`}
        </p>
      </header>

      {/* Loading text */}
      <p
        role="status"
        className={cn(
          "text-2xl transition-opacity duration-500 ease-in-out select-none pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 tabular-nums",
          hasLoadedBackgroundImage ? "opacity-0" : "opacity-100"
        )}
      >
        {t`Deploying...`} {loadingPercentage}%
      </p>

      {/* Scales the control panel with the screen, so the buttons always stay on their spots of the image */}
      <div className="startup-panel relative shrink-0 w-[93.75rem] aspect-video">
        {/* Background image */}
        <img
          ref={backgroundImageRef}
          onLoad={() => setHasLoadedBackgroundImage(true)}
          // A missing image must never block the experience
          onError={() => setHasLoadedBackgroundImage(true)}
          className="absolute inset-0 w-full h-full -z-10 brightness-0 select-none"
          src="/assets/pictures/startup_screen_background.webp"
          alt={t`The control panel of your spaceship, which will take you on a tour of Mateusz Muszarski's portfolio`}
          fetchPriority="high"
        />

        <div className="opacity-0" ref={settingsButtonsContainerRef}>
          {/* Settings buttons (the hit area reaches past the label, so they stay tappable when the panel is scaled down) */}
          <LanguageSettingButton
            sideOffset={32}
            buttonText={t`Language`}
            buttonVariant="ghost"
            buttonClassName="before:absolute before:-inset-x-6 before:-inset-y-5 bg-transparent! w-[11.5rem] px-3 h-10 top-[calc(50%_+_14.8rem)] left-[calc(50%_-_15.25rem)] -translate-x-1/2 absolute [transform:perspective(30rem)_rotateY(-10deg)_rotateX(20deg)_skewX(-5deg)] text-[#400000] hover:text-[#7D0000] focus-visible:text-[#7D0000] focus-visible:border-2 focus-visible:border-[#7D0000] text-2xl focus-visible:[box-shadow:0_0_3rem_var(--foreground)] hover:[box-shadow:0_0_3rem_var(--foreground)]"
          />
          <GraphicsSettingButton
            sideOffset={32}
            buttonText={t`Graphics`}
            buttonVariant="ghost"
            buttonClassName="before:absolute before:-inset-x-6 before:-inset-y-5 bg-transparent! w-[11.5rem] px-3 h-10 top-[calc(50%_+_14.8rem)] left-1/2 -translate-x-1/2 absolute [transform:perspective(30rem)_rotateX(20deg)] text-[#400000] hover:text-[#7D0000] focus-visible:text-[#7D0000] focus-visible:border-2 focus-visible:border-[#7D0000] text-2xl focus-visible:[box-shadow:0_0_3rem_var(--foreground)] hover:[box-shadow:0_0_3rem_var(--foreground)]"
          />
          <AudioSettingButton
            sideOffset={32}
            buttonText={t`Sounds`}
            buttonVariant="ghost"
            buttonClassName="before:absolute before:-inset-x-6 before:-inset-y-5 bg-transparent! w-[11.5rem] px-3 h-10 top-[calc(50%_+_14.8rem)] right-[calc(50%_-_14.75rem)] translate-x-1/2 absolute [transform:perspective(30rem)_rotateY(10deg)_rotateX(20deg)_skewX(5deg)] text-[#400000] hover:text-[#7D0000] focus-visible:text-[#7D0000] focus-visible:border-2 focus-visible:border-[#7D0000] text-2xl focus-visible:[box-shadow:0_0_3rem_var(--foreground)] hover:[box-shadow:0_0_3rem_var(--foreground)]"
          />

          {/* Start button */}
          <Button
            ref={startButtonRef}
            onClick={handleStartExperience}
            disabled={hasStartedExperience || !isReady}
            variant="ghost"
            className="text-7xl h-32 w-[30rem] left-1/2 -translate-x-1/2 top-[calc(50%_+_1.6rem)] absolute bg-transparent! focus-visible:[box-shadow:0_0_10rem_var(--foreground)] hover:[box-shadow:0_0_10rem_var(--foreground)] text-[#084000] focus-visible:text-[#117D00] focus-visible:border-2 focus-visible:border-[#084000] hover:text-[#117D00] font-black tracking-[0.15em] rounded-full [transform:perspective(30rem)_rotateX(20deg)] disabled:opacity-100"
          >
            {isReady ? t`START` : `${loadingPercentage}%`}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-center w-max max-w-[calc(100vw-2rem)]">
        {/* Lighter alternative */}
        <p className="text-sm text-foreground/60">
          {t`Prefer a fast, mobile-friendly version?`}{" "}
          <a
            href={getWebsiteLink(language)}
            className="font-medium text-foreground/85 underline underline-offset-2 hover:text-foreground focus-visible:text-foreground rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          >
            matmuszarski.space
          </a>
        </p>

        {/* Opens in a new tab, so the loaded scene isn't lost */}
        <a
          href={PRIVACY_POLICY_LINK}
          target="_blank"
          rel="noopener"
          className="text-xs text-foreground/45 underline underline-offset-2 hover:text-foreground/85 focus-visible:text-foreground/85 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
        >
          {t`Privacy policy`}
          <span className="sr-only"> {t`(opens in a new tab)`}</span>
        </a>
      </div>

      {/* Start animation side panels */}
      {createPortal(
        <>
          <img
            src="/assets/pictures/startup_screen_door.webp"
            alt=""
            ref={leftOverlayPanelRef}
            className="h-dvh w-[50vw] -scale-x-100 fixed [box-shadow:0_0_1rem_rgba(0,0,0,0.75)] object-cover left-0 -translate-x-full top-0 z-[70] pointer-events-none"
          />
          <img
            src="/assets/pictures/startup_screen_door.webp"
            alt=""
            ref={rightOverlayPanelRef}
            className="h-dvh w-[50vw] fixed object-cover [box-shadow:0_0_1rem_rgba(0,0,0,0.75)] right-0 translate-x-full top-0 z-[70] pointer-events-none"
          />
        </>,
        document.body
      )}
    </div>
  );
}

export default StartupScreen;
