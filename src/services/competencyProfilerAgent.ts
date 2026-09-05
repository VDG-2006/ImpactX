import { db } from '../db';
import { learner } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface OfficialProfileInput {
  learnerId: string;
  name?: string;
  role?: 'learner_official' | 'trainer' | 'admin';
  designation: string;
  department: string;
  cadre: string;
  qualifications: string;
  workExperienceYears: number;
  ratings: Record<string, 'Newbie' | 'Familiar' | 'Expert' | string>;
}

export interface DomainScores {
  statistical: number; // 0 - 100
  technical: number;
  governance: number;
  managerial: number;
}

export class CompetencyProfilerAgent {
  /**
   * Predefined Benchmark frameworks for Official Statistics designations
   */
  static getRoleBenchmarks(department: string, designation: string): DomainScores {
    const dep = department.toLowerCase();
    const des = designation.toLowerCase();

    if (dep.includes('national account') || des.includes('director')) {
      return { statistical: 85, technical: 75, governance: 80, managerial: 80 };
    }
    if (dep.includes('survey') || dep.includes('field') || des.includes('investigator')) {
      return { statistical: 80, technical: 70, governance: 65, managerial: 60 };
    }
    if (dep.includes('price') || dep.includes('labour') || dep.includes('industry')) {
      return { statistical: 80, technical: 80, governance: 70, managerial: 65 };
    }
    // Default standard benchmark
    return { statistical: 75, technical: 70, governance: 70, managerial: 70 };
  }

  /**
   * Evaluates baseline domain scores and skill gaps based on self-assessments & profile details.
   */
  static evaluateCompetencies(input: OfficialProfileInput): {
    domainScores: DomainScores;
    skillGaps: string[];
    benchmark: DomainScores;
  } {
    const ratings = input.ratings || {};

    let statCount = 0, statSum = 0;
    let techCount = 0, techSum = 0;
    let govCount = 0, govSum = 0;
    let mgrCount = 0, mgrSum = 0;

    const skillGaps: string[] = [];

    // Score map
    const scoreVal = (val: string) => {
      const v = (val || '').toLowerCase();
      if (v === 'expert' || v === 'advanced') return 90;
      if (v === 'familiar' || v === 'some') return 60;
      return 30; // Newbie / New
    };

    // Category mapping logic
    for (const [topic, ratingStr] of Object.entries(ratings)) {
      const score = scoreVal(ratingStr);
      const topicLower = topic.toLowerCase();

      if (
        topicLower.includes('survey') || topicLower.includes('sampling') ||
        topicLower.includes('national accounts') || topicLower.includes('price') ||
        topicLower.includes('labour') || topicLower.includes('sdg') ||
        topicLower.includes('data quality') || topicLower.includes('statistics')
      ) {
        statSum += score;
        statCount++;
      } else if (
        topicLower.includes('python') || topicLower.includes('r') ||
        topicLower.includes('sql') || topicLower.includes('stata') ||
        topicLower.includes('spss') || topicLower.includes('gis') ||
        topicLower.includes('ai') || topicLower.includes('visualization')
      ) {
        techSum += score;
        techCount++;
      } else if (
        topicLower.includes('privacy') || topicLower.includes('cyber') ||
        topicLower.includes('signature') || topicLower.includes('cloud') ||
        topicLower.includes('dpi') || topicLower.includes('governance')
      ) {
        govSum += score;
        govCount++;
      } else {
        mgrSum += score;
        mgrCount++;
      }

      if (score < 70) {
        skillGaps.push(topic);
      }
    }

    // Default baseline factor based on work experience
    const expBonus = Math.min(input.workExperienceYears * 2, 10);

    const domainScores: DomainScores = {
      statistical: Math.min(100, Math.round((statCount > 0 ? statSum / statCount : 50) + expBonus)),
      technical: Math.min(100, Math.round((techCount > 0 ? techSum / techCount : 45) + expBonus)),
      governance: Math.min(100, Math.round((govCount > 0 ? govSum / govCount : 50) + expBonus)),
      managerial: Math.min(100, Math.round((mgrCount > 0 ? mgrSum / mgrCount : 55) + expBonus)),
    };

    const benchmark = this.getRoleBenchmarks(input.department, input.designation);

    // Identify gaps against benchmarks
    if (domainScores.statistical < benchmark.statistical && !skillGaps.includes('National Accounts & Sampling')) {
      skillGaps.push('National Accounts & Advanced Sampling Techniques');
    }
    if (domainScores.technical < benchmark.technical && !skillGaps.includes('Python & Spatial GIS Analytics')) {
      skillGaps.push('Python & Spatial GIS Analytics for Statistics');
    }
    if (domainScores.governance < benchmark.governance && !skillGaps.includes('Data Privacy (DPDP Act) & Digital Public Infrastructure')) {
      skillGaps.push('Data Privacy (DPDP Act) & Digital Public Infrastructure');
    }
    if (domainScores.managerial < benchmark.managerial && !skillGaps.includes('Statistical Project Management & Ethics')) {
      skillGaps.push('Statistical Project Management & Ethics');
    }

    return { domainScores, skillGaps, benchmark };
  }

  /**
   * Processes official profile saving to DB and updates competency scores.
   */
  static async processOfficialProfile(input: OfficialProfileInput) {
    const { domainScores, skillGaps } = this.evaluateCompetencies(input);

    let [existingLearner] = await db.select().from(learner).where(eq(learner.id, input.learnerId));

    if (!existingLearner) {
      await db.insert(learner).values({
        id: input.learnerId,
        name: input.name || 'Official User',
        role: input.role || 'learner_official',
        designation: input.designation,
        department: input.department,
        cadre: input.cadre,
        qualifications: input.qualifications,
        workExperienceYears: input.workExperienceYears,
        domainScores,
        identifiedSkillGaps: skillGaps,
        careerGoal: `Capacity building for ${input.designation} in ${input.department}`,
      });
    } else {
      await db
        .update(learner)
        .set({
          name: input.name || existingLearner.name || 'Official User',
          role: input.role || existingLearner.role,
          designation: input.designation,
          department: input.department,
          cadre: input.cadre,
          qualifications: input.qualifications,
          workExperienceYears: input.workExperienceYears,
          domainScores,
          identifiedSkillGaps: skillGaps,
        })
        .where(eq(learner.id, input.learnerId));
    }

    return {
      success: true,
      domainScores,
      skillGaps,
    };
  }
}
