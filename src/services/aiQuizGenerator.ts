import { GoogleGenAI, Type } from '@google/genai';

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizGenResult {
  title: string;
  targetDomain: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced';
  questions: GeneratedQuestion[];
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock-key' });

export class AIQuizGenerator {
  /**
   * Generates objective MCQs and quizzes from uploaded document text/context.
   */
  static async generateQuizFromText(
    title: string,
    content: string,
    questionCount: number = 5,
    targetDomain: string = 'Official Statistics'
  ): Promise<QuizGenResult> {
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
          You are an expert trainer and assessment creator for India's Official Statistical System (MoSPI / NSSTA).
          Generate a high-quality objective quiz with exactly ${questionCount} multiple-choice questions (MCQs) based on the provided learning material.

          Title of Document: ${title}
          Target Domain: ${targetDomain}
          Uploaded Learning Content / Text:
          ${content.slice(0, 4000)}

          Each MCQ must have:
          - A clear, unambiguous question testing practical application or domain knowledge.
          - 4 options.
          - 0-indexed correct option (correctIndex).
          - Detailed explanation clarifying why the correct answer is right according to official statistical standards.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                targetDomain: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctIndex', 'explanation'],
                  },
                },
              },
              required: ['title', 'targetDomain', 'difficulty', 'questions'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return {
            title: parsed.title || title,
            targetDomain: parsed.targetDomain || targetDomain,
            difficulty: (parsed.difficulty as any) || 'Intermediate',
            questions: parsed.questions,
          };
        }
      } catch (err) {
        console.warn('Gemini API quiz generation failed or key missing, fallback to template generator:', err);
      }
    }

    // Fallback template quiz generation for statistical system
    return this.generateFallbackQuiz(title, targetDomain, questionCount);
  }

  private static generateFallbackQuiz(title: string, targetDomain: string, count: number): QuizGenResult {
    const pool: GeneratedQuestion[] = [
      {
        question: `Under the compilation framework for National Accounts Statistics in India, how is Gross Value Added (GVA) at basic prices derived from GVA at factor cost?`,
        options: [
          'GVA at basic prices = GVA at factor cost + Net Production Taxes',
          'GVA at basic prices = GVA at factor cost - Net Product Taxes',
          'GVA at basic prices = GDP at market prices + Subsidies',
          'GVA at basic prices = Net National Product at factor cost + Depreciation',
        ],
        correctIndex: 0,
        explanation: 'GVA at basic prices includes production taxes (less production subsidies) applied to factor cost, as per the 2011-12 base revision guidelines.',
      },
      {
        question: `In the Periodic Labour Force Survey (PLFS), which measure captures an individual's economic activity status based on the reference period of the preceding 7 days?`,
        options: [
          'Usual Principal Activity Status (UPS)',
          'Current Weekly Status (CWS)',
          'Current Daily Status (CDS)',
          'Subsidiary Economic Status (SES)',
        ],
        correctIndex: 1,
        explanation: 'Current Weekly Status (CWS) assesses economic activity status during a reference period of seven days preceding the date of survey.',
      },
      {
        question: `Which statistical sampling technique is primary when conducting multi-stage stratification across rural blocks and urban frame survey (UFS) blocks in India?`,
        options: [
          'Simple Random Sampling without Replacement (SRSWOR)',
          'Stratified Multi-Stage Sampling',
          'Convenience Non-Probability Sampling',
          'Systematic Cluster Sampling without Stratification',
        ],
        correctIndex: 1,
        explanation: 'Official large-scale socio-economic surveys like NSSO utilize Stratified Multi-Stage Sampling, where FSU (First Stage Units) are villages/UFS blocks and SSU are households.',
      },
      {
        question: `Under the Digital Personal Data Protection (DPDP) Act 2023, what is the mandatory requirement when processing personal statistical data collected from survey respondents?`,
        options: [
          'Obtaining explicit informed consent and specifying lawful purpose',
          'Publishing un-anonymized raw microdata publicly',
          'Storing raw records on third-party public cloud without encryption',
          'Bypassing data fiduciary obligations for all statistical activities',
        ],
        correctIndex: 0,
        explanation: 'The DPDP Act 2023 obligates data fiduciaries to collect data with explicit consent for specified lawful purposes, requiring strict anonymization for public dissemination.',
      },
      {
        question: `What is the primary role of Python's GeoPandas library in official statistical analytics?`,
        options: [
          'Compiling monthly Wholesale Price Index tables',
          'Handling spatial dataframes, shapefiles, and geo-statistical boundary visualisations',
          'Generating automated survey audio recordings',
          'Managing secure single sign-on authentication',
        ],
        correctIndex: 1,
        explanation: 'GeoPandas extends Pandas data types to allow spatial operations on geometric types, critical for spatial statistics, Census boundary mapping, and GIS analytical layers.',
      },
    ];

    return {
      title: title || 'Official Statistics Assessment',
      targetDomain: targetDomain || 'Statistical Methods & Governance',
      difficulty: 'Intermediate',
      questions: pool.slice(0, count),
    };
  }
}
