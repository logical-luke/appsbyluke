export const prerender = false;
import type { APIRoute } from "astro";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ message: "Fill out all fields." }), { status: 400 });
  }

  const msg = {
    to: 'get@appsbyluke.com',
    from: 'get@appsbyluke.com',
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
  };

  try {
    await sgMail.send(msg);
    return new Response(JSON.stringify({ message: "Message sent successfully!" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Failed to send message." }), { status: 500 });
  }
};