import { Resend } from "resend";
import WeeklyDigest from "./emails/weekly-digest";

const resend = new Resend(process.env.RESEND_API_KEY);

const { error } = await resend.emails.send({
  from: process.env.FROM || "Reports <onboarding@resend.dev>",
  to: [process.env.TO || "delivered@resend.dev"],
  subject: "Your weekly digest",
  react: <WeeklyDigest {...WeeklyDigest.PreviewProps} />,
});

if (error) throw new Error(error.message);
console.log("Sent.");
