export const prerender = false;
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ message: "Fill out all fields." }), { status: 400 });
  }

  const body = JSON.stringify({
    personalizations: [{ to: [{ email: "get@appsbyluke.com" }] }],
    from: { email: "get@appsbyluke.com" },
    subject: `New message from ${name}`,
    content: [{
      type: "text/plain",
      value: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    }]
  });

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: body
    });

    if (response.ok) {
      return new Response(JSON.stringify({ message: "Message sent successfully!" }), { status: 200 });
    } else {
      throw new Error(`SendGrid API responded with status ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Failed to send message." }), { status: 500 });
  }
};