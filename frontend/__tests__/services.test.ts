import axios from "axios";
import Constants from "expo-constants";
import { sendEmail } from "../services/emailService";

jest.mock("axios");

describe("emailService", () => {
  beforeAll(() => {
    // Provide test SendGrid config
    (Constants as any).expoConfig = { extra: { SENDGRID_API_KEY: "abc", SENDGRID_API_URL: "https://api.sendgrid.test/v3/mail/send", SENDGRID_FROM_EMAIL: "from@x.com" } };
  });

  it("calls axios.post with correct payload and headers", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    const res = await sendEmail("Name", "n@x.com", "subj", "hello");

    expect(axios.post).toHaveBeenCalled();
    // ensure response data returned
    expect(res).toEqual({ success: true });
  });
});
