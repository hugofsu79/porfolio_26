import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.formData();

        const firstname = data.get("firstname");
        const email = data.get("email");
        const message = data.get("message");

        if (!firstname || !email || !message) {
            return new Response("Missing fields", { status: 400 });
        }

        console.log("FORM DATA →", { firstname, email, message });

        const result = await resend.emails.send({
            from: "Contact Portfolio <contact@hugofoisseau.fr>",
            to: import.meta.env.CONTACT_RECEIVER_EMAIL,
            replyTo: email as string,
            subject: `Nouveau message de ${firstname}`,
            html: `
        <p><strong>Prénom :</strong> ${firstname}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br/>${message}</p>
      `,
        });

        console.log("RESEND RESULT →", result);

        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("RESEND ERROR →", error);

        return new Response(
            JSON.stringify({ success: false, error: "Email not sent" }),
            { status: 500 }
        );
    }
};