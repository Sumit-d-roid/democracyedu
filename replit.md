# DemocracyEdu - Constitutional Education Platform

## Overview

DemocracyEdu is an interactive educational platform designed to teach Nepal's Constitution through gamified lessons and quizzes. The application provides a bilingual learning experience (English and Nepali) with progress tracking, point systems, and achievement rewards. The platform follows modern educational app design principles similar to Duolingo and Khan Academy, making constitutional learning engaging and accessible.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for language preferences and progress tracking
- **Data Fetching**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Component Design System
- **UI Components**: Radix UI primitives with custom styling
- **Design Token System**: CSS custom properties for theming with light/dark mode support
- **Typography**: Inter font with Devanagari support for bilingual content
- **Color Palette**: Nepal flag-inspired colors (deep blue, crimson red) with semantic color tokens
- **Layout System**: Consistent spacing using Tailwind's spacing scale

### Content Management
- **Lesson Content**: TypeScript interfaces defining structured lesson data with sections, key points, and metadata
- **Quiz System**: Type-safe quiz questions with difficulty levels, explanations, and scoring
- **Internationalization**: Context-based translation system supporting English and Nepali
- **Progress Tracking**: Local storage-based user progress with points, completed lessons, and quiz scores

### Data Architecture
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: User management system with extensible design for future features
- **Storage Interface**: Abstracted storage layer supporting both in-memory and database implementations
- **Session Management**: Express session handling with PostgreSQL session store

### Server Architecture
- **Backend**: Express.js with TypeScript
- **API Design**: RESTful endpoints with JSON communication
- **Middleware**: Request logging, error handling, and CORS configuration
- **Development**: Hot module replacement with Vite integration
- **Build Process**: ESBuild for server-side bundling

### Application Structure
- **Monorepo Layout**: Shared types and schemas between client and server
- **Route Organization**: Page-based routing with dedicated components
- **Context Providers**: Language and progress contexts wrapping the application
- **Error Handling**: Custom error boundaries and 404 page handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity optimized for serverless environments
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing library
- **@hookform/resolvers**: Form validation with Zod schema integration

### UI Framework
- **@radix-ui/***: Comprehensive set of accessible UI primitives including dialogs, dropdowns, accordions, and form controls
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Component variant management for consistent styling
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **vite**: Modern build tool with fast development server and optimized production builds
- **typescript**: Static type checking for both client and server code
- **drizzle-kit**: Database schema management and migration tools
- **esbuild**: Fast JavaScript bundler for server-side code

### Styling and Theming
- **clsx** and **tailwind-merge**: Utility functions for conditional class management
- **postcss**: CSS processing with Tailwind CSS plugin integration
- **autoprefixer**: Automatic vendor prefix addition for CSS compatibility

### Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Local Storage**: Browser-based storage for user progress and preferences