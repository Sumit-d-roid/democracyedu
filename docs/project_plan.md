# SambhidanX Project Plan

## Core Decisions & Constraints

### Target Audience & Content
- **Primary Audience**: Students and grassroots users
- **Access Level**: Public access is acceptable
- **Content Style**: Mix of formal and simplified content
- **Content Structure**: 
  - Full constitutional text
  - Simplified summaries
  - Bilingual support (English & Nepali)

### Technical Constraints
- **Initial Storage**: localStorage (anonymous users)
- **Future Auth**: Google (Gmail), Apple, Email
- **Content Management**: Single editor initially (no CMS needed)
- **Social Features**: Full leaderboard + social sharing (public & private groups)
- **Data Collection**: Email collection for login
- **Initial Hosting**: Replit (1 month)
- **Domain**: sambhidanx.org
- **Success Metrics**: User count and teacher adoption

## Technical Recommendations

### Backend & Authentication (Supabase)
- Free tier with generous limits
- Built-in features:
  - PostgreSQL database
  - Authentication
  - Storage
  - Realtime capabilities
- Support for OAuth providers (Google & Apple)
- SQL database advantage for leaderboards and groups

### Frontend Hosting
- **Primary Options**:
  - Vercel (recommended for Next.js compatibility)
  - Netlify (suitable for static React + Vite)
- Use Replit for development/preview
- Migrate to Vercel/Netlify for production

### Domain Configuration
- Point sambhidanx.org to Vercel/Netlify
- Standard DNS configuration
- Minimal cost (domain registration only)

### Authentication Implementation
Supabase Auth with:
- Email/password (verified)
- Google OAuth
- Apple Sign-in

### Content Management
#### Phase 1:
- Versioned JSON files in repository
- Manual editing process
- Offline-safe loading

#### Later Phases:
- Migration to Supabase
- Structured data for:
  - Lessons
  - Quizzes
  - User progress
  - Leaderboards

### LLM Integration
- Use for question generation drafts
- Require human review before publishing
- Maintain accuracy control
- Prevent harmful/incorrect content

### Social Features
#### Leaderboards
- Global (public)
- Group-based (private)
  - Teacher-created groups
  - Student invitations

#### Social Sharing
- Shareable achievement links
- Social cards with scores/badges
- Privacy-conscious PII handling

### Analytics
- **Primary Tool**: Google Analytics 4 (free)
- **Alternative**: Plausible (paid, privacy-focused)
- **Key Metrics**:
  - Lesson completions
  - Quiz attempts
  - Teacher signups

### Accessibility
- WCAG AA compliance focus
- Semantic HTML
- Color contrast adherence
- Keyboard navigation
- Font: Noto Sans Devanagari for Nepali text