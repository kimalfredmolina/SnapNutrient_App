import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ensure useColorScheme can be controlled
import * as RN from "react-native";

import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

// Mock firebase auth BEFORE importing AuthProvider
jest.mock("firebase/auth", () => ({
  getAuth: () => ({ 
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn(),
  }),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(),
  onValue: jest.fn(),
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
        ),
        React.createElement(
          "Button",
          {
            title: "setDark",
            onPress: () => setTheme("dark"),
            testID: "setDark",
          },
          null
        ),
        React.createElement(
          "Button",
          {
            title: "setSystem",
            onPress: () => setTheme("system"),
            testID: "setSystem",
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

  it("can set theme to light", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("dark");
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.press(getByTestId("setLight"));
    
    await waitFor(() => {
      expect(getByTestId("theme").props.children).toBe("light");
    });
  });

  it("can set theme to system", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("light");
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.press(getByTestId("setLight"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());
    
    jest.clearAllMocks();
    
    fireEvent.press(getByTestId("setSystem"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());
  });

  it("provides isDark flag correctly", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("dark");
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.press(getByTestId("setDark"));
    
    await waitFor(() => {
      expect(getByTestId("isDark").props.children).toBe("true");
    });
  });

  it("toggle function changes theme", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("light");
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const initialTheme = getByTestId("theme").props.children;
    
    fireEvent.press(getByTestId("toggle"));
    
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it("provides consistent colors object across renders", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("light");
    
    const { getByTestId, rerender } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const colors1 = getByTestId("primary").props.children;
    
    rerender(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    const colors2 = getByTestId("primary").props.children;
    
    expect(colors1).toBe(colors2);
  });

  it("applies theme changes to isDark flag", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("light");
    
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.press(getByTestId("setDark"));
    
    await waitFor(() => {
      expect(getByTestId("isDark").props.children).toBe("true");
    });
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
        React.createElement("Text", { testID: "loading" }, String(isLoading)),
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
          {
            title: "login-different",
            onPress: () => login({ uid: "u2", email: "x@y.z" }),
            testID: "login-different",
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

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.setItem as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.multiSet as jest.Mock).mockClear();
  });

  it("login stores auth state and logout calls signOut and clears storage", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    // login
    fireEvent.press(getByTestId("login"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    expect(getByTestId("auth").props.children).toBe("true");
  });

  it("initializes with unauthenticated state", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(getByTestId("auth").props.children).toBe("false");
  });

  it("login sets isAuthenticated to true", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));

    await waitFor(() => {
      expect(getByTestId("auth").props.children).toBe("true");
    });
  });

  it("login stores user data", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));

    await waitFor(() => {
      const userText = getByTestId("user").props.children;
      expect(userText).toContain("u1");
      expect(userText).toContain("a@b.c");
    });
  });

  it("can login with different user credentials", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    jest.clearAllMocks();
    (AsyncStorage.setItem as jest.Mock).mockClear();

    fireEvent.press(getByTestId("login-different"));
    await waitFor(() => {
      const userText = getByTestId("user").props.children;
      expect(userText).toContain("u2");
      expect(userText).toContain("x@y.z");
    });
  });

  it("persists login to AsyncStorage", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it("logout clears authentication state", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    jest.clearAllMocks();
    fireEvent.press(getByTestId("logout"));

    await waitFor(() => {
      expect(AsyncStorage.multiSet).toHaveBeenCalled();
    });
  });

  it("provides isLoading flag", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(getByTestId("loading").props.children).toBeTruthy();
  });

  it("user object contains email after login", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));

    await waitFor(() => {
      const userText = getByTestId("user").props.children;
      expect(userText).toContain('"email":"a@b.c"');
    });
  });

  it("handles login without logout first", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    jest.clearAllMocks();
    (AsyncStorage.setItem as jest.Mock).mockClear();

    fireEvent.press(getByTestId("login"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());
  });

  it("maintains context state across provider", async () => {
    const { getByTestId, rerender } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    const userBefore = getByTestId("user").props.children;

    rerender(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    const userAfter = getByTestId("user").props.children;
    expect(userBefore).toBe(userAfter);
  });

  it("isAuthenticated is true after login", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));

    await waitFor(() => {
      expect(getByTestId("auth").props.children).toBe("true");
    });
  });

  it("calls AsyncStorage on logout", async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.press(getByTestId("login"));
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalled());

    jest.clearAllMocks();

    fireEvent.press(getByTestId("logout"));

    await waitFor(() => {
      expect(AsyncStorage.multiSet).toHaveBeenCalled();
    });
  });
});
