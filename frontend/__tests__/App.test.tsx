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
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  AntDesign: "AntDesign",
  MaterialIcons: "MaterialIcons",
}));

jest.mock("expo-router", () => ({
  Link: jest.fn(({ children }) => children),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  Redirect: jest.fn(),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
}));

jest.mock("firebase/auth", () => {
  interface MockUser {
    uid: string;
    email: string;
  }

  interface MockAuth {
    currentUser: MockUser;
    onAuthStateChanged: (callback: (user: MockUser) => void) => jest.Mock;
  }

  const mockAuth: MockAuth = {
    currentUser: { uid: "test-user", email: "test@example.com" },
    onAuthStateChanged: (callback: (user: MockUser) => void) => {
      callback({ uid: "test-user", email: "test@example.com" });
      return jest.fn();
    },
  };
  return {
    getAuth: () => mockAuth,
    onAuthStateChanged: jest.fn(),
  };
});

jest.mock("firebase/database", () => {
  const mockDb = {
    val: jest.fn(() => ({})),
  };
  return {
    getDatabase: jest.fn(),
    ref: jest.fn(),
    set: jest.fn(),
    get: jest.fn(() => Promise.resolve(mockDb)),
    child: jest.fn(),
    push: jest.fn(),
    onValue: jest.fn((_, callback) => {
      callback(mockDb);
      return jest.fn();
    }),
  };
});

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("react-native-calendars", () => ({
  Calendar: "Calendar",
  CalendarList: "CalendarList",
  Agenda: "Agenda",
}));

jest.mock("expo-constants", () => ({
  manifest: { extra: {} },
  expoConfig: {},
}));

jest.mock("react-native-css-interop", () => {
  return {
    createElement: jest.fn().mockImplementation((type, props, ...children) => {
      return require("react").createElement(type, props, ...children);
    }),
  };
});

// ---------- HELPERS ----------
const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <NavigationContainer>
      <ThemeProvider>{ui}</ThemeProvider>
    </NavigationContainer>
  );
};

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
  it("renders Index page correctly", () => {
    const { toJSON } = renderWithProviders(<IndexPage />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders Statistics page correctly", () => {
    const { toJSON } = renderWithProviders(<StatisticsPage />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders Account page correctly", () => {
    const { toJSON } = renderWithProviders(<AccountPage />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders History page correctly", () => {
    const { toJSON } = renderWithProviders(<HistoryPage />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders Scan page correctly", () => {
    const { toJSON } = renderWithProviders(<ScanPage />);
    expect(toJSON()).toBeTruthy();
  });
});
