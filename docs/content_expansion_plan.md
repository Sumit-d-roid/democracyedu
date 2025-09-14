<!--
   content_expansion_plan.md
   Comprehensive roadmap for scaling constitutional literacy content (Nepal) across dual audiences.
   This document is source-of-truth for taxonomy, granularity, schema evolution, quiz strategy,
   ingestion pipeline, and phased execution.
-->

# Constitution Content Expansion Plan

## 1. Goals & Guiding Principles
**Primary Goal:** Build a durable, academically credible, dual-track (School / College) learning system covering the full Constitution of Nepal with progressive depth, pedagogical structure, and assessment fidelity.

**Principles:**
- Pedagogy first, automation second.
- Backward-compatible schema evolution (optional fields only until stabilization).
- Coverage traceability: every lesson and quiz maps to constitutional articles or doctrinal clusters.
- Dual-track differentiation by cognitive level, not by token duplication.
- Incremental shipping: small, reversible commits; observable progress.

## 2. Master Taxonomy (Teachability Map)
Derived from Constitution of Nepal 2015 (public domain). Grouped for instructional coherence.

| Cluster ID | Teaching Cluster | Core Sub-Themes (Sections) | Notes |
|------------|------------------|----------------------------|-------|
| prelim | State, Sovereignty & Preamble Context | Sovereignty, Supremacy, State form | Frame narrative |
| citizenship | Citizenship | Acquisition, Descent, Dual restrictions, Documentation | Deep submodules later |
| rights-foundations | Fundamental Rights: Equality & Freedom | Equality clauses, Non-discrimination, Freedom rights bundle | Often exam-heavy |
| rights-justice | Justice & Access | Due process, Fair trial, Writs, Remedies | Link judiciary |
| rights-social | Social & Economic Rights | Health, Education, Labor, Social security | Progressive realization angle |
| rights-cultural | Identity & Cultural Rights | Language, Religion, Cultural heritage | Cross-link to inclusion bodies |
| duties | Fundamental Duties | Civic duties, Responsibility framing | Small, pairs with rights |
| directive-policies | Directive Principles & State Policies | Principles, Policies, State obligations | Distinguish from enforceable rights |
| federal-structure | Federal Architecture | Distribution of powers, Residual powers, Inter-government relations | Link to fiscal |
| executive-federal | President / VP / Council of Ministers | Election, Powers, Removal, Acting roles | Combine Parts 6 & 7 elements |
| legislature | Federal Legislature | House of Representatives, National Assembly, Legislative process | Could split into two lessons |
| judiciary | Judiciary | Appointment, Jurisdiction, Independence safeguards | Case references optional |
| constitutional-bodies | Constitutional Commissions | CIAA, Auditor General, PSC, Election, NHRC, Inclusion Commissions | Multi-section mega-lesson or split |
| provincial | Provincial Governance | Assemblies, Executives, Relations with federal | Harmonize with federal structure |
| local | Local Governance | Municipalities, Rural municipalities, Competencies | Practical governance |
| fiscal | Fiscal & Financial Procedure | Budget cycle, Auditor role, Finance Commission | Data for economic rights linkage |
| emergency-security | Emergency & Security Framework | Emergency powers, National Security Council, Army command | Safeguards vs rights |
| amendment | Amendment Process | Procedure, Limitations, Safeguards | Advanced analysis |
| elections-parties | Elections & Political Parties | Regulation, Election process, Party governance | EC role emphasized |
| environment-resources | Land & Natural Resources / Environment | Environmental rights, Resource allocation, Sustainable use | Cross with economic rights |
| transitional | Transitional & Implementation | Legacy provisions, Continuity clauses | College-only depth |
| comparative | Comparative & Analytical Modules | Nepal vs other constitutions, Rights alignment | Optional enrichment |
| case-law | Interpretive Trends & Case Law | Landmark decisions, Jurisprudential shifts | College advanced only |

Each cluster -> 1+ Lessons (School + College variants if justified). Large clusters (e.g., constitutional-bodies) can be split by functional grouping.

## 3. Granularity & Structuring Rules
| Level | Criteria | Target Length | Quality Heuristics |
|-------|---------|---------------|--------------------|
| Lesson | Cohesive constitutional theme; >3 institutional relationships OR 15–25 min study | 900–1600 words (college), 600–1100 (school) | Reading flow, layered complexity |
| Section | Single sub-theme with unified objective | 120–250 words (school) / 250–600 (college) | ≤1 concept pivot per section |
| Key Point | High-yield doctrinal fact, definitional hinge, exam trigger | 12–30 words | Avoid redundancy; actionable memory hook |
| Summary Block | 5–7 “Core Takeaways” | ~10% of lesson length | Must map back to sections |
| Advanced Supplement | Only if optional complexity >30% of base lesson | Flexible | Flag difficulty: advanced |

Decision heuristics:
- If draft > 1200 words before supplements → split.
- If >6 sections OR section >9 key points → restructure.
- Merge trivial single-article sections unless conceptually distinct.

## 4. Schema Extensions (All Optional Initially)
Current base already has: `audiences`, `learningObjectives`, `tags`, `relatedLessons`, `sourceArticles`, `complexityIndex`.

Proposed additional (future phases):
- `prerequisites: string[]` (lesson ids)
- `cognitiveFocus: ('recall'|'understand'|'apply'|'analyze'|'evaluate')[]`
- `version: string` (semantic content version)
- `reviewStatus: 'draft' | 'reviewed' | 'published'`
- `citations: { type: 'case'|'article'|'doctrine'; ref: string; note?: string }[]`
- `summary: string[]` (explicit takeaways)

Quiz object future additions:
- `validation: { reviewedBy?: string; reviewedAt?: string }`
- `coverageTags: string[]` (align with matrix axes)
- Per-question: `cognitiveLevel`, `sourceRefs`, `rationaleQualityScore` (script-estimated).

## 5. Ingestion & Normalization Pipeline
| Stage | Input | Output | Tooling Idea |
|-------|-------|--------|--------------|
| Acquire | Official PDF / text | Raw text | Manual confirm hash |
| Extract | Raw text | JSON article blocks (id, heading, text) | Simple regex + manual review |
| Normalize | JSON blocks | Canonical article entities (slug, part, cluster guess) | Slug builder (`part-3-art-17`) |
| Cluster | Article entities | Thematic groups (pre-lesson) | Keyword + rules + manual overrides JSON |
| Scaffold | Clusters | Draft lesson JSON (sections empty/keyPoints TBD) | Script: `scripts/generateLessonScaffold.ts` |
| Enrich | Draft lessons | Authored lessons (objectives, keyPoints, sources) | Human pass + lint script |
| Quiz Seed | Authored lesson | Draft quiz (templates fill stems) | Template engine + param rules |
| Validate | Draft quiz/lesson | Ready content | Schema + coverage + readability checks |

Confidence scoring: Each cluster mapping gets `confidence: 0–1`; <0.6 flagged in TODO dashboard.

## 6. Authoring Guidelines
Tone: Neutral, instructive, civic literacy focused. Avoid partisan framing.
School Track: Plain language, analogies acceptable, define every specialized term.
College Track: Include doctrinal nuance, comparative framing, interpretive controversies.
Key Points: Start with active noun phrase; avoid starting with “The”.
Learning Objectives: Bloom verbs; no duplicate verbs within a section.

### Style Lint (future script rules)
- Reject objectives not starting with verb.
- Reject key points > 30 words.
- Flag sections with Flesch-Kincaid grade > target for school.

## 7. Quiz Generation Framework
Question Type Ratio (per 20):
- Single-answer MCQ: 50%
- Multi-select MCQ: 15%
- True/False (careful, no trivial restatements): 10%
- Scenario / Application (still MC format): 25%

Difficulty Targets:
- Easy 30–35% (definition / direct recall)
- Medium 40–45% (comparative / relational)
- Hard 20–25% (application / synthesis / exception)

Validation Checks (script):
- All `correctAnswer` indices valid
- Explanations length ≥ 15 words
- No duplicate stems (fuzzy match)
- Distractors: Levenshtein distance threshold to avoid near-duplicates
- Coverage matrix updated (logs under `analytics/coverage.json`)

Future: dynamic difficulty adjustment using performance logs (not in current scope).

## 8. Coverage Matrix Design
Dimensions: Rights | Institutions | Governance Processes | Federal Layers | Emergency & Amendment | Oversight.
Stored as JSON: `coverageMatrix.json` with entries:
```json
{
   "id": "rights.equality",
   "type": "right",
   "lessons": ["fundamental-rights-equality-college", "fundamental-rights-equality-school"],
   "quizzes": ["quiz-fundamental-rights-equality"],
   "questions": 14,
   "lastUpdated": "2025-09-14"
}
```
Script aggregates totals and flags:
- `missingLesson`: axis node without lesson
- `underQuestioned`: node < threshold (e.g., <5 questions mid-phase)

## 9. Phased Roadmap (Expanded)
| Phase | Focus | Outputs | Success Criteria |
|-------|-------|---------|------------------|
| 0 | Schema & Validation Bootstrap | Added version + relatedIds fields (optional), slug conventions documented, validation test over all lessons/quizzes, Phase 0 checklist committed | All existing content passes validation test |
| 1 | Foundation & Sample | Schema (optional fields), 2 dual-track lessons, initial quizzes | Build passes; sample lessons published |
| 2 | Core Rights & Institutions | ~12 dual-track lessons + quizzes | Coverage ≥ 40% rights/institutions |
| 3 | Federal & Processes | +10 lessons + process quizzes | All major parts represented |
| 4 | Depth & Cross-links | Related lessons graph, comparative modules | ≥60% nodes linked ≥1 related |
| 5 | Enrichment & Pedagogy | Objectives complete (college), cognitive metadata | 90% sections have ≥1 objective |
| 6 | QA & Analytics | Coverage dashboard, difficulty balance pass | No axis flagged critical |
| 7 (ongoing) | Sustain & Version | Version tags, changelog, lint scripts | All new content passes lint gates |

## 10. Immediate Micro-Batch Backlog
1. Script scaffold generator (inputs: cluster ID list → draft JSON lessons)
2. Add coverage matrix seed file
3. Add 3 more rights sub-lessons (Equality, Freedom, Social Justice) dual-track stubs
4. Implement quiz template builder for definition vs scenario styles
5. Add content lint CLI (objectives + key point validation)

## 11. Automation & Tooling Roadmap
| Tool | Purpose | Priority |
|------|---------|----------|
| `scripts/clusterArticles.ts` | Map raw article text to clusters | Medium |
| `scripts/generateLessonScaffold.ts` | Create lesson JSON shells | High |
| `scripts/quizTemplateSeed.ts` | Generate quiz drafts from lesson metadata | High |
| `scripts/coverageReport.ts` | Summarize coverage & gaps | Medium |
| `scripts/contentLint.ts` | Enforce style rules | Medium |
| `scripts/difficultyAudit.ts` | Stats on question distribution | Low |

## 12. Metrics & Analytics (Future)
Planned JSON outputs under `analytics/`:
- `coverage.json`: per axis node coverage
- `difficulty.json`: question difficulty distribution
- `readability.json`: FK scores per lesson (school track)

## 13. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | Delays core coverage | Lock per-phase backlog |
| Inconsistent pedagogical tone | Learner confusion | Style lint + peer review |
| Over-emphasis on rote recall | Shallow learning | Maintain scenario ratio target |
| Data drift (article grouping errors) | Misaligned lessons | Confidence scoring + manual review queue |
| Quiz imbalance | Skewed assessment | Coverage + difficulty scripts |

## 14. Versioning & Change Control
- Add `version` field to new lessons starting Phase 4.
- Maintain `docs/content_changelog.md` with semantic version + summary per batch.
- Use conventional commits scope `content:` for lesson/quiz updates.

## 15. Acceptance Criteria for Phase 1 Completion
- Two dual-track lessons fully validated (schema parse, objectives present, no lint warnings once lint exists).
- At least one quiz per lesson with ≥8 questions (balanced easy/medium).
- Coverage matrix file seeded referencing these lessons.
- Documentation (this file) committed.

## 16. Appendix: Sample Lesson Skeleton (College)
```json
{
   "id": "fundamental-rights-equality-college",
   "title": "Fundamental Rights: Equality",
   "audiences": ["college"],
   "sections": [
      {
         "id": "equality-scope",
         "title": "Scope & Constitutional Basis",
         "content": "...",
         "learningObjectives": ["Analyze scope differentiation", "Interpret non-discrimination principle"],
         "keyPoints": ["Equality before law vs equal protection distinction", "Protected grounds enumerated"],
         "sourceArticles": ["Art.17(1)", "Art.18"],
         "tags": ["rights", "equality"]
      }
   ],
   "relatedLessons": ["fundamental-rights-freedom-college"],
   "complexityIndex": 0.42,
   "prerequisites": ["fundamental-rights-intro-college"],
   "summary": ["Equality clauses structure limitations."]
}
```

## 17. Appendix: Sample Quiz Question (Scenario)
```json
{
   "id": "equality-scenario-01",
   "question": "A provincial law creates a benefit only for citizens of one province without justification. Which constitutional principle is most directly engaged?",
   "type": "multiple-choice",
   "options": [
      "Due process",
      "Equality before the law",
      "Directive state policy",
      "Freedom of movement"
   ],
   "correctAnswer": 1,
   "explanation": "The scenario involves differential treatment requiring examination under equality before the law and non-discrimination guarantees.",
   "difficulty": "medium",
   "sourceArticles": ["Art.18"],
   "cognitiveLevel": "analyze"
}
```

---
This plan is a living document; update iteratively as tooling and content mature.

---

## Phase 0 (New): Schema & Validation Bootstrap

Purpose: Lock minimal stable identifiers and add lightweight validation so future content expansion is safe and low-friction.

### Deliverables
1. Schema enhancements in `shared/contentSchemas.ts`:
   - Optional `version: number` (default 1 if absent during runtime load)
   - Optional `relatedIds: string[]` (lightweight cross-link list distinct from `relatedLessons` which is curated pedagogically)
2. Slug / ID conventions documented (below) and referenced by authors.
3. Automated validation test `tests/contentSchemaValidation.test.ts` that iterates all JSON under `content/lessons` & `content/quizzes` and asserts schema parse success.
4. Phase 0 checklist added & completed.

### Slug / ID Conventions
| Entity | Pattern | Example | Notes |
|--------|---------|---------|-------|
| Lesson (school) | `<topic>-<focus>-school` | `fundamental-rights-intro-school` | Keep tokens lowercase kebab; avoid stopwords unless needed for disambiguation |
| Lesson (college) | `<topic>-<focus>-college` | `fundamental-rights-intro-college` | Must share prefix with school variant when conceptually same |
| Quiz | `quiz-<topic>-<focus>` | `quiz-fundamental-rights-intro` | No audience suffix; quiz can branch internally by audience if needed |
| Section IDs | `<short-topic>-<subfocus>` | `equality-scope` | Stable even if section title text changes |
| Question IDs | `<quiz-id>-q##` | `quiz-fundamental-rights-intro-q03` | Zero-pad for ordering predictability |

Rules:
- Only lowercase a–z, digits, and hyphens.
- Hyphen delimiter only; no underscores.
- Changes to an `id` require deprecation entry (future Phase 4) and redirect mapping.

### Version Field Policy (Content)
- `version` increments only when semantic meaning shifts (not typo fixes).
- Patch-level textual refinements tracked in VCS history; major conceptual restructure → increment.
- Migration scripts (if ever needed) will key off `version` when performing transforms.

### relatedIds vs relatedLessons
- `relatedLessons`: curated pedagogical suggestions surfaced to learner UI.
- `relatedIds`: backend/content graph use (enables analytics & automatic suggestions). Can include quizzes or future enrichment nodes.

### Validation Test Scope
- Ensures: required fields present, arrays non-empty per schema, enumerations valid.
- Logs schema issues with formatted Zod error tree for quick author feedback.
- Future extension: readability grade + key point count checks (Phase 2+).

### Phase 0 Checklist
 - [x] Add schema optional fields (`version`, `relatedIds`).
 - [x] Create validation test file.
 - [x] Run tests and ensure pass.
 - [x] Update this document with conventions (this section).
 - [ ] Commit changes under conventional commit scope `content:` and `chore:test` for test addition.

### Exit Criteria
All existing lesson & quiz JSON files parse successfully and the checklist above is fully checked. After exit, adding new required fields before Phase 3 is discouraged to avoid churn.

### Schema Evolution Guardrail
Until Phase 3, only additive optional fields may be introduced. Any proposal for a new required field must include:
1. Rationale (learner impact & analytics impact).
2. Backfill strategy (script or manual) with estimated effort.
3. Verification step added to validation test.
If accepted, increment `version` of affected content objects; older content updated in same commit to avoid mixed-version state.

### ID Migration Policy (Future)
If an `id` change becomes unavoidable (rare), create a `content/id_redirects.json` mapping old -> new. The loader layer should check and remap while logging a deprecation warning. This file is not yet created (defer to Phase 4 unless triggered sooner).

---

## Phase 1 Progress Log (Representative Slice)
Date: 2025-09-14
Added dual-track Equality lessons (`fundamental-rights-equality-school`, `fundamental-rights-equality-college`) and associated quiz (`fundamental-rights-equality`). All pass schema validation. This forms the initial rights-focused representative slice together with existing intro lessons. Next targets: add one scenario-heavy application question set and begin coverage tagging (planned for later sub-phase).

