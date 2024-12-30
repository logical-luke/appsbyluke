// src/pages/api/sendEmail.json.ts

export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({
        message: `Please fill out all fields.`,
      }),
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  try {
    const sendResult = await resend.emails.send({
      from: "get@appsbyluke.com",
      to: "get@appsbyluke.com",
      subject: `New contact form submission from ${name}`,
      html: `
        <h1>New contact form submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (sendResult.data) {
      return new Response(
        JSON.stringify({
          message: `Thank you for your message! We'll get back to you soon.`,
        }),
        {
          status: 200,
          statusText: "OK",
        }
      );
    } else {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        message: `Sorry, there was an error sending your message. Please try again later.`,
      }),
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
};