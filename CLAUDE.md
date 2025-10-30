# Improtango Website - Claude Context

## Project Overview

Modern tango dance website for **Minna Tuovinen & Martin Heslop**. Built with React + TypeScript, using Convex backend for newsletter/contact forms.

## Key Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Router**: React Router v6 (migrated from Tanstack Router)
- **Backend**: Convex (newsletter, contact forms)
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Recent Major Changes

1. **Router Migration**: Switched from Tanstack Router to React Router v6
2. **Visual Enhancements**: Added teal-emerald gradient theme throughout
3. **Logo Update**: Changed from burgundy to teal gradient for consistency
4. **Navigation**: Modern hamburger menu with cross-page section linking
5. **Forms**: Enhanced newsletter signup and contact forms with backdrop blur

## Current Design Language

- **Colors**: Teal (#14b8a6) to emerald (#10b981) gradients
- **Effects**: Glass morphism, backdrop blur, subtle shadows
- **Typography**: Modern, clean with gradient accents under section titles
- **Animations**: Subtle hover effects, smooth transitions (300ms)

## Key Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npx convex dev` - Convex backend development

## Important Files

- `/src/components/layout/Header.tsx` - Navigation with hamburger menu
- `/src/components/main-page/NewsletterSignup.tsx` - Enhanced newsletter form
- `/src/components/main-page/ContactForm.tsx` - Contact form with Convex
- `/src/components/Icons.tsx` - Logo with teal gradient
- `/src/lib/language-context.tsx` - Finnish/English i18n

## Current Status

Website is production-ready with modern design, all forms functional, and consistent teal gradient branding throughout.
Website has been deployed to vercel
