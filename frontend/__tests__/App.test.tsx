import React from "react";
import { render } from "@testing-library/react-native";
import App from "../app/(auth)/signin";
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
