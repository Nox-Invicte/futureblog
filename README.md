# Overview

FutureBlogs is a modern full-stack blogging platform built with React, Express.js, and PostgreSQL. The application allows users to create accounts, write and publish blog posts, and browse content from other authors. It features a sleek, modern UI with dark theme styling and includes comprehensive authentication, content management, and social features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for authentication state with persistence middleware
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring dark theme, glass morphism effects, and gradient styling
- **Data Fetching**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: bcrypt for password hashing with session-based auth
- **API Design**: RESTful API with JSON responses and comprehensive error handling
- **Development Setup**: Hot module replacement with Vite integration in development mode

## Database Design
- **Users Table**: Stores user credentials, profile information, and timestamps
- **Blog Posts Table**: Contains post content, metadata, author relationships, and publication status
- **Schema Validation**: Zod schemas for type-safe data validation shared between client and server
- **Relationships**: Foreign key constraints between users and blog posts

## Authentication System
- **Registration/Login**: Email and password-based authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Persistent authentication state stored in browser
- **Route Protection**: Client-side route guards for authenticated pages

## Data Storage Strategy
- **Primary Storage**: PostgreSQL database with Neon serverless hosting
- **Development Storage**: In-memory storage implementation for development/testing
- **ORM Benefits**: Type-safe database operations with automatic migrations support
- **Connection Management**: Database connection pooling and environment-based configuration

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting service
- **Connection**: Uses `@neondatabase/serverless` driver for database connectivity

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Modern icon library for consistent iconography
- **Google Fonts**: Inter font family for typography

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
// ...existing code...

## Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Hookform Resolvers**: Integration between React Hook Form and Zod

## State Management and Data Fetching
- **Zustand**: Lightweight state management with TypeScript support
- **TanStack React Query**: Powerful data synchronization and caching library
- **Persistence**: Browser storage integration for authentication state