# Content Expansion Plan

## Vision
Provide two audience-tailored learning tracks (School vs College) covering the full Constitution of Nepal with pedagogically structured lessons, cross-linked objectives, and progressively rigorous assessments.

## Audience Differentiation
| Aspect | School Track | College Track |
|--------|--------------|---------------|
| Reading Level | Simplified, introductory | Doctrinal + analytical |
| Section Length | 120–250 words | 300–600 words |
| Key Points | 3–5 per section | 5–9 per section |
| Learning Objectives | Recall / Understand | Analyze / Apply / Evaluate |
| Quiz Style | Definition & basic scenarios | Application, comparative, synthesis |
| Metadata Depth | Minimal | Full (sources, related, complexity) |

## Lesson Metadata Extensions
- `audiences`: ['school' | 'college']
- `learningObjectives`: Bloom-aligned verbs
- `sourceArticles`: Formal references (e.g., `Art. 17(1)`)
- `complexityIndex`: 0–1 heuristic (institutional interplay + abstraction)
- `relatedLessons`: adjacency graph for navigation
- `tags`: thematics: federalism, rights, institutions, finance, emergency

## Quiz Metadata Extensions
- `cognitiveLevel` per quiz (block-level inference; per-question future)
- `relatedArticles`, `targetObjectives`

## Coverage Strategy
1. Map Parts → Clusters → Lessons → Sections
2. Ensure every fundamental right & major institution has at least one dedicated lesson section
3. Coverage Matrix Dimensions:
   - Rights (Equality, Freedom, Social Justice, Economic, Cultural, Environment)
   - Institutions (Executive, Legislature, Judiciary, Constitutional Bodies)
   - Federal Layers (Federal, Provincial, Local)
   - Processes (Legislation, Finance, Amendment, Emergency)
   - Integrity & Oversight (Commissions, RTI, Anti-Corruption)

## Phased Rollout (Condensed)
1. Foundation: Schema + 2 dual-track sample lessons
2. Core Rights & Institutions (≈12 lessons dual track)
3. Federal Structure & Processes (≈10 lessons)
4. Advanced Comparative & Applied (college-only + optional school enrichers)
5. QA & Calibration (question difficulty balancing)
6. Analytics & Adaptive (future: performance-based suggestion)

## Authoring Workflow
1. Extract Articles → JSON (raw article units)
2. Cluster into thematic groups
3. Draft school variant first (forces clarity) → expand into college variant (add nuance)
4. Auto-suggest keyPoints & objectives (script later)
5. Manual refinement + sourcing
6. Generate initial quizzes (template library) → Human review
7. Validate (schema + coverage script + duplication check)

## Quality Gates
- All lessons: ≥1 learning objective per section (college track)
- Key point density: ≤1 per 40 words (school), ≤1 per 60 words (college)
- Quiz explanation length: ≥15 words; must reference concept, not restate choice.
- No lesson orphaned (must have ≥1 related lesson) once Phase 3 complete

## Metrics
- Coverage % = (# rights / total rights) + (# bodies / total bodies) weighted
- Cognitive balance: target distribution recall 30% / comprehension 30% / application 25% / analysis 10% / evaluation 5%
- Readability index target (school): Flesch-Kincaid Grade ≤ 9

## Next Automation Targets
- Script: generate scaffold from raw article cluster
- Script: compute complexityIndex (links + cross references count)
- Script: quiz distractor generation using semantic similarity filtering

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Scope creep | Strict phase boundaries | 
| Inconsistent tone | Style guide + lint script |
| Overlapping content | Coverage matrix diff tool |
| Unbalanced quizzes | Difficulty calibration script |

## Immediate Next Micro-Batches
1. Add two placeholder dual-track lessons (Fundamental Rights – Intro; Federalism – Intro)
2. Add basic quiz variants (school vs college) referencing same concept but different depth
3. Add coverage matrix stub JSON for tracking

---
(End of initial plan – expand iteratively as implementation proceeds.)
