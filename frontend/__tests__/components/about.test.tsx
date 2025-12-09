import { render } from "@testing-library/react-native";
import About from "../../app/pages/tabSetting/about";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";

jest.mock("expo-router");
jest.mock("../../contexts/ThemeContext");

const mockPush = jest.fn();

describe("About Component", () => {
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

  test("renders about screen", () => {
    const { getByText } = render(<About />);
    expect(getByText("About Us")).toBeTruthy();
  });

  test("displays app info with version", () => {
    const { getByText } = render(<About />);
    expect(getByText("SnapNutrient")).toBeTruthy();
    expect(getByText("Version 1.0.0")).toBeTruthy();
  });

  test("displays mission statement", () => {
    const { getByText } = render(<About />);
    expect(getByText("Our Mission")).toBeTruthy();
    expect(getByText(/nutrition tracking simple/)).toBeTruthy();
  });

  test("displays key features", () => {
    const { getByText } = render(<About />);
    expect(getByText("Key Features")).toBeTruthy();
    expect(getByText(/Instant food recognition using AI/)).toBeTruthy();
    expect(getByText(/Dark\/Light mode support/)).toBeTruthy();
  });

  test("displays contact information", () => {
    const { getByText } = render(<About />);
    expect(getByText("Get in Touch")).toBeTruthy();
    expect(getByText("snapnutrientapp@gmail.com")).toBeTruthy();
    expect(getByText("www.snapnutrient.com")).toBeTruthy();
  });

  test("displays copyright info", () => {
    const { getByText } = render(<About />);
    expect(getByText(/© 2025 SnapNutrient/)).toBeTruthy();
    expect(getByText(/Made with ❤️/)).toBeTruthy();
  });
});
