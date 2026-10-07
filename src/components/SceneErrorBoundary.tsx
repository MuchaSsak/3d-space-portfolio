import { Component, type ErrorInfo, type ReactNode } from "react";

import { WEBSITE_LINK } from "@/lib/constants";

type SceneErrorBoundaryState = { hasError: boolean };

/**
 * If the 3D scene can't be created (no WebGL, a failed asset, a lost GPU context...) the rest of the page keeps working
 * and visitors get a way to the regular portfolio instead of a blank screen
 */
class SceneErrorBoundary extends Component<
  { children: ReactNode },
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("The 3D scene crashed:", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isPolish = document.documentElement.lang === "pl";

    return (
      <div
        role="alert"
        className="fixed inset-0 z-[80] grid place-items-center bg-background p-6 text-center"
      >
        <div className="flex max-w-md flex-col items-center gap-4">
          <span className="font-emoji text-6xl" aria-hidden>
            🛰️
          </span>
          <h2 className="text-2xl font-bold">
            {isPolish
              ? "Nie udało się uruchomić sceny 3D"
              : "The 3D scene couldn't start"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isPolish
              ? "Twoja przeglądarka lub urządzenie mogą nie obsługiwać WebGL. Moje główne portfolio działa wszędzie."
              : "Your browser or device may not support WebGL. My main portfolio works everywhere."}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <a
              href={WEBSITE_LINK}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {isPolish ? "Otwórz główne portfolio" : "Open the main portfolio"}
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              {isPolish ? "Spróbuj ponownie" : "Try again"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SceneErrorBoundary;
