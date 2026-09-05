# ImpactX — AI-Enabled Skill Intelligence & Capacity Building Platform

> **SIH 2026 Project** | Ministry of Statistics and Programme Implementation (MoSPI) | iGOT Karmayogi Integration

ImpactX is a full-stack AI-driven adaptive learning and competency assessment platform purpose-built for India's Official Statistical System. It serves officials across MoSPI's divisions — NAD, SDRD, FOD, ESD — providing automated 4-domain competency profiling, personalized iGOT/NSSTA TPAC course recommendations, AI-generated assessments, vector-grounded tutoring, and gamified progression.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Database Schema](#database-schema)
5. [AI Services (The ImpactX Engine)](#ai-services-the-impactx-engine)
6. [API Reference](#api-reference)
7. [Authentication & Middleware](#authentication--middleware)
8. [Gamification — Aura Engine](#gamification--aura-engine)
9. [Environment Variables](#environment-variables)
10. [Setup & Development](#setup--development)
11. [Deployment Notes](#deployment-notes)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           Next.js 16 App Router                          │
│                                                                          │
│  ┌─────────────────────┐    ┌─────────────────────────────────────────┐  │
│  │   Client (React 19) │    │            Server Components            │  │
│  │  - Dashboard        │    │  - Onboarding Flow                      │  │
│  │  - 3D Skill Graph   │    │  - Profile Evaluation                   │  │
│  │  - Quiz UI          │    │  - Recommendations                      │  │
│  │  - Leaderboard      │    │  - Admin Analytics                      │  │
│  └─────────────────────┘    └─────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────── API Routes ───────────────────────┐   │
│  │ /api/official/profile   /api/igot/recommendations                 │   │
│  │ /api/quiz/generate      /api/admin/analytics                      │   │
│  │ /api/tutor/answer       /api/generate-dag                         │   │
│  │ /api/onboarding         /api/learner/state                        │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────── Service Layer ────────────────────────────┐   │
│  │  CompetencyProfilerAgent  │  IGotRecommendationEngine             │   │
│  │  AIQuizGenerator          │  TutorAgent (RAG)                     │   │
│  │  PlannerAgent (DAG/LLM)   │  AssessmentService (IRT-CAT)          │   │
│  │  AuraEngine (Gamify)      │  AdminAnalyticsService                │   │
│  │  LLMProcessor (Embeds)    │  ProgressAgent  │  StreakService       │   │
│  └───────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────┐   ┌───────────────────┐   ┌────────────────────┐   │
│  │  Drizzle ORM    │   │  PostgreSQL/Neon   │   │  Google Gemini API │   │
│  │  (Type-safe)    │   │  + pgvector ext.   │   │  gemini-3.6-flash  │   │
│  └─────────────────┘   └───────────────────┘   │  gemini-embed-001  │   │
│                                                 └────────────────────┘   │
│  ┌──────────────────────────────────────────┐                            │
│  │  Clerk Auth (clerkMiddleware / proxy.ts) │                            │
│  └──────────────────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Request lifecycle (typical authenticated API call):**

1. Browser → `next dev` Turbopack dev server (port 3000)
2. `src/proxy.ts` (`clerkMiddleware`) intercepts every request
3. Public routes bypass auth; protected routes call `auth.protect()`
4. Next.js Route Handler (`/api/...`) receives authenticated request
5. Route Handler calls the appropriate Service class
6. Service calls Drizzle ORM → Neon PostgreSQL
7. AI-dependent services call `@google/genai` SDK → Gemini API
8. JSON response returned to client

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.3.3 |
| UI Runtime | React | 19.2.8 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 + Vanilla CSS | ^4 |
| ORM | Drizzle ORM | ^0.45.2 |
| Database | PostgreSQL (Neon serverless) | — |
| Vector Store | pgvector (via custom Drizzle type) | 3072-dim |
| AI Model | Google Gemini 3.6 Flash | `@google/genai ^2.19.0` |
| Embedding Model | `gemini-embedding-001` | 3072-dim output |
| Auth | Clerk (`@clerk/nextjs`) | ^7.8.3 |
| 3D Visualization | `react-force-graph-3d` + `three.js` | — |
| Charts | Recharts | ^3.10.1 |
| DB Client | `pg` (node-postgres) | ^8.23.0 |
| DB Migrations | Drizzle Kit | ^0.31.10 |
| HTML Scraping | Cheerio | ^1.2.0 |

---

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (ClerkProvider)
│   ├── globals.css               # Global styles + design tokens
│   ├── dashboard/                # Learner dashboard
│   ├── onboarding/               # Multi-step profile intake flow
│   ├── profile/                  # Official competency profile view
│   ├── quiz/
│   │   └── generator/            # AI Training Studio (upload → generate quiz)
│   ├── module/                   # Skill node learning view
│   ├── leaderboard/              # Aura points leaderboard
│   ├── admin/                    # MoSPI leadership analytics dashboard
│   ├── design-system/            # UI component showcase
│   ├── settings/
│   ├── sign-in/ & sign-up/       # Clerk-hosted auth pages
│   └── api/
│       ├── official/profile/     # POST — Competency profiling
│       ├── igot/recommendations/ # GET — iGOT course recommendations
│       ├── quiz/generate/        # POST — AI quiz generation
│       ├── admin/analytics/      # GET — Workforce analytics
│       ├── tutor/                # GET — RAG tutor (fast + slow path)
│       ├── onboarding/           # POST — Onboarding upsert
│       ├── learner/              # GET/POST — Learner state
│       ├── generate-dag/         # POST — Skill DAG generation
│       ├── ingest-roadmap/       # POST — Content ingestion
│       ├── process-llm/          # POST — Batch embedding processor
│       ├── recommendation/       # GET — Generic recommendations
│       ├── roadmap/              # GET — Roadmap data
│       ├── dashboard/            # GET — Dashboard aggregation
│       └── profile/              # GET — Auth user profile
│
├── components/                   # Shared UI components
│   └── Navbar.tsx
│
├── db/
│   ├── index.ts                  # Drizzle db instance (pg pool)
│   ├── schema.ts                 # Full Drizzle schema (all tables + enums)
│   └── migrations/               # Drizzle Kit generated SQL migrations
│
├── services/                     # Business logic / AI service layer
│   ├── competencyProfilerAgent.ts
│   ├── igotRecommendationEngine.ts
│   ├── aiQuizGenerator.ts
│   ├── tutorAgent.ts
│   ├── plannerAgent.ts
│   ├── assessmentService.ts
│   ├── auraEngine.ts
│   ├── llmProcessor.ts
│   ├── adminAnalyticsService.ts
│   ├── assessmentService.ts
│   ├── learnerStateService.ts
│   ├── progressAgent.ts
│   ├── streakService.ts
│   ├── quizAgent.ts
│   ├── retrieverAgent.ts
│   ├── roadmapAdapter.ts
│   └── profilerAgent.ts
│
└── proxy.ts                      # Clerk middleware (route protection)
```

---

## Database Schema

All tables are defined in [`src/db/schema.ts`](./src/db/schema.ts) using Drizzle ORM with full TypeScript types.

### Enums

| Enum | Values |
|---|---|
| `aura_tier` | `Spark`, `Ember`, `Flame`, `Blaze`, `Aurora` |
| `source` | `roadmap_sh`, `manual`, `wikipedia`, `youtube` |
| `node_status` | `locked`, `unlocked`, `in_progress`, `completed` |
| `quiz_mode` | `checkpoint`, `test_out` |
| `answer_type` | `mcq`, `short_answer` |
| `aura_event_type` | `checkpoint_pass`, `milestone_complete`, `path_complete`, `test_out_pass`, `streak_bonus` |
| `user_role` | `learner_official`, `trainer`, `admin` |
| `provider` | `iGOT_Karmayogi`, `NSSTA_TPAC`, `Internal_MoSPI` |

### Tables

#### `learner`
Primary identity table. `id` is the Clerk user ID (string, not UUID).

| Column | Type | Notes |
|---|---|---|
| `id` | `text` PK | Clerk user ID |
| `name` | `text` | Display name |
| `role` | `text` | `learner_official` \| `trainer` \| `admin` |
| `designation` | `text` | e.g. "Statistical Officer" |
| `department` | `text` | e.g. "NAD", "SDRD" |
| `cadre` | `text` | ISS / SSS cadre |
| `qualifications` | `text` | Highest qualification |
| `work_experience_years` | `integer` | Used as baseline score modifier |
| `skill_vector` | `json` | `Record<string, number>` — per-domain theta seed |
| `domain_scores` | `json` | `{statistical, technical, governance, managerial}` — 0..100 |
| `identified_skill_gaps` | `json` | `string[]` — gap labels |
| `career_goal` | `text` | Auto-generated or user-entered |
| `interests` | `text[]` | User interest tags |
| `preferred_format` | `text` | `video` \| `article` \| `course` |
| `aura_points` | `integer` | Cumulative gamification points |
| `aura_tier` | `aura_tier` enum | Computed from points thresholds |
| `streak_days` | `integer` | Daily learning streak |
| `last_active` | `timestamp` | Used by StreakService |

#### `official_competency_benchmark`
Role-based benchmark targets used by `CompetencyProfilerAgent.getRoleBenchmarks()`.

| Column | Type |
|---|---|
| `id` | `text` PK |
| `designation` | `text` |
| `department` | `text` |
| `statistical_benchmark` | `float8` |
| `technical_benchmark` | `float8` |
| `governance_benchmark` | `float8` |
| `managerial_benchmark` | `float8` |
| `required_skills` | `text[]` |

#### `igot_course_catalog`
Course catalog for iGOT Karmayogi + NSSTA TPAC programs.

| Column | Type |
|---|---|
| `id` | `text` PK |
| `provider` | `provider` enum |
| `title` | `text` |
| `domain` | `text` |
| `competency_tags` | `text[]` |
| `difficulty_level` | `text` |
| `duration_hours` | `float8` |
| `url` | `text` |
| `description` | `text` |
| `tpac_recommended` | `boolean` |

#### `content_item`
Indexed learning resources with vector embeddings for semantic search.

| Column | Type | Notes |
|---|---|---|
| `id` | `text` PK | |
| `source` | `source` enum | Origin platform |
| `title` | `text` | |
| `url` | `text` | |
| `description` | `text` | |
| `resource_summary` | `text` | LLM-generated summary |
| `domain` | `text` | |
| `topic_tags` | `text[]` | |
| `estimated_difficulty` | `float8` | 1.0–5.0 scale |
| `embedding` | `vector(3072)` | **Custom Drizzle type** — pgvector |

> **pgvector custom type**: The `vector` column uses a `customType` definition that serializes `number[]` → `"[v1,v2,...]"::vector` for the `<=>` cosine distance operator.

#### `skill_node`
Nodes of the directed acyclic graph (DAG) representing learning prerequisites.

| Column | Type | Notes |
|---|---|---|
| `id` | `text` PK | kebab-case slug |
| `domain` | `text` | e.g. "Statistical" |
| `category` | `text` | Sub-category label |
| `label` | `text` | Human-readable topic name |
| `difficulty` | `float8` | 1.0–5.0 IRT scale |
| `prerequisite_ids` | `text[]` | Foreign refs → other `skill_node.id` |
| `linked_content_ids` | `text[]` | Foreign refs → `content_item.id` |
| `checkpoint_item_bank` | `text[]` | Foreign refs → `quiz_item.id` |

#### `learner_node_state`
Per-learner per-node progression state. Composite primary key `(learner_id, node_id)`.

| Column | Type | Notes |
|---|---|---|
| `learner_id` | `text` FK→`learner.id` | |
| `node_id` | `text` FK→`skill_node.id` | |
| `status` | `node_status` enum | State machine: `locked → unlocked → in_progress → completed` |
| `test_out_eligible` | `boolean` | Unlocked if prior theta > node difficulty |
| `test_out_attempted` | `boolean` | Single-attempt guardrail |
| `theta_estimate` | `float8` | IRT ability estimate for this node |
| `last_checkpoint_score` | `float8` | Raw score ratio from last attempt |
| `attempts` | `integer` | Total quiz attempts |
| `seen_quiz_item_ids` | `text[]` | Prevents item re-exposure |
| `personalized_prerequisite_ids` | `text[]` | Augmented by `PlannerAgent.insertRemedialNode()` |

Indexes: `learner_status_idx(learner_id, status)`, `learner_node_idx(learner_id, node_id)`

#### `quiz_item`
Item bank for adaptive quizzes. IRT `b`-parameter stored per item.

| Column | Type | Notes |
|---|---|---|
| `id` | `text` PK | |
| `node_id` | `text` FK | Parent skill node |
| `mode` | `quiz_mode` enum | `checkpoint` or `test_out` |
| `prompt` | `text` | Question text |
| `answer_type` | `answer_type` enum | `mcq` or `short_answer` |
| `correct_answer_or_rubric` | `json` | `{options[], correct: number, explanation: string}` |
| `irt_difficulty_b` | `float8` | IRT b-parameter (1.0–5.0) |
| `point_value` | `float8` | Weighted score contribution |

#### `aura_event`
Immutable event ledger for all point awards. Used for audit, replay, and leaderboard computation.

| Column | Type |
|---|---|
| `id` | `text` PK (UUID) |
| `learner_id` | `text` FK |
| `node_id` | `text` FK (nullable) |
| `type` | `aura_event_type` enum |
| `points_awarded` | `float8` |
| `breakdown` | `json` — full scoring formula breakdown |
| `created_at` | `timestamp` |

#### `llm_cache`
SHA-256 keyed cache for LLM responses to eliminate duplicate Gemini API calls.

| Column | Type |
|---|---|
| `id` | `text` PK |
| `prompt_hash` | `text` UNIQUE |
| `response` | `text` |
| `created_at` | `timestamp` |

---

## AI Services (The ImpactX Engine)

All AI services are pure TypeScript classes in `src/services/`. They are stateless and invoked by Next.js Route Handlers.

### `CompetencyProfilerAgent`

**File**: [`src/services/competencyProfilerAgent.ts`](./src/services/competencyProfilerAgent.ts)

Evaluates an official's 4-domain competency scores from their self-rated skill responses and profile metadata. **No LLM is called** — scoring is deterministic.

**Domain Mapping Logic:**

Skills are classified into one of 4 domains by substring matching on the topic label:

| Domain | Matched Keywords |
|---|---|
| Statistical | `survey`, `sampling`, `national accounts`, `price`, `labour`, `sdg`, `data quality`, `statistics` |
| Technical | `python`, `r`, `sql`, `stata`, `spss`, `gis`, `ai`, `visualization` |
| Governance | `privacy`, `cyber`, `signature`, `cloud`, `dpi`, `governance` |
| Managerial | (everything else) |

**Scoring Formula:**

```
score_val('Expert') = 90
score_val('Familiar') = 60
score_val('Newbie') = 30

domain_score = mean(skill_scores_in_domain) + min(work_experience_years × 2, 10)
domain_score = min(100, round(domain_score))
```

**Benchmark Comparison:**

Role benchmarks are hardcoded against designation+department patterns (e.g., `National Accounts + Director → {85, 75, 80, 80}`). If `domain_score < benchmark`, the corresponding gap label is added to `identified_skill_gaps`.

**DB Write**: Upserts into `learner` table (insert if new, update if existing).

---

### `IGotRecommendationEngine`

**File**: [`src/services/igotRecommendationEngine.ts`](./src/services/igotRecommendationEngine.ts)

Ranks iGOT Karmayogi and NSSTA TPAC courses against a learner's identified gaps. Embedded course catalog with 11 curated courses across 4 domains.

**Scoring Algorithm (per course):**

```
base_score = 50
+ 20 if domain gap exists (Statistical / Technical)
+ 15 if domain gap exists (Governance / Managerial)
+ 25 per matched competency tag (bidirectional substring match against skill gaps)
+ 15 if tpac_recommended == true
match_score = min(99, total)
```

Returns courses sorted descending by `matchScore`. No LLM involved.

---

### `AIQuizGenerator`

**File**: [`src/services/aiQuizGenerator.ts`](./src/services/aiQuizGenerator.ts)

Converts uploaded training material text into structured MCQ assessments using Gemini 3.6 Flash with **strict JSON schema enforcement**.

**Gemini call config:**
```typescript
responseMimeType: 'application/json',
responseSchema: {
  type: OBJECT,
  properties: {
    title: STRING,
    targetDomain: STRING,
    difficulty: STRING,
    questions: ARRAY of {
      question: STRING,
      options: ARRAY<STRING>,
      correctIndex: INTEGER,
      explanation: STRING
    }
  },
  required: ['title', 'targetDomain', 'difficulty', 'questions']
}
```

**Fallback**: If `GEMINI_API_KEY` is absent or the API call fails, a curated static pool of 5 domain-appropriate MCQs covering National Accounts, PLFS, Sampling, DPDP Act 2023, and GeoPandas is returned.

Input content is sliced to `4000` chars before being sent to the model to respect context limits.

---

### `TutorAgent` (StatsGov AI Copilot)

**File**: [`src/services/tutorAgent.ts`](./src/services/tutorAgent.ts)

Implements a **two-path RAG architecture**:

#### Fast Path (`getFastPathExplanation`)
Template-based, zero LLM latency. Explains why a specific content item was recommended to a learner by introspecting:
1. Node prerequisite graph (via `skillNode.prerequisiteIds`)
2. Learner's `thetaEstimate` vs. content `estimatedDifficulty`

Returns a grounded natural-language explanation without any model call.

#### Slow Path (`getSlowPathAnswer`)
Full RAG pipeline with guardrails:

1. **Query Embedding**: `LLMProcessor.generateEmbedding(query)` → `gemini-embedding-001` → 3072-dim vector
2. **Vector Search**: pgvector cosine distance `<=>` over `content_item.embedding`, top-3 nearest
3. **Hard Guardrail**: If `best_distance > 0.35` (cosine), returns a canned refusal — prevents hallucination on out-of-domain queries
4. **LLM Generation**: Gemini 3.6 Flash generates answer using the retrieved context snippets
5. **LLM Cache**: SHA-256 hash of the full prompt is looked up in `llm_cache` before the API call. On success, response is written back to cache.

---

### `PlannerAgent`

**File**: [`src/services/plannerAgent.ts`](./src/services/plannerAgent.ts)

Generates and manages the skill DAG (Directed Acyclic Graph) used for learning path sequencing.

#### `generateDAG(slug)`
1. Fetches `content_item` rows tagged with `slug`
2. Sends topic list to Gemini 3.6 Flash with JSON schema for DAG node structure
3. Runs **cycle detection + edge sanitization** (`removeCycles`):
   - Drops self-loops
   - Drops hallucinated node ID references
   - DFS-based back-edge removal for cycle elimination
4. Batch-inserts validated nodes into `skill_node` via a Drizzle transaction

#### `insertRemedialNode(learnerId, failedNodeId)`
Surgical graph surgery when a learner fails a checkpoint:
1. Fetches failed node metadata
2. Calls Gemini to generate ONE prerequisite remedial topic with `difficulty < failedNode.difficulty`
3. Runs vector similarity search to auto-link the closest existing `content_item`
4. Inserts remedial node into `skill_node`
5. Updates `learner_node_state.personalized_prerequisite_ids` for this learner only (scoped, not global)
6. Re-locks the failed node; unlocks the remedial node

---

### `AssessmentService` (IRT-CAT Engine)

**File**: [`src/services/assessmentService.ts`](./src/services/assessmentService.ts)

Implements a simplified Computerized Adaptive Testing (CAT) loop using Item Response Theory b-parameters.

**Item Selection**: Selects the unseen quiz item whose `irt_difficulty_b` is closest to the learner's current `theta_estimate` (ability estimate). Items are filtered by `mode` and excluded if already in `seen_quiz_item_ids`.

**Bank Replenishment**: If the item bank is exhausted for a node, calls `QuizAgent.generateItemBank(nodeId, 5, mode)` to dynamically generate 5 more items via Gemini before retrying.

**Theta Update**: Clients compute theta updates locally and pass `previousResult.newTheta` back on the next call. Server clamps: `theta ∈ [1.0, 5.0]`.

**Evaluation Thresholds:**

| Mode | Pass Threshold |
|---|---|
| `checkpoint` | ≥ 60% of total points |
| `test_out` | ≥ 75% of total points |

On evaluation, delegates to `ProgressAgent.handleNodeAttemptEvent()` for centralized side-effects (node state transitions, Aura award, milestone/path-completion checks).

---

### `LLMProcessor`

**File**: [`src/services/llmProcessor.ts`](./src/services/llmProcessor.ts)

Utility service for embedding generation and batch content processing.

- **`generateEmbedding(text)`**: Calls `gemini-embedding-001` via `ai.models.embedContent()`. Returns `number[]` (3072 dimensions).
- **`processItem(item)`**: Calls Gemini 3.6 Flash to classify a content item's domain and estimate difficulty (1–5 scale), using structured JSON output.
- **`batchProcessItems()`**: Pulls up to 10 `content_item` rows where `estimated_difficulty IS NULL`, runs `processItem` + `generateEmbedding`, and writes the results back. Designed to be called by the `/api/process-llm` admin route.

---

### `AuraEngine`

**File**: [`src/services/auraEngine.ts`](./src/services/auraEngine.ts)

Gamification engine. All point awards are wrapped in Drizzle transactions for atomic balance updates.

**Tier Thresholds:**

| Tier | Points Required |
|---|---|
| Spark | 0 |
| Ember | 1,000 |
| Flame | 5,000 |
| Blaze | 15,000 |
| Aurora | 50,000 |

**Scoring Formulas:**

```
# Attempt Award (awardAttemptAP)
streak_bonus = 1 + 0.05 × min(streak_days, 10)    # max ×1.5
first_try_bonus = 1.2 if attempts == 1 else 1.0    # checkpoint only
type_modifier = 0.7 for test_out, 1.0 for checkpoint
final_ap = round(raw_score × 10 × type_modifier × first_try_bonus × streak_bonus)

# Milestone Award (awardMilestoneAP)
depth = recursive DAG depth of the node
depth_weight = min(3.0, 1 + 0.2 × (depth - 1))
final_ap = round(50 × depth_weight)

# Path Completion (evaluatePathCompletion)
final_ap = round(500 × (total_nodes_in_domain / 10))

# Streak Bonus (awardPoints)
3-day streak  → +50 AP
7-day streak  → +150 AP
30n-day streak → +1000 AP
```

Path completion checks are idempotent — the engine queries past `aura_event` rows to confirm no `path_complete` event exists for the same domain before awarding.

---

### `AdminAnalyticsService`

**File**: [`src/services/adminAnalyticsService.ts`](./src/services/adminAnalyticsService.ts)

Aggregates workforce-level analytics for MoSPI division leadership. Currently returns a static-mock snapshot with live learner count overlay. Designed to be replaced with live aggregations as the learner database grows.

**Response shape:**
```typescript
{
  totalOfficials: number,
  overallReadinessScore: number,        // 0-100 composite
  igotCourseEnrollments: number,
  tpacCompletions: number,
  departmentSummary: DepartmentMetric[], // Per-division avg domain scores
  skillGapHotspots: SkillGapHotspot[],  // Priority-ranked gaps
  predictiveCapacityInsights: {
    projectedSkillDeficitNextYear: string,
    recommendedCapacityTrainingHours: number,
    tpacHighPriorityCourses: string[],
    estimatedCapacityIncreasePercent: number
  }
}
```

---

## API Reference

All routes are under `/api`. Authentication is **bypassed for all `/api/(.*)` routes** in the current middleware config (see `proxy.ts`).

| Method | Route | Service | Description |
|---|---|---|---|
| `POST` | `/api/official/profile` | `CompetencyProfilerAgent` | Submit official profile + self-ratings; returns domain scores and skill gaps |
| `GET` | `/api/igot/recommendations` | `IGotRecommendationEngine` | Fetch ranked iGOT/TPAC course recommendations for a learner |
| `POST` | `/api/quiz/generate` | `AIQuizGenerator` | Generate MCQ quiz from document text via Gemini |
| `GET` | `/api/admin/analytics` | `AdminAnalyticsService` | Workforce readiness dashboard data |
| `GET` | `/api/tutor/answer` | `TutorAgent` | RAG-grounded answer to a learner's question |
| `POST` | `/api/onboarding` | `CompetencyProfilerAgent` | Onboarding form submission (profile create/update) |
| `POST` | `/api/generate-dag` | `PlannerAgent` | LLM-generated skill DAG for a domain |
| `POST` | `/api/ingest-roadmap` | `LLMProcessor` / Roadmap Adapter | Ingest content from roadmap.sh or manual source |
| `POST` | `/api/process-llm` | `LLMProcessor.batchProcessItems()` | Batch-embed unprocessed content items |
| `GET` | `/api/learner/state` | `LearnerStateService` | Fetch a learner's full node state map |
| `GET` | `/api/dashboard` | Aggregation | Dashboard summary (stats, active nodes, recent events) |
| `GET` | `/api/recommendation` | `IGotRecommendationEngine` | Alternative recommendation endpoint |

---

## Authentication & Middleware

**File**: [`src/proxy.ts`](./src/proxy.ts)

The Clerk middleware is exported as Next.js middleware from `src/proxy.ts` (not `middleware.ts`) because the Clerk CLI registered it there during `clerk setup`.

```typescript
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|...)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
```

**Route Protection Model:**

```typescript
const isPublicRoute = createRouteMatcher([
  '/',            // Landing page
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding',
  '/dashboard',
  '/quiz/generator',
  '/admin',
  '/api/(.*)',     // All API routes are public (auth enforced per-handler)
]);
```

Protected routes call `auth.protect()` which redirects to `/sign-in` on failure. The Clerk proxy path `/__clerk/:path*` is required for the Clerk JS SDK to function in proxy mode.

**Clerk App**: `app_3Ita61FjYfO6YZQKDVBmjboClny`

---

## Gamification — Aura Engine

The Aura system is the motivational backbone of ImpactX. Every learning action generates an immutable `aura_event` record, and the `learner.aura_points` + `learner.aura_tier` are updated atomically in a single transaction.

**Event → Point Flow:**

```
User passes checkpoint quiz
      ↓
AssessmentService.evaluateCheckpoint()
      ↓
ProgressAgent.handleNodeAttemptEvent()
      ↓
AuraEngine.awardAttemptAP()        ← Calculates AP with streak+first-try bonuses
      ↓
[if node newly completed]
AuraEngine.awardMilestoneAP()      ← Depth-weighted bonus
      ↓
[if all domain nodes completed]
AuraEngine.evaluatePathCompletion() ← Path completion mega-bonus
      ↓
Drizzle transaction: INSERT aura_event + UPDATE learner (points + tier)
```

---

## Environment Variables

Copy `.env.example` to `.env` and populate all values:

```env
# PostgreSQL (Neon recommended — enable pgvector extension first)
DATABASE_URL="postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Google Gemini API
GEMINI_API_KEY=""

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

**Required**: All 3 services (DB, Gemini, Clerk) must be configured for full functionality. The AI Quiz Generator has a built-in offline fallback if `GEMINI_API_KEY` is absent.

---

## Setup & Development

### Prerequisites

- Node.js ≥ 20
- PostgreSQL database with **pgvector** extension enabled
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  ```
- Google Gemini API key ([aistudio.google.com](https://aistudio.google.com))
- Clerk account ([clerk.com](https://clerk.com))

### Installation

```bash
# 1. Clone
git clone <repo-url>
cd impactx

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Fill in DATABASE_URL, GEMINI_API_KEY, and CLERK keys

# 4. Push database schema (creates all tables + enums)
npx drizzle-kit push

# 5. Start development server (Turbopack)
npm run dev
```

### Database Migrations

```bash
# Generate migration SQL from schema changes
npx drizzle-kit generate

# Apply pending migrations
npx drizzle-kit push

# Open Drizzle Studio (GUI)
npx drizzle-kit studio
```

Drizzle config → [`drizzle.config.ts`](./drizzle.config.ts):
- Schema: `./src/db/schema.ts`
- Output: `./src/db/migrations/`
- Dialect: `postgresql`

### Seeding Content

After deploying the schema, populate the vector store:

```bash
# Ingest content via API (POST to /api/ingest-roadmap)
# Then run batch embedding
curl -X POST http://localhost:3000/api/process-llm
```

### Production Build

```bash
npm run build
npm run start
```

---

## Deployment Notes

- **Neon PostgreSQL**: Enable `pgvector` extension in the Neon dashboard before running `drizzle-kit push`. The `contentItem.embedding` column requires it.
- **Clerk Proxy**: The `/__clerk/:path*` matcher in `proxy.ts` is mandatory. Do not remove it.
- **Gemini Quota**: The `llm_cache` table is the primary cost-control mechanism — identical prompts are served from cache after the first call.
- **Vector Dimensions**: The schema uses `vector(3072)` matching the output dimension of `gemini-embedding-001`. Changing the embedding model requires a schema migration and re-embedding all content.
- **Environment**: Next.js 16 does not auto-load `.env` in all server contexts — `dotenv.config()` is called explicitly in `drizzle.config.ts` for the CLI tools.

---

*ImpactX — Precision Capacity Building for India's Official Statistical System.*