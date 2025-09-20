# Glossary Viewer & Content Enrichment

This project includes a structured glossary for each lesson and an enrichment script to expand lessons and quizzes.

## Glossary Viewer

- Location: `client/src/pages/LessonDetail.tsx`
- Behavior: When a lesson includes a `glossary` array (`[{ term, definition }]`), a Glossary section appears under the lesson content.
- i18n Keys:
  - `glossary.title`
  - `glossary.description`

To add or update glossary terms:
- Edit the lesson JSON in `content/lessons/*.json` and add/modify the `glossary` field:

```json
{
  "glossary": [
    { "term": "Federalism", "definition": "Division of powers among levels of government." },
    { "term": "Judicial Review", "definition": "Court power to invalidate unconstitutional acts." }
  ]
}
```

## Content Enrichment Script

- Location: `scripts/content/enrich.ts`
- Purpose: Appends helpful lesson sections, adds a summary point, injects a small glossary (if missing), and expands quizzes with both generic and topic-specific questions.
- Idempotent: The script won’t duplicate existing sections or questions and auto-generates unique question IDs.

### Run Enrichment

```bash
npm run content:enrich
```

The script will report counts of lessons and quizzes updated.

### Where Content Lives
- Lessons: `content/lessons/*.json`
- Quizzes: `content/quizzes/*.json`
- Manifest: `content/manifest.json`

### Validation

Run the test suite to validate schemas and integrations:

```bash
npm test
```

## Localization

UI strings for the Glossary appear in `client/src/i18n/en/ui.json` and `client/src/i18n/ne/ui.json`.
- Add `glossary.*` keys to Nepali (`ne/ui.json`) for full localization support.

## Notes
- Glossary schema currently supports `term` and `definition`.
- If you want to support additional fields (e.g., examples, related terms), extend `shared/contentSchemas.ts` and update the LessonDetail viewer accordingly.