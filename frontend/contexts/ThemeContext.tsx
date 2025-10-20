import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
    bgray: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>("system");

  const isDark =
    theme === "dark" || (theme === "system" && systemColorScheme === "dark");

  const lightColors = {
    primary: "#9ACD32",
    secondary: "#40E0D0",
    accent: "#FF6B6B",
    background: "#FFFFFF",
    surface: "#F8F9FA",
    text: "#000000",
    border: "black",
    bgray: "#c9cdd4",
  };

  const darkColors = {
    primary: "#228B22",
    secondary: "#008B8B",
    accent: "#DC143C",
    background: "#000000",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    border: "#374151",
    bgray: "#c9cdd4",
  };

  const colors = isDark ? darkColors : lightColors;

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const toggle = () => {
    const nextTheme =
      theme === "light"
        ? "dark"
        : theme === "dark"
          ? "light"
          : systemColorScheme === "dark"
            ? "light"
            : "dark";
    setTheme(nextTheme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggle, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
