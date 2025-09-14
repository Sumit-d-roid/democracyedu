# Immediate Actions

## 1. Content Structure
- [ ] Create and commit initial content files:
  - `content/en.json`
  - `content/ne.json`
  - Include existing three lessons

## 2. Component Development
- [ ] Request and implement core components:
  - LessonPage.jsx
  - MiniQuiz.jsx
  - LanguageContext.jsx

## 3. Backend Preparation
- [ ] Create Supabase account
- [ ] Save provided SQL schema for later implementation

## 4. Documentation
- [ ] Add README.md with:
  - Content schema documentation
  - Contributor guidelines
  - Setup instructions

## 5. Font Configuration
- [ ] Add Noto Sans Devanagari to index.html:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
  ```
- [ ] Update CSS configuration:
  ```css
  body {
    font-family: 'Inter', 'Noto Sans Devanagari', sans-serif;
  }
  ```

## 6. Decision Points
- [ ] Confirm component generation requirements
- [ ] Review proposed technical architecture
- [ ] Schedule infrastructure setup
- [ ] Plan content migration strategy

## 7. LLM Integration Planning
- [ ] Review question generation strategy
- [ ] Set up review workflow
- [ ] Define quality control process
- [ ] Create prompt templates

## Notes
- Keep content in version control initially
- Plan for Supabase migration
- Maintain human review for AI-generated content
- Focus on teacher adoption metrics