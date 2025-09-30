import React from "react";
import { render } from "@testing-library/react-native";
import App from "../app/(auth)/signin";
import AccountPage from "../app/pages/account";
import HistoryPage from "../app/pages/history";
import IndexPage from "../app/pages/index";
import ScanPage from "../app/pages/scan";
import StatisticsPage from "../app/pages/statistics";
import { ThemeProvider } from "../contexts/ThemeContext";

// Add AsyncStorage mock
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe("App", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    // Use toJSON() to check if the rendered output exists
    expect(toJSON()).toBeTruthy();
  });
});

describe("Main Pages", () => {
  it("renders Account page correctly", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <AccountPage />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders History page correctly", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <HistoryPage />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders Index page correctly", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <IndexPage />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders Scan page correctly", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <ScanPage />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders Statistics page correctly", () => {
    const { toJSON } = render(
      <ThemeProvider>
        <StatisticsPage />
      </ThemeProvider>
    );
    expect(toJSON()).toBeTruthy();
  });
});
