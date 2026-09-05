import { pgTable, text, timestamp, json, integer, doublePrecision, boolean, pgEnum, customType, index } from 'drizzle-orm/pg-core';

export const auraTierEnum = pgEnum('aura_tier', ['Spark', 'Ember', 'Flame', 'Blaze', 'Aurora']);
export const sourceEnum = pgEnum('source', ['roadmap_sh', 'manual', 'wikipedia', 'youtube']);
export const nodeStatusEnum = pgEnum('node_status', ['locked', 'unlocked', 'in_progress', 'completed']);
export const quizModeEnum = pgEnum('quiz_mode', ['checkpoint', 'test_out']);
export const answerTypeEnum = pgEnum('answer_type', ['mcq', 'short_answer']);
export const auraEventTypeEnum = pgEnum('aura_event_type', ['checkpoint_pass', 'milestone_complete', 'path_complete', 'test_out_pass', 'streak_bonus']);

export const userRoleEnum = pgEnum('user_role', ['learner_official', 'trainer', 'admin']);
export const providerEnum = pgEnum('provider', ['iGOT_Karmayogi', 'NSSTA_TPAC', 'Internal_MoSPI']);

const vector = customType<{ data: number[]; driverData: string }>({
  dataType(config) {
    return 'vector(3072)';
  },
  toDriver(value) {
    return `[${value.join(',')}]`;
  },
});

export const learner = pgTable('learner', {
  id: text('id').primaryKey(), // Clerk user id
  createdAt: timestamp('created_at').defaultNow().notNull(),
  name: text('name'),
  role: text('role').default('learner_official').notNull(),
  designation: text('designation'),
  department: text('department'),
  cadre: text('cadre'),
  qualifications: text('qualifications'),
  workExperienceYears: integer('work_experience_years').default(0),
  skillVector: json('skill_vector').$type<Record<string, number>>(),
  domainScores: json('domain_scores').$type<{
    statistical: number;
    technical: number;
    governance: number;
    managerial: number;
  }>(),
  identifiedSkillGaps: json('identified_skill_gaps').$type<string[]>(),
  careerGoal: text('career_goal'),
  interests: text('interests').array(),
  preferredFormat: text('preferred_format'),
  auraPoints: integer('aura_points').default(0).notNull(),
  auraTier: auraTierEnum('aura_tier').default('Spark').notNull(),
  streakDays: integer('streak_days').default(0).notNull(),
  lastActive: timestamp('last_active'),
});

export const officialCompetencyBenchmark = pgTable('official_competency_benchmark', {
  id: text('id').primaryKey(),
  designation: text('designation').notNull(),
  department: text('department').notNull(),
  statisticalBenchmark: doublePrecision('statistical_benchmark').notNull(),
  technicalBenchmark: doublePrecision('technical_benchmark').notNull(),
  governanceBenchmark: doublePrecision('governance_benchmark').notNull(),
  managerialBenchmark: doublePrecision('managerial_benchmark').notNull(),
  requiredSkills: text('required_skills').array().notNull(),
});

export const igotCourseCatalog = pgTable('igot_course_catalog', {
  id: text('id').primaryKey(),
  provider: providerEnum('provider').default('iGOT_Karmayogi').notNull(),
  title: text('title').notNull(),
  domain: text('domain').notNull(),
  competencyTags: text('competency_tags').array().notNull(),
  difficultyLevel: text('difficulty_level').notNull(),
  durationHours: doublePrecision('duration_hours').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  tpacRecommended: boolean('tpac_recommended').default(false).notNull(),
});

export const uploadedMaterial = pgTable('uploaded_material', {
  id: text('id').primaryKey(),
  uploaderId: text('uploader_id').references(() => learner.id).notNull(),
  title: text('title').notNull(),
  fileType: text('file_type').notNull(),
  contentSnippet: text('content_snippet').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiGeneratedQuiz = pgTable('ai_generated_quiz', {
  id: text('id').primaryKey(),
  materialId: text('material_id').references(() => uploadedMaterial.id),
  title: text('title').notNull(),
  targetDomain: text('target_domain').notNull(),
  difficulty: text('difficulty').notNull(),
  questions: json('questions').$type<Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const roadmapSourceCache = pgTable('roadmap_source_cache', {
  trajectorySlug: text('trajectory_slug').primaryKey(),
  fetchedAt: timestamp('fetched_at').defaultNow().notNull(),
  rawTopicTree: json('raw_topic_tree').notNull(),
  matchedRoadmapIds: text('matched_roadmap_ids').array().notNull(),
});

export const contentItem = pgTable('content_item', {
  id: text('id').primaryKey(),
  source: sourceEnum('source').notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  resourceSummary: text('resource_summary'),
  domain: text('domain').notNull(),
  topicTags: text('topic_tags').array(),
  estimatedDifficulty: doublePrecision('estimated_difficulty'),
  embedding: vector('embedding'),
});

export const skillNode = pgTable('skill_node', {
  id: text('id').primaryKey(),
  domain: text('domain').notNull(),
  category: text('category'), // New category field
  label: text('label').notNull(),
  difficulty: doublePrecision('difficulty').notNull(),
  prerequisiteIds: text('prerequisite_ids').array(),
  linkedContentIds: text('linked_content_ids').array(),
  checkpointItemBank: text('checkpoint_item_bank').array(),
});

export const learnerNodeState = pgTable('learner_node_state', {
  learnerId: text('learner_id').references(() => learner.id).notNull(),
  nodeId: text('node_id').references(() => skillNode.id).notNull(),
  status: nodeStatusEnum('status').default('locked').notNull(),
  testOutEligible: boolean('test_out_eligible').default(false).notNull(),
  testOutAttempted: boolean('test_out_attempted').default(false).notNull(),
  thetaEstimate: doublePrecision('theta_estimate'),
  lastCheckpointScore: doublePrecision('last_checkpoint_score'),
  attempts: integer('attempts').default(0).notNull(),
  seenQuizItemIds: text('seen_quiz_item_ids').array(),
  personalizedPrerequisiteIds: text('personalized_prerequisite_ids').array(),
}, (table) => {
  return {
    learnerStatusIdx: index('learner_status_idx').on(table.learnerId, table.status),
    learnerNodeIdx: index('learner_node_idx').on(table.learnerId, table.nodeId),
  };
});

export const llmCache = pgTable('llm_cache', {
  id: text('id').primaryKey(),
  promptHash: text('prompt_hash').notNull().unique(),
  response: text('response').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const quizItem = pgTable('quiz_item', {
  id: text('id').primaryKey(),
  nodeId: text('node_id').references(() => skillNode.id).notNull(),
  mode: quizModeEnum('mode').notNull(),
  prompt: text('prompt').notNull(),
  answerType: answerTypeEnum('answer_type').notNull(),
  correctAnswerOrRubric: json('correct_answer_or_rubric').notNull(),
  irtDifficultyB: doublePrecision('irt_difficulty_b').notNull(),
  pointValue: doublePrecision('point_value').notNull(),
});

export const auraEvent = pgTable('aura_event', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id').references(() => learner.id).notNull(),
  nodeId: text('node_id').references(() => skillNode.id),
  type: auraEventTypeEnum('type').notNull(),
  pointsAwarded: doublePrecision('points_awarded').notNull(),
  breakdown: json('breakdown').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
