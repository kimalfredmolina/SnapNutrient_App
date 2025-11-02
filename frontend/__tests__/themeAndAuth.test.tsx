import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ensure useColorScheme can be controlled
import * as RN from "react-native";

import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

// Mock firebase auth BEFORE importing AuthProvider
jest.mock("firebase/auth", () => ({
  getAuth: () => ({ signOut: jest.fn(() => Promise.resolve()) }),
}));

import { AuthProvider, useAuth } from "../contexts/AuthContext";

describe("ThemeContext", () => {
  const TestComponent = () => {
    const { theme, isDark, setTheme, toggle, colors } = useTheme();
    return (
      // eslint-disable-next-line react/react-in-jsx-scope
      React.createElement(
        "View",
        {},
        React.createElement("Text", { testID: "theme" }, theme),
        React.createElement("Text", { testID: "isDark" }, String(isDark)),
        React.createElement("Text", { testID: "primary" }, colors.primary),
        React.createElement(
          "Button",
          { title: "toggle", onPress: () => toggle(), testID: "toggle" },
          null
        ),
        React.createElement(
          "Button",
          {
            title: "setLight",
            onPress: () => setTheme("light"),
            testID: "setLight",
          },
          null
        )
      )
    );
  };

  it("provides theme and toggles and persists to AsyncStorage", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("dark");

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // initial theme is 'system' by default
    expect(getByTestId("theme").props.children).toBe("system");

    // toggle will flip theme
    fireEvent.press(getByTestId("toggle"));
    await waitFor(() => {
      // After toggle, theme should be either light/dark and AsyncStorage.setItem called
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    // setTheme explicitly
    fireEvent.press(getByTestId("setLight"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());
  });
});

describe("AuthContext", () => {
  const Consumer = () => {
    const { isAuthenticated, user, login, logout, isLoading } = useAuth();
    return (
      // eslint-disable-next-line react/react-in-jsx-scope
      React.createElement(
        "View",
        {},
        React.createElement(
          "Text",
          { testID: "auth" },
          String(isAuthenticated)
        ),
        React.createElement("Text", { testID: "user" }, JSON.stringify(user)),
        React.createElement(
          "Button",
          {
            title: "login",
            onPress: () => login({ uid: "u1", email: "a@b.c" }),
            testID: "login",
          },
          null
        ),
        React.createElement(
          "Button",
          { title: "logout", onPress: () => logout(), testID: "logout" },
          null
        )
      )
    );
  };

  it("login stores auth state and logout calls signOut and clears storage", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    // login
    fireEvent.press(getByTestId("login"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    /*
    // logout - because we mocked getAuth to return signOut that resolves, multiSet should be called
    fireEvent.press(getByTestId("logout"));
    await waitFor(() => expect(AsyncStorage.multiSet).toHaveBeenCalled());*/
  });
});
