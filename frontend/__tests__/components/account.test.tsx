import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Account from "../../app/pages/account";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../config/firebase";

jest.mock("expo-router");
jest.mock("../../contexts/ThemeContext");
jest.mock("../../contexts/AuthContext");

// Mock the firebase auth module with signOut as a jest.fn()
jest.mock("../../config/firebase", () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

describe("Account Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Make sure auth.signOut returns a resolved promise for logout tests
    (auth.signOut as jest.Mock).mockResolvedValue(undefined);

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    (useTheme as jest.Mock).mockReturnValue({
      colors: {
        background: "#FFFFFF",
        surface: "#F3F4F6",
        text: "#000000",
        primary: "#3B82F6",
        accent: "#EF4444",
      },
      isDark: false,
      toggle: jest.fn(),
    });

    (useAuth as jest.Mock).mockReturnValue({
      user: {
        uid: "test-uid",
        email: "test@example.com",
        name: "Test User",
        photoURL: null,
      },
      logout: jest.fn(),
    });
  });

  test("renders account screen with profile card", () => {
    const { getByText } = render(<Account />);
    expect(getByText("Test User")).toBeTruthy();
    expect(getByText("test@example.com")).toBeTruthy();
  });

  test("displays all menu options", () => {
    const { getByTestId } = render(<Account />);
    expect(getByTestId("btn-settings")).toBeTruthy();
    expect(getByTestId("btn-help")).toBeTruthy();
    expect(getByTestId("btn-privacy")).toBeTruthy();
    expect(getByTestId("btn-terms")).toBeTruthy();
    expect(getByTestId("btn-contact")).toBeTruthy();
    expect(getByTestId("btn-report")).toBeTruthy();
    expect(getByTestId("btn-about")).toBeTruthy();
  });

  test("navigates to settings when Settings button is pressed", () => {
    const { getByTestId } = render(<Account />);
    fireEvent.press(getByTestId("btn-settings"));
    expect(mockPush).toHaveBeenCalledWith("/pages/tabSetting/settings");
  });

  test("navigates to help when Help button is pressed", () => {
    const { getByTestId } = render(<Account />);
    fireEvent.press(getByTestId("btn-help"));
    expect(mockPush).toHaveBeenCalledWith("/pages/tabSetting/help");
  });

  test("navigates to privacy when Privacy Policy is pressed", () => {
    const { getByTestId } = render(<Account />);
    fireEvent.press(getByTestId("btn-privacy"));
    expect(mockPush).toHaveBeenCalledWith("/pages/tabSetting/privacy");
  });

  test("handles logout successfully", async () => {
    const mockLogout = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "test-uid", email: "test@example.com", name: "Test User" },
      logout: mockLogout,
    });

    const { getByTestId } = render(<Account />);
    fireEvent.press(getByTestId("btn-logout"));

    await waitFor(() => {
      expect(auth.signOut).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/(auth)/signin");
    });
  });

  test("displays version number", () => {
    const { getByText } = render(<Account />);
    expect(getByText("SnapNutrients v1.0.0")).toBeTruthy();
  });

  test("toggles theme appearance switch", () => {
    const mockToggle = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      colors: {
        background: "#FFFFFF",
        surface: "#F3F4F6",
        text: "#000000",
        primary: "#3B82F6",
        accent: "#EF4444",
      },
      isDark: false,
      toggle: mockToggle,
    });

    const { getByTestId } = render(<Account />);
    const switchComponent = getByTestId("theme-switch");

    fireEvent(switchComponent, "valueChange", true);
    expect(mockToggle).toHaveBeenCalled();
  });
});
