import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import App from "../app/(auth)/signin";
import AccountPage from "../app/pages/account";
import HistoryPage from "../app/pages/history";
import IndexPage from "../app/pages/index";
import ScanPage from "../app/pages/scan";
import StatisticsPage from "../app/pages/statistics";
import { ThemeProvider } from "../contexts/ThemeContext";

// ---------- TEST ENV MOCKS ----------

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock vector icons safely (no React reference outside)
jest.mock("@expo/vector-icons", () => {
  const Dummy = (props: any) => null;
  return {
    Ionicons: Dummy,
    AntDesign: Dummy,
    MaterialIcons: Dummy,
    default: { Ionicons: Dummy },
  };
});

// Mock expo-router
jest.mock("expo-router", () => ({
  Link: ({ children }: any) => children,
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  Redirect: () => null,
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
}));

// Mock firebase auth
jest.mock("firebase/auth", () => ({
  getAuth: () => ({
    currentUser: { uid: "test-user", email: "test@example.com" },
  }),
  onAuthStateChanged: jest.fn(),
}));

// Mock reanimated (avoid Babel crash)
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock css interop (avoid _ReactNativeCSSInterop errors)
jest.mock("react-native-css-interop", () => ({}));

// Mock expo-constants
jest.mock("expo-constants", () => ({
  manifest: { extra: {} },
  expoConfig: {},
}));

// ---------- HELPERS ----------

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <NavigationContainer>
      <ThemeProvider>{ui}</ThemeProvider>
    </NavigationContainer>
  );

// ---------- TESTS ----------

describe("App", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy();
  });
});

describe("Main Pages", () => {
  it("renders Account page correctly", () => {
    const { toJSON } = renderWithProviders(<AccountPage />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders History page correctly", () => {
    const { toJSON } = renderWithProviders(<HistoryPage />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders Index page correctly", () => {
    const { toJSON } = renderWithProviders(<IndexPage />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders Scan page correctly", () => {
    const { toJSON } = renderWithProviders(<ScanPage />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders Statistics page correctly", () => {
    const { toJSON } = renderWithProviders(<StatisticsPage />);
    expect(toJSON()).toBeTruthy();
  });
});
