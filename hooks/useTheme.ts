import type { ConfigProviderThemeVars } from "@wot-ui/ui/components/wd-config-provider/types";

// src/composables/useTheme.ts
import { ref } from "vue";

const theme = ref<"light" | "dark">();
const themeVars = ref<ConfigProviderThemeVars>();

export function useTheme(vars?: ConfigProviderThemeVars) {
  vars && (themeVars.value = vars);

  function toggleTheme(mode?: "light" | "dark") {
    theme.value = mode || (theme.value === "light" ? "dark" : "light");
  }

  return { theme, themeVars, toggleTheme };
}
