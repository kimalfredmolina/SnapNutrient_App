import { render, fireEvent } from "@testing-library/react-native";
import Help from "../../app/pages/tabSetting/help";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";

jest.mock("expo-router");
jest.mock("../../contexts/ThemeContext");

const mockPush = jest.fn();

describe("Help Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useTheme as jest.Mock).mockReturnValue({
      colors: {
        background: "#FFFFFF",
        surface: "#F3F4F6",
        text: "#000000",
        primary: "#3B82F6",
      },
    });
  });

  test("renders help screen with title", () => {
    const { getByText } = render(<Help />);
    expect(getByText("Help & Support")).toBeTruthy();
  });

  test("displays quick actions section", () => {
    const { getByText } = render(<Help />);
    expect(getByText("Quick Actions")).toBeTruthy();
    expect(getByText("Contact Support")).toBeTruthy();
    expect(getByText("Report a Bug")).toBeTruthy();
    expect(getByText("Rate Our App")).toBeTruthy();
  });

  test("displays FAQ section", () => {
    const { getByText } = render(<Help />);
    expect(getByText("Frequently Asked Questions")).toBeTruthy();
    expect(getByText("How do I scan food?")).toBeTruthy();
  });

  test("displays getting started guide", () => {
    const { getByText } = render(<Help />);
    expect(getByText("Getting Started")).toBeTruthy();
    expect(getByText("1. Create Your Profile")).toBeTruthy();
    expect(getByText("2. Start Scanning")).toBeTruthy();
    expect(getByText("3. Track Your Progress")).toBeTruthy();
  });

  test("navigates to contact support", () => {
    const { getByText } = render(<Help />);
    fireEvent.press(getByText("Contact Support"));
    expect(mockPush).toHaveBeenCalled();
  });

  test("navigates to report bug", () => {
    const { getByText } = render(<Help />);
    fireEvent.press(getByText("Report a Bug"));
    expect(mockPush).toHaveBeenCalled();
  });
});
