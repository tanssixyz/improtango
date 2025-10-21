import { v } from "convex/values";
import { mutation, action, query } from "./_generated/server";
import type { MutationCtx, ActionCtx, QueryCtx } from "./_generated/server";
import { newsletterWelcomeEmail, newsletterAdminNotification, newsletterUnsubscribeNotification } from "./lib/email_templates";

// Subscribe to newsletter
export const subscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx: MutationCtx, args: { email: string }) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("Tämä sähköpostiosoite on jo tilattu uutiskirjeelle.");
    }

    // Add to database
    const id = await ctx.db.insert("newsletter", {
      email: args.email,
      subscribedAt: Date.now(),
    });

    return { id };
  },
});

// Send welcome email (action because it calls external API)
export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
  },
  handler: async (_ctx: ActionCtx, args: { email: string }) => {
    console.log("Sending welcome email to:", args.email);
    console.log("Environment check - API Key present:", !!process.env.AUTH_RESEND_KEY);
    console.log("Environment check - FROM address:", process.env.AUTH_EMAIL);

    const emailPayload = {
      from: process.env.AUTH_EMAIL,
      to: [args.email],
      subject: "Tervetuloa Improtangon uutiskirjeelle",
      html: newsletterWelcomeEmail(args.email),
    };

    console.log("Email payload:", JSON.stringify(emailPayload, null, 2));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AUTH_RESEND_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    console.log("Resend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API Error:", response.status, errorText);
      throw new Error(`Failed to send welcome email: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log("Email sent successfully:", responseData);

    return { success: true };
  },
});

// Send admin notification (action because it calls external API)
export const sendAdminNotification = action({
  args: {
    email: v.string(),
  },
  handler: async (_ctx: ActionCtx, args: { email: string }) => {
    console.log("Sending admin notification for newsletter signup:", args.email);

    const emailPayload = {
      from: process.env.AUTH_EMAIL,
      to: [process.env.ADMIN_EMAIL],
      cc: [process.env.ADMIN_EMAIL_CC],
      subject: "Uusi uutiskirjeen tilaus - Improtango",
      html: newsletterAdminNotification(args.email),
    };

    console.log("Admin notification payload:", JSON.stringify(emailPayload, null, 2));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AUTH_RESEND_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    console.log("Admin notification response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Admin notification error:", response.status, errorText);
      throw new Error(`Failed to send admin notification: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log("Admin notification sent successfully:", responseData);

    return { success: true };
  },
});

// Unsubscribe from newsletter
export const unsubscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx: MutationCtx, args: { email: string }) => {
    // Find the subscriber
    const subscriber = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!subscriber) {
      throw new Error("Sähköpostiosoitetta ei löytynyt uutiskirjeen tilaajista.");
    }

    // Remove from database
    await ctx.db.delete(subscriber._id);

    return { success: true };
  },
});

// Check if email is subscribed (for unsubscribe page)
export const checkSubscription = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx: QueryCtx, args: { email: string }) => {
    const subscriber = await ctx.db
      .query("newsletter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return { isSubscribed: !!subscriber };
  },
});

// Send unsubscribe admin notification (action because it calls external API)
export const sendUnsubscribeNotification = action({
  args: {
    email: v.string(),
  },
  handler: async (_ctx: ActionCtx, args: { email: string }) => {
    console.log("Sending unsubscribe admin notification for:", args.email);

    const emailPayload = {
      from: process.env.AUTH_EMAIL,
      to: [process.env.ADMIN_EMAIL],
      cc: process.env.ADMIN_EMAIL_CC ? [process.env.ADMIN_EMAIL_CC] : undefined,
      subject: "Uutiskirjeen tilaus peruutettu - Improtango",
      html: newsletterUnsubscribeNotification(args.email),
    };

    console.log("Unsubscribe notification payload:", JSON.stringify(emailPayload, null, 2));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AUTH_RESEND_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    console.log("Unsubscribe notification response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unsubscribe notification error:", response.status, errorText);
      // Don't fail the unsubscribe if admin notification fails
      return { success: false, error: errorText };
    }

    const responseData = await response.json();
    console.log("Unsubscribe notification sent successfully:", responseData);

    return { success: true };
  },
});

// List all subscribers (for admin)
export const list = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    return await ctx.db.query("newsletter").order("desc").collect();
  },
});