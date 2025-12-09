import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Contact from "../../app/pages/tabSetting/contact";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { sendEmail } from "@/services/emailService";
import { Alert } from "react-native";

jest.mock("expo-router");
jest.mock("../../contexts/ThemeContext");
jest.mock("@/services/emailService");
jest.spyOn(Alert, "alert").mockImplementation(() => {});

const mockPush = jest.fn();

describe("Contact Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: jest.fn(),
    });
    (useTheme as jest.Mock).mockReturnValue({
      colors: {
        background: "#FFFFFF",
        surface: "#F3F4F6",
        text: "#000000",
        primary: "#3B82F6",
      },
    });
    (sendEmail as jest.Mock).mockResolvedValue({});
  });

  test("renders contact form", () => {
    const { getByText } = render(<Contact />);
    expect(getByText("Contact Us")).toBeTruthy();
    expect(getByText("Send us a Message")).toBeTruthy();
  });

  test("displays all form fields", () => {
    const { getByText } = render(<Contact />);
    expect(getByText("Name")).toBeTruthy();
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("Subject")).toBeTruthy();
    expect(getByText("Message")).toBeTruthy();
  });

  test("shows error when required fields are empty", () => {
    const { getByText } = render(<Contact />);
    fireEvent.press(getByText("Send Message"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Error",
      "Please fill in all fields"
    );
  });

  test("submits form with valid data", async () => {
    const { getByPlaceholderText, getByText } = render(<Contact />);

    fireEvent.changeText(getByPlaceholderText("Your full name"), "test moe");
    fireEvent.changeText(
      getByPlaceholderText("your.email@example.com"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("What's this about?"),
      "Question"
    );
    fireEvent.changeText(
      getByPlaceholderText("Tell us more about your inquiry..."),
      "I have a question"
    );

    fireEvent.press(getByText("Send Message"));

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledWith(
        "test moe",
        "test@example.com",
        "Question",
        "I have a question"
      );
    });
  });

  test("shows success message after submission", async () => {
    const { getByPlaceholderText, getByText } = render(<Contact />);

    fireEvent.changeText(getByPlaceholderText("Your full name"), "test moe");
    fireEvent.changeText(
      getByPlaceholderText("your.email@example.com"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("What's this about?"),
      "Question"
    );
    fireEvent.changeText(
      getByPlaceholderText("Tell us more about your inquiry..."),
      "I have a question"
    );

    fireEvent.press(getByText("Send Message"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Message Sent",
        expect.any(String),
        expect.any(Array) 
      );
    });
  });

  test("handles email submission error gracefully", async () => {
    (sendEmail as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { getByPlaceholderText, getByText } = render(<Contact />);

    fireEvent.changeText(getByPlaceholderText("Your full name"), "test moe");
    fireEvent.changeText(
      getByPlaceholderText("your.email@example.com"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("What's this about?"),
      "Question"
    );
    fireEvent.changeText(
      getByPlaceholderText("Tell us more about your inquiry..."),
      "I have a question"
    );

    fireEvent.press(getByText("Send Message"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", expect.any(String));
    });
  });
});
