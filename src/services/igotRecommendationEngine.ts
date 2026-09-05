export interface IGotCourse {
  id: string;
  provider: 'iGOT_Karmayogi' | 'NSSTA_TPAC' | 'Internal_MoSPI';
  title: string;
  domain: 'Statistical' | 'Technical' | 'Digital Governance' | 'Managerial';
  competencyTags: string[];
  difficultyLevel: 'Foundational' | 'Intermediate' | 'Advanced';
  durationHours: number;
  url: string;
  description: string;
  tpacRecommended: boolean;
  matchScore?: number;
}

export const IGOT_COURSE_CATALOG: IGotCourse[] = [
  // Statistical Competencies
  {
    id: 'igot-stat-01',
    provider: 'iGOT_Karmayogi',
    title: 'National Accounts Statistics & GDP Estimation Framework',
    domain: 'Statistical',
    competencyTags: ['National Accounts', 'GDP/GVA', 'MoSPI Frameworks', 'Data Quality Frameworks'],
    difficultyLevel: 'Intermediate',
    durationHours: 12,
    url: 'https://igotkarmayogi.gov.in/app/toc/igot-stat-01',
    description: 'Comprehensive guide to compilation of National Accounts, Gross Value Added, and sector-wise statistical estimations in India.',
    tpacRecommended: true,
  },
  {
    id: 'igot-stat-02',
    provider: 'NSSTA_TPAC',
    title: 'Advanced Survey Design & Multi-Stage Sampling Techniques',
    domain: 'Statistical',
    competencyTags: ['Survey Design', 'Sampling', 'NSSO Methodology', 'Metadata Standards'],
    difficultyLevel: 'Advanced',
    durationHours: 18,
    url: 'https://nssta.gov.in/tpac/sampling-advanced',
    description: 'TPAC recommended program covering stratified random sampling, cluster sampling, weighting, and non-sampling error minimization.',
    tpacRecommended: true,
  },
  {
    id: 'igot-stat-03',
    provider: 'iGOT_Karmayogi',
    title: 'Consumer & Wholesale Price Index (CPI/WPI) Compilation',
    domain: 'Statistical',
    competencyTags: ['Price Statistics', 'CPI', 'WPI', 'Inflation Analytics'],
    difficultyLevel: 'Intermediate',
    durationHours: 8,
    url: 'https://igotkarmayogi.gov.in/app/toc/igot-price-03',
    description: 'Practical training on basket item selection, base year revision, and index calculations for price statistics.',
    tpacRecommended: false,
  },
  {
    id: 'igot-stat-04',
    provider: 'NSSTA_TPAC',
    title: 'Periodic Labour Force Survey (PLFS) & Employment Indicators',
    domain: 'Statistical',
    competencyTags: ['Labour Statistics', 'PLFS', 'SDG Indicators', 'Survey Design'],
    difficultyLevel: 'Intermediate',
    durationHours: 14,
    url: 'https://nssta.gov.in/tpac/plfs-labour',
    description: 'NSSTA core module on activity statuses, key labor metrics, and survey data validation.',
    tpacRecommended: true,
  },

  // Technical Competencies
  {
    id: 'igot-tech-01',
    provider: 'iGOT_Karmayogi',
    title: 'Python for Statistical Data Processing & Automated Cleaning',
    domain: 'Technical',
    competencyTags: ['Python', 'Data Visualization', 'SQL', 'Automation'],
    difficultyLevel: 'Foundational',
    durationHours: 16,
    url: 'https://igotkarmayogi.gov.in/app/toc/igot-python-stat',
    description: 'Hands-on programming using Pandas, NumPy, and Statsmodels for government data processing.',
    tpacRecommended: true,
  },
  {
    id: 'igot-tech-02',
    provider: 'NSSTA_TPAC',
    title: 'GIS & Spatial Data Analytics for Census and Official Surveys',
    domain: 'Technical',
    competencyTags: ['GIS', 'Spatial Analytics', 'Open Data', 'Python'],
    difficultyLevel: 'Advanced',
    durationHours: 20,
    url: 'https://nssta.gov.in/tpac/gis-spatial-stat',
    description: 'Geo-spatial mapping, QGIS integration, and remote sensing applications in official statistical data.',
    tpacRecommended: true,
  },
  {
    id: 'igot-tech-03',
    provider: 'iGOT_Karmayogi',
    title: 'AI & Machine Learning for Official Statistics & Forecasting',
    domain: 'Technical',
    competencyTags: ['AI/ML', 'Cloud Computing', 'APIs', 'Python'],
    difficultyLevel: 'Advanced',
    durationHours: 25,
    url: 'https://igotkarmayogi.gov.in/app/toc/igot-aiml-stats',
    description: 'Modern predictive analytics, time series forecasting, and anomaly detection in large statistical repositories.',
    tpacRecommended: true,
  },

  // Digital Governance
  {
    id: 'igot-gov-01',
    provider: 'iGOT_Karmayogi',
    title: 'Digital Personal Data Protection Act (DPDP) & Data Privacy for Officials',
    domain: 'Digital Governance',
    competencyTags: ['Data Privacy', 'Cybersecurity', 'Digital Public Infrastructure'],
    difficultyLevel: 'Foundational',
    durationHours: 6,
    url: 'https://igotkarmayogi.gov.in/app/toc/igot-dpdp-2023',
    description: 'Mandatory awareness module on compliance with the DPDP Act 2023, data fiduciary obligations, and privacy guidelines.',
    tpacRecommended: true,
  },
  {
    id: 'igot-gov-02',
    provider: 'NSSTA_TPAC',
    title: 'Government Cloud (MeghRaj) & Secure API Interoperability',
    domain: 'Digital Governance',
    competencyTags: ['Government Cloud', 'APIs', 'Cybersecurity', 'Digital Signatures'],
    difficultyLevel: 'Intermediate',
    durationHours: 10,
    url: 'https://nssta.gov.in/tpac/meghraj-cloud-api',
    description: 'Architecting secure API integrations, government cloud deployment standards, and digital signature workflows.',
    tpacRecommended: true,
  },

  // Behavioural & Managerial
  {
    id: 'igot-mgr-01',
    provider: 'iGOT_Karmayogi',
    title: 'Evidence-Based Public Policy & Executive Decision Making',
    domain: 'Managerial',
    competencyTags: ['Leadership', 'Decision Making', 'Ethics', 'Communication'],
    difficultyLevel: 'Intermediate',
    durationHours: 8,
    url: 'https://igotkarmayogi.gov.in/app/toc/igot-policy-making',
    description: 'Translating statistical insights into actionable government policy directives and public communication.',
    tpacRecommended: true,
  },
  {
    id: 'igot-mgr-02',
    provider: 'NSSTA_TPAC',
    title: 'Agile Statistical Project Management & Team Leadership',
    domain: 'Managerial',
    competencyTags: ['Project Management', 'Change Management', 'Leadership'],
    difficultyLevel: 'Intermediate',
    durationHours: 12,
    url: 'https://nssta.gov.in/tpac/project-mgmt-lead',
    description: 'Managing large-scale survey projects, field enumeration teams, and cross-departmental statistical deliverables.',
    tpacRecommended: true,
  },
];

export class IGotRecommendationEngine {
  /**
   * Generates tailored iGOT Karmayogi & NSSTA TPAC course recommendations matching identified skill gaps.
   */
  static recommendPathways(
    skillGaps: string[],
    domainScores: { statistical: number; technical: number; governance: number; managerial: number },
    department: string
  ): IGotCourse[] {
    const gapsLower = skillGaps.map((g) => g.toLowerCase());

    const scoredCourses = IGOT_COURSE_CATALOG.map((course) => {
      let score = 50; // Base baseline match score

      // Domain gap boosting
      if (course.domain === 'Statistical' && domainScores.statistical < 85) score += 20;
      if (course.domain === 'Technical' && domainScores.technical < 85) score += 20;
      if (course.domain === 'Digital Governance' && domainScores.governance < 85) score += 15;
      if (course.domain === 'Managerial' && domainScores.managerial < 85) score += 15;

      // Tag matching with identified gaps
      for (const tag of course.competencyTags) {
        const tagLower = tag.toLowerCase();
        if (gapsLower.some((gap) => gap.includes(tagLower) || tagLower.includes(gap))) {
          score += 25;
        }
      }

      // TPAC Recommendation Priority Bonus
      if (course.tpacRecommended) {
        score += 15;
      }

      return {
        ...course,
        matchScore: Math.min(99, score),
      };
    });

    // Sort by highest match score
    return scoredCourses.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}
