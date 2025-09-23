# Orion Landing Page

A beautiful, modern landing page for Orion - Your AI-Powered Finance Team Companion.

**🎯 This is a standalone, simplified version extracted from the full application, focusing purely on the landing page experience.**

## Features

- **Modern Design**: Clean, professional design with smooth animations and micro-interactions
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices  
- **Fast Loading**: Built with Vite for optimal performance and hot reload
- **Accessible**: Follows WCAG 2.1 accessibility best practices
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **No Authentication**: Pure frontend experience without login complexity

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd OrionCodex
git checkout feature/landing-page
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
client/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (Radix UI)
│   │   ├── Hero.tsx        # Hero section
│   │   ├── Navigation.tsx  # Navigation bar
│   │   ├── Footer.tsx      # Footer
│   │   └── ...             # Other landing page components
│   ├── pages/
│   │   └── Home.tsx        # Main landing page
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── index.css           # Global styles
│   └── main.tsx            # App entry point
├── public/                 # Static assets
└── index.html              # HTML template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type check

## Landing Page Sections

1. **Hero Section** - Main value proposition with animated gradient background and floating demo cards
2. **Features Overview** - 5 core features with interactive hover effects and detailed descriptions  
3. **Value Proposition** - Key metrics (10x faster, 99.9% accuracy, 95% forecast accuracy) with capability highlights
4. **Feature Deep Dive** - Detailed explanations with mockup images for Smart Reporting, Scenario Modeling, and Cost Intelligence
5. **Use Cases** - Interactive role-based stories for Finance Analyst, Controller, CFO, and Department Head
6. **Footer** - Comprehensive company information with organized link sections and social media

## Customization

### Colors
The color scheme is defined in `tailwind.config.ts` and can be customized by modifying the CSS variables in `client/src/index.css`.

### Content
All text content can be found in the respective component files under `client/src/components/`.

### Images
Background images and mockups are stored in `attached_assets/generated_images/`.

## Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## What's Different from Full Version?

This landing page version has been **simplified and optimized** by removing:

- ❌ Server-side components (Express.js, API routes)
- ❌ Database integration (PostgreSQL, Drizzle ORM) 
- ❌ Authentication system (Keycloak)
- ❌ Complex routing and navigation
- ❌ Admin dashboards and panels
- ❌ File upload functionality
- ❌ WebSocket connections

**✅ What remains**: Pure frontend React experience focused on showcasing Orion's value proposition.

## Version History

- **v1.0.0** (2024-09-23) - Initial landing page extraction from `draft/mocking-frontend` branch
- Simplified architecture with 25 production dependencies (down from 70+)
- Clean, maintainable codebase ready for deployment

## Contributing

1. Create a feature branch from `feature/landing-page`
2. Make your changes following the existing patterns
3. Test across different devices and browsers
4. Ensure accessibility compliance
5. Submit a pull request with clear description

## License

MIT License - see LICENSE file for details.