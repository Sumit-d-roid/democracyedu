# NextPlan: SambhidanX Roadmap (Living Document)

Purpose: Provide a structured, prioritized execution map for evolving SambhidanX into a scalable, multilingual, level-based constitutional learning platform focused on the Constitution of Nepal.

---
## 0. Strategic North Star
Deliver a trusted, adaptive civic literacy platform grounded in authoritative constitutional content, with progressive learning paths (10 levels), bilingual support (English/Nepali), user-specific progress tracking, and community credibility.

Success Snapshot (12–18 months):
- 150+ vetted constitutional lesson variants across 10 structured difficulty levels.
- Adaptive quiz engine surfacing level-appropriate challenges.
- Seamless English ⇄ Nepali experience (content + UI + quizzes) without string duplication.
- Authenticated learners retain longitudinal progress, badges, and comparative insights.
- Organic reach via articles, shareable insights, and public dashboards.

---
## 1. Core Requirements (User Provided + Expanded)
1. User login and user-specific scores / progress.
2. Ten levels for each lesson and quiz based on difficulty progression.
3. Coverage anchored in Nepal’s Constitution (breadth + depth; traceability to Articles / Parts).
4. Proper database for user records, progress, content metadata, translation keys.
5. Article publishing space (long-form constitutional interpretation / updates).
6. Translating quizzes to Nepali without hardcoding static copies.
7. Deployment plan to `sambhidanx.com` (robust CI/CD, SSL, observability).
8. (Added) Content validation tooling (schema, literacy level, duplication avoidance).
9. (Added) Adaptive recommendation engine (level advancement heuristics).
10. (Added) Achievement & retention loop (streaks, milestone badges).
11. (Added) Offline-first strategy (service worker caching core learning flows).
12. (Added) Accessibility & inclusive design baseline (WCAG AA focus).
13. (Added) Analytics & metrics (learning velocity, quiz reliability, translation coverage).
14. (Added) Secure moderation workflow for content/article publishing.
15. (Added) Role-based access (admin, content author, translator, reviewer).
16. (Added) Fraud / abuse detection (rate limits, unusual score patterns).
17. (Added) Backup & disaster recovery for DB + content assets.
18. (Added) API versioning & backward compatibility approach.
19. (Added) Performance SLOs (TTFB < 400ms API, p95 quiz load < 1.2s).
20. (Added) Privacy & minimal PII collection (opt-in only for email/profile).

---
## 2. Ten-Level Learning Taxonomy
Unifies prior school/college split into a gradient. Each lesson/quiz variant (or dynamic difficulty adaptation) maps to a level. Not all content requires bespoke rewriting—levels 1–4 can share a core stem with simplified phrasing; levels 7–10 may introduce deeper context.

| Level | Label | Learner Persona | Content Characteristics | Quiz Focus |
|-------|-------|-----------------|-------------------------|------------|
| 1 | Foundation Basic | Early middle-school | Single-sentence ideas, concrete examples | Recognition (True/False, 2-option MCQ) |
| 2 | Foundation Plus | Upper middle-school | Short paragraphs, plain definitions | Basic recall |
| 3 | Core Intro | Early secondary | Multi-paragraph but low abstraction | Recall + simple match |
| 4 | Core Applied | Secondary | Light explanation of relationships | Why/which questions |
| 5 | Conceptual | Late secondary | Introduces classification & comparisons | Scenario recall hybrid |
| 6 | Structured Analytical | Pre-university | Multi-factor explanations, limited doctrine | Structured multi-select |
| 7 | Doctrinal Intro | Early college | Introduces interpretive frameworks | Application fact patterns |
| 8 | Doctrinal Comparative | College | Cross-system analogies, rationale | Multi-step scenario |
| 9 | Analytical Synthesis | Advanced college | Layered critique, policy implications | Synthesis & exception handling |
| 10 | Enrichment / Extension | Advanced enrichment | Comparative jurisprudence, reform debates | Edge-case evaluation |

Mapping heuristic (initial bootstrap):
- Former `beginner` lessons → Levels 2–3.
- `intermediate` → Levels 4–6.
- `advanced` → Levels 7–8 (extend to 9–10 only if content suitable).

---
## 3. Phase Roadmap (Incremental Build)

### Phase P0 (Weeks 0–2): Stabilize & Instrument
Objectives:
- Reinstate & extend schema validation (lessons, quizzes, translation keys).
- Introduce `level` field (optional during migration, required post-P1 freeze).
- Basic auth skeleton (session or JWT + secure password hashing + RBAC tables).
- Content traceability: each lesson/quiz has `sourceRefs: { article: string; part?: string }[]`.
- Deployment baseline (preview + production pipeline) to temporary subdomain.
Deliverables:
- Revised schemas (`LessonContent`, `QuizContent`, `ArticleContent`, `TranslationKey`).
- Validation test suite + CI gate.
- DB schema v1 (users, sessions, progress, quiz_attempt, content_meta, translation_key).
- Initial translation registry (English seeds only).

### Phase P1 (Weeks 2–6): Level Framework & Core Experience
Objectives:
- Implement level-based content selection (fallback to nearest level if missing).
- Migrate 10–15 foundational lesson clusters to Levels 1–5.
- Implement quiz difficulty scaling (weighting by level).
- User dashboard: progress by topic & suggested next level.
- Article publishing MVP (Markdown/MDX with metadata + moderation flag).
Deliverables:
- Level assignment script (auto-suggest based on difficulty heuristics).
- Quiz engine: dynamic question pool filtering by level.
- Author/admin UI (minimal) for publishing/unpublishing.
- Basic Nepali translation pipeline skeleton (keys extracted, no final Nepali copy yet).

### Phase P2 (Weeks 6–10): Bilingual & Expansion
Objectives:
- Add Nepali translations for UI + initial 20% of lessons + quizzes.
- Implement runtime language switch (persisted in user profile/local storage).
- Add translation fallback logic: English → Nepali placeholder markers.
- Add analytics: translation coverage, user language distribution.
- Extend content to Levels 6–7 for core rights topics.
Deliverables:
- i18n service (key lookup, pluralization, interpolation).
- Translator workflow (queue + status: draft/reviewed/published).
- Coverage dashboard page (web) for admins.

### Phase P3 (Weeks 10–16): Adaptive Learning & Achievements
Objectives:
- Implement level progression heuristic (correct rate + time + confidence score).
- Add achievements & badges (milestones: first Level 5 quiz perfect score, etc.).
- Introduce spaced review suggestions (quiz reattempt scheduling).
- Add streak tracking, daily goal system.
Deliverables:
- Recommendation service module.
- Achievements DB tables + UI badges.
- Notification layer (in-app toast + optional email digest opt-in).

### Phase P4 (Weeks 16–22): Depth & Advanced Levels
Objectives:
- Produce higher-level (8–10) doctrinal & comparative modules.
- Introduce article commentary cross-linking into lessons.
- Add semantic search across lessons/articles (vector store or BM25 hybrid).
- Performance tuning & offline caching for mobile usage.
Deliverables:
- Search micro-service or module.
- Pre-caching manifest for SW.
- Advanced content review process (peer validation workflow).

### Phase P5 (Ongoing): Optimization & Sustainability
Objectives:
- Automated readability + complexity scoring per level.
- Quiz item reliability stats (discrimination index, difficulty index).
- Content A/B testing (two phrasings, measure retention or correctness delta).
- Data export & transparency (anonymized learning metrics).

---
## 4. Technical Architecture Overview
Frontend: React + Vite + modular content loaders. Add an abstraction layer for fetching content by `(topic, level, language)`; fallback cascade: exact → nearest level → English base.
Backend: Node/Express (existing) → augment with modular service layers:
- Auth Service: registration, login, session management, password reset.
- Content Service: lesson/quiz retrieval, variant resolution, article publishing.
- Progress & Analytics Service: attempt logging, level advancement scoring.
- Translation Service: key store, status management, fallback resolution.

Database (proposed tables):
- `user(id, email, password_hash, roles, created_at)`
- `session(id, user_id, expires_at, meta)` (if server sessions)
- `lesson(id, base_id, level, language, title, body_json, status, version)`
- `quiz(id, base_id, level, language, metadata_json, status, version)`
- `quiz_question(id, quiz_id, stem, options_json, answer_key, level, language)`
- `article(id, slug, title, body_markdown, status, author_id, published_at)`
- `progress(user_id, lesson_id, last_viewed_at, completion_pct)`
- `quiz_attempt(id, user_id, quiz_id, score, accuracy, time_spent_ms, attempt_meta_json)`
- `achievement(id, code, criteria_json)` / `user_achievement(user_id, achievement_id, granted_at)`
- `translation_key(id, namespace, key, default_text, context)` / `translation_value(key_id, language, text, status)`
- `recommendation(user_id, target_id, type, rank, created_at)` (optional cache)

Scaling & Performance:
- Cache content JSON (in-memory + CDN for static). ETag headers.
- Background job queue (e.g., BullMQ) for heavy analytics / reliability metrics.
- Optional search index (Meilisearch / Typesense) for semantic & lexical search.

Security:
- Rate limiting on auth & quiz submission endpoints.
- Password hashing (bcryptjs / argon2 if added).
- Content moderation flag workflow before publishing advanced articles.

---
## 5. Translation Strategy (No Hardcoding)
Model: keys-first; lessons & quizzes store structural JSON with translatable segments referenced by key OR structured arrays containing an `id` and language map. Avoid duplicating whole lesson files unless structural divergence required.

Approach:
1. Extract textual segments to `translation_key` table (namespace: `lesson.<id>.section.<n>.paragraph.<m>`).
2. Maintain English as source of truth; Nepali translator UI pulls pending keys.
3. Fallback logic: if Nepali missing → show English with subtle marker (e.g., icon or tooltip to encourage completion internally, not user-facing distraction).
4. Quiz translation: each question’s stem & options are keyed; correctness checking unaffected by language.
5. Build translator dashboard: filter by namespace, status, last updated.

---
## 6. Deployment Plan (sambhidanx.com)
Stages:
- Dev Preview: `dev.sambhidanx.com` (auto-deploy on main branch merge).
- Staging: `staging.sambhidanx.com` (release candidate, content freeze tests).
- Production: `sambhidanx.com` (tag-triggered deploy `v*`).
Infra Checklist:
- SSL (Let’s Encrypt / Cloudflare).
- Reverse proxy (NGINX/Caddy) or managed host.
- CI pipeline: lint → test → build → deploy.
- DB migration gating (apply migrations before app start).
- Monitoring: basic (uptime + error log shipping to a SaaS or self-hosted).

---
## 7. Metrics & KPIs
| Metric | Definition | Phase Target |
|--------|------------|--------------|
| Lesson Completion Rate | % started lessons finished | 55% P2 |
| Quiz Retake Interval | Median days until revisiting | < 7 days P3 |
| Translation Coverage | % of user-visible strings localized | 25% P2 / 75% P3 |
| Level Progress Velocity | Avg level-up time (1→5) | < 14 days P3 |
| Item Reliability Score | Discrimination index processed | ≥ 0.3 avg P4 |
| DAU / WAU | Retention indicator | 35% P4 |
| Content Review Turnaround | Draft → publish time | < 5 days P2 |

---
## 8. Risk Matrix
| Risk | Impact | Mitigation |
|------|--------|------------|
| Content bloat without consistency | High | Style guide + lint + review roles |
| Translation backlog | Medium | Key batching + priority tagging |
| Level mapping confusion | Medium | Auto-suggest + editorial override UI |
| Performance regression with level variants | Medium | Content caching + lazy loading |
| Quiz difficulty miscalibration | Medium | Post-attempt analytics recalibration |
| Auth security gaps | High | OWASP checklist + automated dependency scans |
| Data loss | High | Daily encrypted DB backups + restore drills |

---
## 9. Immediate Action Backlog (Next 2 Weeks)
Priority labels: (P0=blocking, P1=core, P2=nice-to-have early)
- P0: Reintroduce validation test suite (lessons/quizzes).  
- P0: Design DB schema (draw ERD) + migration skeleton.  
- P0: Add `level` optional field in schema (not required yet) + migration script placeholder.  
- P1: Implement auth MVP (register/login/logout) + hashed passwords.  
- P1: Add progress tracking endpoints (record quiz attempts, lesson completion).  
- P1: Draft translation key extraction prototype (CLI).  
- P1: Write content style & level assignment guideline doc.  
- P2: Article model + simple publishing route (HTML sanitization).  
- P2: Domain DNS + staging deployment pipeline config.  
- P2: Basic achievement schema (deferred logic).  

---
## 10. Tooling & Automation Plan
Scripts (future):
- `scripts/extractTranslationKeys.ts`
- `scripts/levelSuggest.ts` (heuristics based on sentence length, vocab complexity)
- `scripts/quizStats.ts` (item difficulty & discrimination)
- `scripts/contentLint.ts` (max section word count, key point length, banned jargon per level)

---
## 11. Open Decisions
| Topic | Decision Needed By | Options |
|-------|--------------------|---------|
| Auth session strategy | End of P0 | Cookie session vs stateless JWT |
| Translation storage granularity | Mid P1 | Key-per-segment vs section block |
| Search engine | P4 start | Meilisearch vs Typesense vs Postgres FTS |
| Recommendation model | Mid P3 | Rule-based heuristic vs ML-lite |
| Hosting | P0 end | Render/Fly/Vercel hybrid vs self-managed VPS |

---
## 12. Definition of Done (Per Phase)
- Phase complete only when: code merged, docs updated, tests pass, release note created.
- Content expansions require: schema valid, translation keys emitted, level assigned, review status logged.

---
## 13. Appendix: Sample Lesson Variant Structure (Future)
```json
{
  "baseId": "fundamental-rights-equality",
  "id": "fundamental-rights-equality-l3-en",
  "level": 3,
  "language": "en",
  "title": "Equality Basics",
  "sections": [
    { "id": "meaning", "textKey": "lesson.equality.l3.meaning.p1" }
  ],
  "sourceRefs": [ { "article": "Art.18" } ],
  "version": 1,
  "status": "published"
}
```

---
## 14. Maintenance & Governance
- Weekly triage: review backlog burn-down, translation progress, level coverage gaps.
- Monthly quality review: random sample validation + quiz reliability recalculation.
- Semantic versioning for content schema; patch notes in `docs/changelog.md`.

---
## 15. Next Immediate Step Recommendation
Recreate validation + introduce optional `level` and translation key scaffolding concurrently (parallelizable) while sketching DB schema to prevent rework.

---
Document Status: v0.1 (initial draft). Update iteratively.
\n+### P0 Progress Log (Rolling)
2025-09-14: Added optional `level` + `sourceRefs` to schemas; restored & expanded validation tests; created accessibility baseline doc. Next: DB schema scaffold + translation key extraction prototype.
