import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeT =
  | "light"
  | "dark"
  | "valentine"
  | "cyberpunk"
  | "aqua"
  | "pastel";

interface ThemeContextType {
  theme: ThemeT;
  tagColoursMap: Record<string, string>;
  setTagColoursMap: (newMap: Record<string, string>) => void;
  changeTheme: (newTheme: ThemeT) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeT>("light");
  const [tagColoursMap, setTagColoursMap] = useState<Record<string, string>>(
    {}
  );

  const changeTheme = (newTheme: ThemeT) => {
    setTheme(newTheme);
  };

  // Store the tag colours map in local storage
  useEffect(() => {
    if (Object.keys(tagColoursMap).length > 0) {
      localStorage.setItem("tagColoursMap", JSON.stringify(tagColoursMap));
    }
  }, [tagColoursMap]);

  // Load the tag colours map from local storage
  useEffect(() => {
    const localTagColoursMap = localStorage.getItem("tagColoursMap");
    if (localTagColoursMap) {
      setTagColoursMap(JSON.parse(localTagColoursMap));
    }
  }, []);

  // Store the theme in local storage
  useEffect(() => {
    if (theme !== "light") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Load the theme from local storage
  useEffect(() => {
    const localTheme = localStorage.getItem("theme") as ThemeT;
    if (localTheme) {
      setTheme(localTheme);
    }
  }, []);

  const themeContextValue: ThemeContextType = {
    theme,
    changeTheme,
    tagColoursMap,
    setTagColoursMap,
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
