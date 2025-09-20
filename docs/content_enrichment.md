# Content enrichment sweep (September 2025)

We enriched all lessons and quizzes to improve learning depth and practice:

- Lessons: added sections if missing
  - `Key Terms and Definitions`
  - `Case Study: Applying Concepts`
  - `Implementation Gaps and Challenges`
  - `Future Outlook`
  - `Quick Recap and Reflection`
- Quizzes: appended up to four pedagogy-aligned questions:
  - Multiple-select on understanding components
  - True/False on value of case studies
  - Multiple-choice on active recall study strategy
  - Multiple-choice and multiple-select on real-world connection and evaluating claims

All updates conform to `shared/contentSchemas.ts` and were applied programmatically.

## Rerun the enrichment

If new lessons/quizzes are added and you want to apply the same enrichment:

```bash
npm run content:enrich
npm test
```

The script updates only when changes are needed and keeps existing unique sections intact. It auto-generates unique quiz question IDs compatible with existing numbering.
