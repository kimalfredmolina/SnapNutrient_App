import axios from "axios";
import Constants from "expo-constants";
import { sendEmail } from "../services/emailService";

jest.mock("axios");

describe("emailService", () => {
  const mockConfig = {
    SENDGRID_API_KEY: "test-key-123",
    SENDGRID_API_URL: "https://api.sendgrid.test/v3/mail/send",
    SENDGRID_FROM_EMAIL: "from@test.com",
  };

  beforeAll(() => {
    // Provide test SendGrid config
    (Constants as any).expoConfig = { extra: mockConfig };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls axios.post with correct payload", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const res = await sendEmail("John Doe", "john@example.com", "Test Subject", "Test message");

    expect(axios.post).toHaveBeenCalled();
    expect(res).toEqual({ success: true });
  });

  it("sends email with correct recipient address", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { id: "msg-123" } });

    await sendEmail("Jane", "jane@test.com", "Subject", "Body");

    const callArgs = (axios.post as jest.Mock).mock.calls[0];
    const payload = callArgs[1];
    
    expect(payload.personalizations[0].to[0].email).toBe("snapnutrientapp@gmail.com");
  });

  it("sends POST request to API", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    await sendEmail("User", "user@test.com", "Subject", "Body");

    expect(axios.post).toHaveBeenCalled();
    expect((axios.post as jest.Mock).mock.calls[0][1]).toBeTruthy();
  });

  it("handles empty sender name", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    await sendEmail("", "user@test.com", "Subject", "Body");

    const callArgs = (axios.post as jest.Mock).mock.calls[0];
    const payload = callArgs[1];
    const content = payload.content[0].value;
    
    expect(content).toContain("From:");
  });

  it("returns response data on success", async () => {
    const mockResponse = { id: "msg-abc123", status: "queued" };
    (axios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await sendEmail("User", "user@test.com", "Subj", "Body");

    expect(result).toEqual(mockResponse);
  });

  it("sets content type to text/plain", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    await sendEmail("User", "user@test.com", "Subject", "Body");

    const callArgs = (axios.post as jest.Mock).mock.calls[0];
    const payload = callArgs[1];
    
    expect(payload.content[0].type).toBe("text/plain");
  });

  it("handles multiline messages", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    const multilineMsg = "Line 1\nLine 2\nLine 3";
    await sendEmail("User", "user@test.com", "Subject", multilineMsg);

    const callArgs = (axios.post as jest.Mock).mock.calls[0];
    const payload = callArgs[1];
    
    expect(payload.content[0].value).toContain("Line 1\nLine 2\nLine 3");
  });

  it("handles very long messages", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    const longMsg = "a".repeat(10000);
    await sendEmail("User", "user@test.com", "Subject", longMsg);

    const callArgs = (axios.post as jest.Mock).mock.calls[0];
    const payload = callArgs[1];
    
    expect(payload.content[0].value.length).toBeGreaterThan(10000);
  });

  it("formats message structure correctly", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    await sendEmail("TestUser", "test@test.com", "TestSubj", "TestBody");

    const callArgs = (axios.post as jest.Mock).mock.calls[0];
    const payload = callArgs[1];
    
    expect(payload).toHaveProperty("personalizations");
    expect(payload).toHaveProperty("from");
    expect(payload).toHaveProperty("content");
    expect(Array.isArray(payload.personalizations)).toBe(true);
    expect(Array.isArray(payload.content)).toBe(true);
  });

  it("sends personalizations array", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: {} });

    await sendEmail("User", "user@test.com", "Subject", "Body");

    const callArgs = (axios.post as jest.Mock).mock.calls[0];
    const payload = callArgs[1];
    
    expect(Array.isArray(payload.personalizations)).toBe(true);
    expect(payload.personalizations.length).toBeGreaterThan(0);
  });
});
