/**
 * The Leva debug panel is only needed with the #debug hash, so it's loaded on demand instead of being shipped to every visitor
 */
type LevaModule = typeof import("leva");

export const isDebugMode = window.location.hash === "#debug";

let levaModule: LevaModule | null = null;

// Must be awaited before the first render in debug mode (see main.tsx)
export async function loadDebugTools() {
  if (!isDebugMode) return;
  levaModule = await import("leva");
}

export function getLevaModule() {
  return levaModule;
}

type FolderPlaceholder = {
  isFolderPlaceholder: true;
  schema: Record<string, unknown>;
};

// Same signature as Leva's folder()
export function folder(
  schema: Record<string, unknown>,
  settings?: Record<string, unknown>
): any {
  if (levaModule) return levaModule.folder(schema as any, settings as any);
  return { isFolderPlaceholder: true, schema } satisfies FolderPlaceholder;
}

function isFolderPlaceholder(value: unknown): value is FolderPlaceholder {
  return (
    typeof value === "object" &&
    value !== null &&
    "isFolderPlaceholder" in value
  );
}

// Flattened default values of a Leva schema, like useControls() returns them
function getSchemaDefaultValues(schema: Record<string, unknown>) {
  const values: Record<string, any> = {};

  for (const [key, input] of Object.entries(schema)) {
    if (isFolderPlaceholder(input))
      Object.assign(values, getSchemaDefaultValues(input.schema));
    else if (
      typeof input === "object" &&
      input !== null &&
      "value" in input &&
      !Array.isArray(input)
    )
      values[key] = (input as { value: unknown }).value;
    else values[key] = input;
  }

  return values;
}

const defaultValuesCache = new Map<string, Record<string, any>>();

/**
 * Drop-in replacement of Leva's useControls(): real controls in debug mode, plain default values otherwise.
 * The branch never changes during the app's lifetime, so the rules of hooks hold.
 */
export function useDebugControls<T extends Record<string, any>>(
  name: string,
  schema: Record<string, unknown>,
  settings?: Record<string, unknown>
): T {
  if (levaModule)
    return levaModule.useControls(name, schema as any, settings as any) as T;

  // Stable object identity across renders (the values never change without the debug panel)
  if (!defaultValuesCache.has(name))
    defaultValuesCache.set(name, getSchemaDefaultValues(schema));
  return defaultValuesCache.get(name) as T;
}
