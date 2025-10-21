# Improtango Website

Modern website for Improtango - a contemporary partner dance form created by Minna Tuovinen & Martin Heslop.

## 🌟 Features

- **Bilingual Support**: Full Finnish and English language support with dynamic switching
- **Modern React Architecture**: Built with React 19, TypeScript, and Vite
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Progressive Web App**: Installable with offline support
- **Smooth Animations**: Framer Motion for engaging user experience
- **SEO Optimized**: Comprehensive meta tags and structured data
- **Contact & Newsletter**: Integrated forms with email handling via Convex and Resend

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router v6
- **Styling**: Tailwind CSS v4, Framer Motion
- **Backend**: Convex (serverless database and functions)
- **Email**: Resend for transactional emails
- **Deployment**: Vercel
- **Language**: i18n with custom context-based translation system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Convex account (for backend functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd improtango
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   VITE_CONVEX_URL=your_convex_deployment_url
   CONVEX_DEPLOY_KEY=your_convex_deploy_key
   AUTH_RESEND_KEY=your_resend_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start Convex development (in another terminal)**
   ```bash
   npx convex dev
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌍 Internationalization

The project supports Finnish (fi) and English (en) languages:

- **Language Context**: `src/lib/language-context.tsx`
- **Content**: Stored in `public/content/fi/` and `public/content/en/`
- **Switching**: Language switcher in header automatically updates all content

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route components (Home, About, Concepts, etc.)
├── lib/                # Utilities, contexts, and configurations
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions

public/
├── content/            # Markdown content files (fi/en)
├── images/             # Static images and assets
└── manifest.json       # PWA manifest

convex/                 # Backend functions and schema
```

## 🎨 Key Components

- **Hero Section**: Dynamic quotes with smooth transitions
- **Photo Strips**: Animated image galleries with multiple animation variants
- **Concepts Section**: Interactive exploration of Improtango's core principles
- **Contact Form**: Full-featured contact system with validation
- **Newsletter Signup**: Email subscription with double opt-in
- **Testimonials**: Dynamic testimonial display

## 📱 PWA Features

- Service worker for offline functionality
- App manifest for installation
- Background sync for form submissions
- Push notification ready

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js` with:
- Custom color palette
- Extended animations
- Typography settings

### Vite
Optimized build configuration with:
- SWC for fast compilation
- Path aliases (@/)
- Asset optimization

## 🚀 Deployment

The site is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
VITE_CONVEX_URL=your_production_convex_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key
AUTH_RESEND_KEY=your_resend_api_key
```

## 📄 Content Management

Content is managed through Markdown files in the `public/content/` directory:

- **Main Page**: Introduction, philosophy, journey sections
- **About Page**: Teacher biographies and stories
- **Concepts**: Seven core principles of Improtango
- **Testimonials**: JSON files with participant experiences

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

For questions about the website or Improtango:

- **Email**: info@improtango.fi
- **Website**: https://improtango.fi

## 📄 License

This project is proprietary and confidential. All rights reserved.
