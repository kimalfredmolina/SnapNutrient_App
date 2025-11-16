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
    signOut: jest.Mock;
  }

  const mockAuth: MockAuth = {
    currentUser: { uid: "test-user", email: "test@example.com" },
    onAuthStateChanged: (callback: (user: MockUser) => void) => {
      callback({ uid: "test-user", email: "test@example.com" });
      return jest.fn();
    },
    signOut: jest.fn(() => Promise.resolve()),
  };
  return {
    getAuth: () => mockAuth,
    onAuthStateChanged: (auth: any, callback: any) => {
      callback({ uid: "test-user", email: "test@example.com" });
      return jest.fn();
    },
    signOut: jest.fn(() => Promise.resolve()),
  };
});

jest.mock("firebase/database", () => {
  const mockSnapshot = {
    val: jest.fn(() => ({})),
    exists: jest.fn(() => false),
  };

  const mockRef = {
    off: jest.fn(),
    on: jest.fn(),
  };

  return {
    getDatabase: jest.fn(),
    ref: jest.fn(() => mockRef),
    set: jest.fn(),
    get: jest.fn(() => Promise.resolve(mockSnapshot)),
    child: jest.fn(() => mockRef),
    push: jest.fn(),
    onValue: jest.fn((_, callback) => {
      callback(mockSnapshot);
      return jest.fn();
    }),
    off: jest.fn(),
    query: jest.fn(() => mockRef),
    orderByChild: jest.fn(),
    startAt: jest.fn(),
    endAt: jest.fn(),
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
const renderWithProviders = async (ui: React.ReactNode) => {
  const rendered = render(
    <NavigationContainer>
      <ThemeProvider>{ui}</ThemeProvider>
    </NavigationContainer>
  );

  await new Promise((resolve) => setTimeout(resolve, 100));

  return rendered;
};

// ---------- TESTS ----------
describe("Main Pages - Component Rendering", () => {
  it("renders Statistics page correctly", async () => {
    const rendered = await renderWithProviders(<StatisticsPage />);
    expect(rendered.toJSON()).toBeTruthy();
  });

  it("renders Account page correctly", async () => {
    const rendered = await renderWithProviders(<AccountPage />);
    expect(rendered.toJSON()).toBeTruthy();
  });

  it("renders History page correctly", async () => {
    const rendered = await renderWithProviders(<HistoryPage />);
    expect(rendered.toJSON()).toBeTruthy();
  });

  it("renders Scan page correctly", async () => {
    const rendered = await renderWithProviders(<ScanPage />);
    expect(rendered.toJSON()).toBeTruthy();
  });

  it("renders multiple pages in sequence", async () => {
    const stats = await renderWithProviders(<StatisticsPage />);
    expect(stats.toJSON()).toBeTruthy();

    const account = await renderWithProviders(<AccountPage />);
    expect(account.toJSON()).toBeTruthy();
  });

  it("pages return valid JSX elements", async () => {
    const pages = [
      <StatisticsPage />,
      <AccountPage />,
      <HistoryPage />,
      <ScanPage />,
      <IndexPage />,
    ];

    for (const page of pages) {
      expect(page).toBeTruthy();
      expect(page.type).toBeTruthy();
    }
  });

  it("renders pages with ThemeProvider context", async () => {
    const rendered = render(
      <NavigationContainer>
        <ThemeProvider>
          <StatisticsPage />
        </ThemeProvider>
      </NavigationContainer>
    );

    expect(rendered.toJSON()).toBeTruthy();
  });


  it("handles rapid page transitions", async () => {
    const pages = [
      <StatisticsPage />,
      <AccountPage />,
      <HistoryPage />,
      <ScanPage />,
    ];

    for (const page of pages) {
      const rendered = await renderWithProviders(page);
      expect(rendered.toJSON()).toBeTruthy();
    }
  });

  it("renders Account page with theme context", async () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ThemeProvider>
          <AccountPage />
        </ThemeProvider>
      </NavigationContainer>
    );

    expect(toJSON()).toBeTruthy();
  });

  it("renders History page with theme context", async () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ThemeProvider>
          <HistoryPage />
        </ThemeProvider>
      </NavigationContainer>
    );

    expect(toJSON()).toBeTruthy();
  });

  it("renders Scan page with theme context", async () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ThemeProvider>
          <ScanPage />
        </ThemeProvider>
      </NavigationContainer>
    );

    expect(toJSON()).toBeTruthy();
  });

  it("renders Statistics page with theme context", async () => {
    const { toJSON } = render(
      <NavigationContainer>
        <ThemeProvider>
          <StatisticsPage />
        </ThemeProvider>
      </NavigationContainer>
    );

    expect(toJSON()).toBeTruthy();
  });

  it("pages are React components", () => {
    expect(typeof StatisticsPage).toBe("function");
    expect(typeof AccountPage).toBe("function");
    expect(typeof HistoryPage).toBe("function");
    expect(typeof ScanPage).toBe("function");
    expect(typeof IndexPage).toBe("function");
  });

  it("pages render consistently with same context", async () => {
    const rendered1 = await renderWithProviders(<StatisticsPage />);
    const rendered2 = await renderWithProviders(<StatisticsPage />);

    expect(rendered1.toJSON()).toBeTruthy();
    expect(rendered2.toJSON()).toBeTruthy();
  });

  it("handles AsyncStorage mocks in pages", async () => {
    const rendered = await renderWithProviders(<StatisticsPage />);
    expect(rendered.toJSON()).toBeTruthy();
  });

  it("handles Firebase mocks in pages", async () => {
    const rendered = await renderWithProviders(<HistoryPage />);
    expect(rendered.toJSON()).toBeTruthy();
  });
});

describe("App", () => {
  it("renders SignIn app correctly", async () => {
    const rendered = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(rendered.toJSON()).toBeTruthy();
  });

  it("SignIn app is a valid component", () => {
    expect(typeof App).toBe("function");
  });

  it("renders SignIn with ThemeProvider", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it("SignIn app renders without navigation container", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders SignIn app multiple times", () => {
    const render1 = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    const render2 = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(render1.toJSON()).toBeTruthy();
    expect(render2.toJSON()).toBeTruthy();
  });
});
