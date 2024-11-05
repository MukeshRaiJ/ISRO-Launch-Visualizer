import { createContext, useContext } from "react";

export type Theme = "dark" | "light";

export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const themeColors = {
  dark: {
    background: "from-space-dark to-space-darker",
    cardBg: "bg-black/40",
    text: "text-white",
    textSecondary: "text-gray-300",
    borderColor: "border-space-gold/30",
    borderHover: "hover:border-space-gold/60",
    chartColors: [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ],
  },
  light: {
    background: "from-blue-50 to-indigo-100",
    cardBg: "bg-white/80",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    borderColor: "border-indigo-200",
    borderHover: "hover:border-indigo-400",
    chartColors: [
      "hsl(var(--chart-1-light))",
      "hsl(var(--chart-2-light))",
      "hsl(var(--chart-3-light))",
      "hsl(var(--chart-4-light))",
      "hsl(var(--chart-5-light))",
    ],
  },
};
