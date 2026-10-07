import { t } from "@lingui/core/macro";
import { createContext, useContext, useEffect, useReducer } from "react";
import * as THREE from "three";

/**
 * Types
 */
type SettingsContextReducerAction = {
  type:
    | "state/load"
    | "state/save"
    | "state/reset"
    | "experience/start"
    | "experience/startCapturingScroll"
    | "experience/ignoreMobileWarning"
    | "settings/setGraphicsSettings"
    | "settings/setIsAudioEnabled"
    | "settings/setAudioVolume";
  payload?: any;
};

export type GraphicsPresetValue = "low" | "high";

type AvailableGraphicsSetting = {
  graphicsPresetValue: GraphicsPresetValue;
  GraphicsPresetLabel: () => React.ReactNode;
  graphicsPresetIcon: string;

  anisotropy: number;
  multisampling: number;
  antialias: boolean;
  depth: boolean;
  // Device pixel ratio range of the canvas
  dpr: [number, number];
  sphereSegments: number;
};
type AvailableGraphicsSettings = Record<
  GraphicsPresetValue,
  AvailableGraphicsSetting
>;

type PersistedSettings = {
  graphicsPresetValue: GraphicsPresetValue;
  isAudioEnabled: boolean;
  audioVolume: number;
  hasIgnoredMobileWarning: boolean;
};

type SettingsContext = AvailableGraphicsSetting & {
  toneMapping: THREE.ToneMapping;

  isAudioEnabled: boolean;
  audioVolume: number;

  hasIgnoredMobileWarning: boolean;
  hasLoaded: boolean;
  hasStartedExperience: boolean;
  canStartCapturingScroll: boolean;
  dispatch: React.ActionDispatch<[action: SettingsContextReducerAction]>;
};

/**
 * Initialization
 */
export const AVAILABLE_GRAPHICS_SETTINGS: AvailableGraphicsSettings = {
  low: {
    graphicsPresetValue: "low",
    GraphicsPresetLabel: () => t`Low graphics`,
    graphicsPresetIcon: "🥔",

    anisotropy: 2,
    multisampling: 0,
    antialias: false,
    depth: false,
    dpr: [0.75, 1],
    sphereSegments: 32,
  },

  high: {
    graphicsPresetValue: "high",
    GraphicsPresetLabel: () => t`High graphics`,
    graphicsPresetIcon: "⚡",

    anisotropy: 8,
    multisampling: 4,
    antialias: true,
    depth: true,
    dpr: [1, 1.5],
    sphereSegments: 64,
  },
};

const settingsLocalStorageKey = "settings";

// Phones, tablets and weak machines start on low graphics (the user can still switch it)
function getDefaultGraphicsPresetValue(): GraphicsPresetValue {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const cpuCores = navigator.hardwareConcurrency ?? 8;
  const deviceMemory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return isTouchDevice || cpuCores <= 4 || deviceMemory <= 4 ? "low" : "high";
}

const initialSettingsContext: SettingsContext = {
  ...AVAILABLE_GRAPHICS_SETTINGS[getDefaultGraphicsPresetValue()],

  toneMapping: THREE.ACESFilmicToneMapping,

  isAudioEnabled: true,
  audioVolume: 0.5,

  hasIgnoredMobileWarning: false,
  hasLoaded: false,
  hasStartedExperience: false,
  canStartCapturingScroll: false,
  dispatch: () => {},
};

function readPersistedSettings(): Partial<PersistedSettings> | null {
  try {
    const parsedSettings = JSON.parse(
      localStorage.getItem(settingsLocalStorageKey) ?? "null"
    );
    if (!parsedSettings || typeof parsedSettings !== "object") return null;

    const persistedSettings: Partial<PersistedSettings> = {};
    if (parsedSettings.graphicsPresetValue in AVAILABLE_GRAPHICS_SETTINGS)
      persistedSettings.graphicsPresetValue =
        parsedSettings.graphicsPresetValue;
    if (typeof parsedSettings.isAudioEnabled === "boolean")
      persistedSettings.isAudioEnabled = parsedSettings.isAudioEnabled;
    if (
      typeof parsedSettings.audioVolume === "number" &&
      parsedSettings.audioVolume >= 0 &&
      parsedSettings.audioVolume <= 1
    )
      persistedSettings.audioVolume = parsedSettings.audioVolume;
    if (typeof parsedSettings.hasIgnoredMobileWarning === "boolean")
      persistedSettings.hasIgnoredMobileWarning =
        parsedSettings.hasIgnoredMobileWarning;

    return persistedSettings;
  } catch {
    return null;
  }
}

function writePersistedSettings(state: SettingsContext) {
  // Only real user preferences are persisted, never the session state (e.g. whether the experience has started)
  const persistedSettings: PersistedSettings = {
    graphicsPresetValue: state.graphicsPresetValue,
    isAudioEnabled: state.isAudioEnabled,
    audioVolume: state.audioVolume,
    hasIgnoredMobileWarning: state.hasIgnoredMobileWarning,
  };

  try {
    localStorage.setItem(
      settingsLocalStorageKey,
      JSON.stringify(persistedSettings)
    );
  } catch {
    // Storage can be unavailable (private mode, blocked cookies), the settings then simply aren't remembered
  }
}

const SettingsContext = createContext<SettingsContext>(initialSettingsContext);
export { SettingsContext };

/**
 * Reducer
 */
function reducer(
  state: SettingsContext,
  action: SettingsContextReducerAction
): SettingsContext {
  switch (action.type) {
    case "state/load": {
      const persistedSettings = readPersistedSettings();
      if (!persistedSettings) return { ...state, hasLoaded: true };

      const { graphicsPresetValue, ...otherPersistedSettings } =
        persistedSettings;

      return {
        ...state,
        ...(graphicsPresetValue
          ? AVAILABLE_GRAPHICS_SETTINGS[graphicsPresetValue]
          : {}),
        ...otherPersistedSettings,
        hasLoaded: true,
      };
    }

    case "state/save": {
      writePersistedSettings(state);

      return state;
    }

    case "state/reset": {
      try {
        localStorage.clear();
      } catch {
        // Nothing to clear when storage is unavailable
      }

      return { ...initialSettingsContext };
    }

    case "experience/start": {
      return { ...state, hasStartedExperience: true };
    }

    case "experience/startCapturingScroll": {
      return { ...state, canStartCapturingScroll: true };
    }

    case "experience/ignoreMobileWarning": {
      return { ...state, hasIgnoredMobileWarning: true };
    }

    case "settings/setGraphicsSettings": {
      const payload = action.payload as GraphicsPresetValue;
      if (!(payload in AVAILABLE_GRAPHICS_SETTINGS)) return state;

      return { ...state, ...AVAILABLE_GRAPHICS_SETTINGS[payload] };
    }

    case "settings/setIsAudioEnabled": {
      const payload = action.payload as boolean;

      return { ...state, isAudioEnabled: payload };
    }

    case "settings/setAudioVolume": {
      const payload = action.payload as number;

      return { ...state, audioVolume: payload };
    }

    default: {
      throw new Error("Unrecognized SettingsContext reducer action type!");
    }
  }
}

/**
 * Context provider
 */
export function SettingsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialSettingsContext);

  // Load settings from local storage at mount
  useEffect(() => {
    dispatch({ type: "state/load" });
  }, []);

  // Allow capturing scroll events 3000ms after pressing the start button
  useEffect(() => {
    if (!state.hasStartedExperience) return;

    const startCapturingScrollTimeoutId = setTimeout(() => {
      dispatch({ type: "experience/startCapturingScroll" });
    }, 3000);

    return () => clearTimeout(startCapturingScrollTimeoutId);
  }, [state.hasStartedExperience]);

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook
 */
export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined)
    throw new Error(
      "useSettingsContext was used outside of SettingsContextProvider!"
    );
  return context;
}
