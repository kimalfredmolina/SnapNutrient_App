import axios from "axios";
import Constants from "expo-constants";


const { SENDGRID_API_KEY, SENDGRID_API_URL, SENDGRID_FROM_EMAIL } = Constants.expoConfig?.extra || {};

console.log("Loaded SendGrid URL:", SENDGRID_API_URL); // Debug

export const sendEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  try {
    const response = await axios.post(
      SENDGRID_API_URL,
      {
        personalizations: [
          {
            to: [{ email: "snapnutrientapp@gmail.com" }],
            subject: subject,
          },
        ],
        from: { email: SENDGRID_FROM_EMAIL, name: "SnapNutrient App" },
        content: [
          {
            type: "text/plain",
            value: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("SendGrid error:", error.response?.data || error.message);
    throw error;
  }
};
