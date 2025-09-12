# Orion AI Finance Platform

## Overview

Orion is an AI-powered Financial Planning & Analysis (FP&A) platform designed as a comprehensive finance team companion. The application provides intelligent financial reporting, scenario modeling, cost intelligence, collaborative planning, and an AI assistant for natural language queries. Built as a modern web application, it features a sophisticated landing page showcasing the platform's capabilities and a dashboard for financial data visualization and analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with a custom design system inspired by shadcn/ui components
- **Component Library**: Comprehensive UI component library built on Radix UI primitives
- **State Management**: TanStack Query for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom theme with CSS variables supporting light/dark modes, featuring a navy/blue/purple color palette

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful APIs with structured error handling and logging middleware
- **Data Access**: Organized storage interface pattern with both in-memory and database implementations
- **Development**: Hot module replacement and development middleware integration

### Database & ORM
- **Database**: PostgreSQL configured for production use
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions with validation using Zod
- **Migrations**: Drizzle Kit for database schema migrations
- **Connection**: Neon Database serverless PostgreSQL integration

### Component Architecture
- **Landing Page**: Modular component structure with Hero, Features, Value Proposition, Deep Dive, and Use Cases sections
- **Dashboard**: Comprehensive financial data visualization with charts, metrics, and interactive elements
- **Design Patterns**: Container/Presenter pattern with reusable UI components
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Development Tooling
- **Type Checking**: Strict TypeScript configuration with path mapping
- **Linting & Formatting**: Integrated code quality tools
- **Asset Management**: Vite-based asset bundling with alias support
- **Environment Management**: Separate development and production configurations

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing
- **react-hook-form** with **@hookform/resolvers**: Form handling and validation

### UI Component Libraries
- **@radix-ui/react-***: Accessible, unstyled UI primitives for complex components (accordion, dialog, dropdown, navigation, etc.)
- **lucide-react**: Modern icon library
- **recharts**: Data visualization and charting library
- **embla-carousel-react**: Carousel/slider functionality

### Database & API Integration
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Schema validation integration
- **connect-pg-simple**: PostgreSQL session store

### Styling & Design
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx** and **tailwind-merge**: Conditional class name utilities
- **autoprefixer**: CSS vendor prefixing

### Development & Build Tools
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React integration for Vite
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **zod**: Schema validation and type inference