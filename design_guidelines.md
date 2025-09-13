# DemocracyEdu Design Guidelines

## Design Approach: Reference-Based + Educational Focus
Drawing inspiration from modern educational platforms like Duolingo and Khan Academy, combined with civic engagement aesthetics. This approach balances engaging visual design with clear information hierarchy for effective learning.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Deep Blue: 220 85% 25% (Nepal flag inspired, trust/government)
- Crimson Red: 350 75% 45% (Nepal flag inspired, energy/passion)

**Supporting Colors:**
- Success Green: 145 70% 35% (correct answers, progress)
- Warning Orange: 35 85% 55% (attention, incomplete)
- Background Light: 210 15% 98% (light mode)
- Background Dark: 220 15% 12% (dark mode)

### Typography
- **Primary Font:** Inter (Google Fonts) - excellent for bilingual text rendering
- **Headings:** Semi-bold (600) for hierarchy
- **Body:** Regular (400) and Medium (500)
- **Special:** Devanagari-friendly font stack for Nepali text

### Layout System
Using Tailwind spacing units: **2, 4, 6, 8, 12, 16** for consistent rhythm
- Cards: p-6, gap-4
- Sections: py-12, px-4
- Components: m-2, p-4

### Component Library

**Navigation:**
- Sticky header with language toggle (flag icons)
- Clean breadcrumb navigation
- Mobile hamburger menu

**Cards:**
- Lesson cards with progress indicators
- Quiz cards with difficulty badges
- Achievement cards for milestones

**Interactive Elements:**
- Progress bars with animated fills
- Point counters with celebration effects
- Quiz buttons with immediate feedback states

**Data Display:**
- Dashboard grids for progress tracking
- Leaderboard tables (if social features added)
- Statistics cards showing completion rates

## Visual Treatment

**Gradients:**
- Hero backgrounds: Subtle blue-to-purple gradients (220 85% 25% to 250 70% 35%)
- Card overlays: Light gradients for depth
- Button states: Minimal gradient accents

**Contrast Strategy:**
- High contrast for readability in both languages
- Color-coding for different lesson categories
- Clear visual hierarchy with typography scales

**Background Treatments:**
- Clean, minimal backgrounds with subtle geometric patterns
- Constitutional document textures (very subtle)
- Gradient overlays on hero sections

## Landing Page Structure (3 sections max)

**Hero Section:**
- Constitutional book/scroll imagery with modern overlay
- Bold bilingual headline about civic education
- Primary CTA button with blurred background on hero image

**Value Proposition:**
- Three-column feature grid (Gamified, Bilingual, Progress)
- Clean icons representing each feature

**Social Proof/CTA:**
- Simple testimonial or usage stats
- Final call-to-action to start learning

## Images
- **Hero Image:** Constitutional document or Nepal civic symbols with modern digital overlay
- **Lesson Thumbnails:** Clean illustrations representing different constitutional topics
- **Achievement Badges:** Custom-designed icons for different milestones
- **Cultural Elements:** Subtle Nepali cultural patterns as decorative elements

## Accessibility & Bilingual Considerations
- Consistent dark mode across all inputs and components
- RTL-friendly layouts (though Nepali is LTR)
- High contrast ratios for both English and Devanagari text
- Language toggle prominently placed in header
- Persistent language preference in localStorage

## Animation Guidelines
- Minimal, purposeful animations only
- Progress bar fills and point counter increments
- Subtle hover states on interactive elements
- Page transitions kept simple and fast

This design creates an engaging, educational experience that respects both modern web standards and the cultural significance of constitutional learning in Nepal.