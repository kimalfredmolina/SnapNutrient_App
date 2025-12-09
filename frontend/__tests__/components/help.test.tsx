import type React from "react";
import { describe, it, expect } from "@jest/globals";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Help from "../../app/pages/tabSetting/help";
import { ThemeProvider } from "../../contexts/ThemeContext";

const renderWithProviders = (ui: React.ReactNode) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("Help Screen", () => {
  it("renders without crashing", () => {
    const screen = renderWithProviders(<Help />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it("displays the Help & Support header", () => {
    const screen = renderWithProviders(<Help />);
    const header = screen.queryByText(/help & support/i);
    expect(header).toBeTruthy();
  });

  it("shows the FAQ section title", () => {
    const screen = renderWithProviders(<Help />);
    const faqTitle = screen.queryByText(/frequently asked questions/i);
    expect(faqTitle).toBeTruthy();
  });

  it("renders at least one FAQ item question", () => {
    const screen = renderWithProviders(<Help />);
    const firstQuestion = screen.queryByText(/how do i scan food\?/i);
    expect(firstQuestion).toBeTruthy();
  });
});
