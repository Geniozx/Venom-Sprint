// ========================================
// PLAYER SETTINGS
// ========================================

const SETTINGS_STORAGE_KEY = "venomSprintSettings";

const DEFAULT_SETTINGS = {
  showGrid: true,
  visualEffects: true
};

// Load saved preferences or use defaults
function loadSettings() {
  try {
    const savedSettings = localStorage.getItem(
      SETTINGS_STORAGE_KEY
    );

    if (!savedSettings) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsedSettings = JSON.parse(savedSettings);

    return {
      showGrid:
        typeof parsedSettings.showGrid === "boolean"
          ? parsedSettings.showGrid
          : DEFAULT_SETTINGS.showGrid,

      visualEffects:
        typeof parsedSettings.visualEffects === "boolean"
          ? parsedSettings.visualEffects
          : DEFAULT_SETTINGS.visualEffects
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

let settings = loadSettings();

// Return a copy of the current settings
export function getSettings() {
  return { ...settings };
}

// Update one setting and persist it
export function updateSetting(key, value) {
  if (
    !Object.hasOwn(DEFAULT_SETTINGS, key) ||
    typeof value !== "boolean"
  ) {
    return false;
  }

  settings = {
    ...settings,
    [key]: value
  };

  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(settings)
  );

  return true;
}