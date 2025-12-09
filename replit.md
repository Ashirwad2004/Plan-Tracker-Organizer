# SmartPlan - Personal Plan Tracker & Organizer

## Overview

SmartPlan is a productivity-focused web application for personal task and plan management. Users can create daily, weekly, and monthly plans, track progress, set priorities, organize tasks into categories, and visualize productivity with charts. The application follows a clean, Linear/Notion-inspired design system emphasizing clarity, scannable information hierarchy, and efficient workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for theming (light/dark mode support)
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Charts**: Recharts for data visualization on the analytics page

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **API Design**: RESTful API with JSON endpoints under `/api/` prefix
- **Storage Pattern**: Interface-based storage abstraction (`IStorage`) with in-memory implementation (`MemStorage`), designed for easy database migration
- **Validation**: Zod schemas for request/response validation, integrated with Drizzle ORM via drizzle-zod

### Data Layer
- **Schema Definition**: Drizzle ORM with PostgreSQL dialect for type-safe schema definitions
- **Current Storage**: In-memory storage (MemStorage class) - can be migrated to PostgreSQL
- **Schema Location**: `shared/schema.ts` contains all data models (plans, users) shared between client and server

### Key Data Models
- **Plans**: Tasks with title, description, priority (low/medium/high), category (work/study/health/finance/personal), status (pending/completed), and optional deadline
- **Users**: Basic user model with username and password for future authentication

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: esbuild bundles server code, Vite builds client assets to `dist/public`
- **Type Checking**: TypeScript with strict mode, path aliases (`@/` for client, `@shared/` for shared code)

## External Dependencies

### Database
- **PostgreSQL**: Configured via Drizzle ORM (requires `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migration tool (`npm run db:push`)

### UI Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, select, etc.)
- **Lucide React**: Icon library
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel component

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment
- **PostCSS/Autoprefixer**: CSS processing for Tailwind