import { v, ConvexError } from "convex/values";
import { action } from "./_generated/server";
import type { ActionCtx } from "./_generated/server";
import { contactConfirmationEmail } from "./lib/email_templates";
import { api } from "./_generated/api";

export const sendContactMessage = action({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx: ActionCtx, args: { name: string; email: string; subject: string; message: string }) => {
    // Input validation and sanitization
    if (!args.name?.trim() || args.name.length > 100) {
      throw new ConvexError("Name is required and must be less than 100 characters");
    }
    if (!args.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email) || args.email.length > 254) {
      throw new ConvexError("Valid email address is required");
    }
    if (!args.subject?.trim() || args.subject.length > 200) {
      throw new ConvexError("Subject is required and must be less than 200 characters");
    }
    if (!args.message?.trim() || args.message.length > 5000) {
      throw new ConvexError("Message is required and must be less than 5000 characters");
    }
    // Log submission without sensitive data
    console.log("Contact form submission received for email:", args.email.substring(0, 3) + "***");
     // Check rate limit
    const rateCheck = await ctx.runMutation(api.rateLimit.checkAndUpdateRateLimit, {
      email: args.email
    })
    
    if (!rateCheck.allowed) {
      throw new ConvexError(
        `Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.`
      )
    }

    // Check environment variables
    const requiredEnvVars = {
      AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
      AUTH_EMAIL: process.env.AUTH_EMAIL,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_EMAIL_CC: process.env.ADMIN_EMAIL_CC,
    };
    

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        console.error(`Missing environment variable: ${key}`);
        throw new ConvexError(`Missing environment variable: ${key}`);
      }
    }

    try {
      // 1. Send notification email to admins
      const adminEmailPayload = {
        from: process.env.AUTH_EMAIL,
        to: [process.env.ADMIN_EMAIL],
        cc: [process.env.ADMIN_EMAIL_CC],
        subject: `Yhteydenotto: ${args.subject}`,
        html: `
          <h2>Uusi yhteydenotto verkkosivuilta</h2>
          <p><strong>Nimi:</strong> ${args.name}</p>
          <p><strong>Sähköposti:</strong> ${args.email}</p>
          <p><strong>Aihe:</strong> ${args.subject}</p>
          <p><strong>Viesti:</strong></p>
          <p>${args.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/\n/g, '<br>')}</p>
        `,
      };

      console.log("Sending admin notification email to:", process.env.ADMIN_EMAIL);

      const adminResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.AUTH_RESEND_KEY}`,
        },
        body: JSON.stringify(adminEmailPayload),
      });

      const adminResponseText = await adminResponse.text();
      console.log("Admin email response status:", adminResponse.status);

      if (!adminResponse.ok) {
        throw new ConvexError(`Failed to send admin email: ${adminResponse.status} ${adminResponse.statusText} - ${adminResponseText}`);
      }

      // 2. Send confirmation email to user
      const confirmationEmailPayload = {
        from: process.env.AUTH_EMAIL,
        to: [args.email],
        subject: "Kiitos yhteydenotostasi - Improtango",
        html: contactConfirmationEmail(args.name),
      };

      console.log("Sending confirmation email to user");

      const confirmationResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.AUTH_RESEND_KEY}`,
        },
        body: JSON.stringify(confirmationEmailPayload),
      });

      const confirmationResponseText = await confirmationResponse.text();
      console.log("Confirmation email response status:", confirmationResponse.status);

      if (!confirmationResponse.ok) {
        console.warn(`Failed to send confirmation email: ${confirmationResponse.status} ${confirmationResponse.statusText} - ${confirmationResponseText}`);
        // Don't fail the whole operation if confirmation email fails
      }

      console.log("Emails sent successfully");
      return { success: true };
    } catch (error) {
      console.error("Error in sendContactMessage:", error);
      throw error;
    }
  },
});