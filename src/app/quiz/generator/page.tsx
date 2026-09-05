"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizResult {
  title: string;
  targetDomain: string;
  difficulty: string;
  questions: Question[];
}

export default function TrainerQuizStudio() {
  const [docTitle, setDocTitle] = useState('Guidelines on National Accounts & GDP Base Year Revision 2011-12');
  const [targetDomain, setTargetDomain] = useState('Statistical Competencies');
  const [questionCount, setQuestionCount] = useState(5);
  const [contentSnippet, setContentSnippet] = useState(
    `The Gross Value Added (GVA) at basic prices is compiled by taking the sum of GVA at factor cost and net production taxes (production taxes minus production subsidies). Production taxes are paid irrespective of the actual volume of production, such as land revenues, stamp fees, and professional tax. On the other hand, product taxes are levied per unit of product, such as GST, excise duty, and custom duties.

When evaluating survey data under the Periodic Labour Force Survey (PLFS), the Current Weekly Status (CWS) measures economic activity over the preceding 7 days, whereas Usual Principal Activity Status (UPS) measures activity over a reference period of 365 days prior to the date of survey.`
  );

  const [generating, setGenerating] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setQuizResult(null);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: docTitle,
          content: contentSnippet,
          questionCount,
          targetDomain,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizResult(data.quiz);
      }
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '84px', paddingBottom: '60px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ marginBottom: '28px' }}>
            <span
              style={{
                background: '#EEF2FF',
                color: '#4F46E5',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '6px 16px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Trainer & Assessment Creator Studio
            </span>
            <h1 style={{ fontSize: '2.25rem', color: '#1E1B4B', marginTop: '12px', marginBottom: '8px', fontWeight: 800 }}>
              ⚡ AI-Powered Intelligent Quiz & MCQ Generator
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0 }}>
              Upload or paste learning materials (documents, manuals, transcripts) to generate automated objective assessments with instant feedback.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px' }}>
            
            {/* Left Form Column */}
            <div
              style={{
                background: '#FFF',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', color: '#1E1B4B', margin: '0 0 20px 0', fontWeight: 700 }}>
                📄 Upload Training Material Context
              </h2>

              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px', fontSize: '0.9rem' }}>
                    Document / Course Title
                  </label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px', fontSize: '0.9rem' }}>
                      Target Domain
                    </label>
                    <select
                      value={targetDomain}
                      onChange={(e) => setTargetDomain(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem',
                        background: '#FFF',
                      }}
                    >
                      <option value="Statistical Competencies">Statistical Competencies</option>
                      <option value="Technical Competencies">Technical Competencies</option>
                      <option value="Digital Governance">Digital Governance</option>
                      <option value="Managerial Competencies">Managerial Competencies</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px', fontSize: '0.9rem' }}>
                      Questions Count
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem',
                        background: '#FFF',
                      }}
                    >
                      <option value={3}>3 MCQs</option>
                      <option value={5}>5 MCQs</option>
                      <option value={8}>8 MCQs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px', fontSize: '0.9rem' }}>
                    Learning Content / Reference Text
                  </label>
                  <textarea
                    rows={8}
                    value={contentSnippet}
                    onChange={(e) => setContentSnippet(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      lineHeight: 1.4,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                    color: '#FFF',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)',
                    marginTop: '8px',
                  }}
                >
                  {generating ? '⚡ Gemini AI Generating MCQs...' : '✨ Generate MCQs & Quiz Options'}
                </button>
              </form>
            </div>

            {/* Right Output Column */}
            <div>
              <div
                style={{
                  background: '#FFF',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: '1px solid #E2E8F0',
                  minHeight: '480px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.25rem', color: '#1E1B4B', margin: 0, fontWeight: 700 }}>
                    🎯 Generated MCQ Assessment Preview
                  </h2>
                </div>

                {!quizResult && !generating && (
                  <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94A3B8' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📝</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>No Quiz Generated Yet</div>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Fill in the training document context on the left and click Generate.</p>
                  </div>
                )}

                {generating && (
                  <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4F46E5' }}>
                    <div className="animate-spin" style={{ fontSize: '3rem', marginBottom: '12px' }}>⚙️</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Assessment Engine Working...</div>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '4px' }}>Analyzing document text and constructing objective MCQs with explanations.</p>
                  </div>
                )}

                {quizResult && (
                  <div>
                    <div style={{ background: '#EEF2FF', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#3730A3' }}>{quizResult.title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#4338CA', marginTop: '4px' }}>
                        Domain: {quizResult.targetDomain} • Difficulty: {quizResult.difficulty} • Total Questions: {quizResult.questions.length}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {quizResult.questions.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          style={{
                            padding: '18px',
                            background: '#F8FAFC',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.98rem', marginBottom: '12px' }}>
                            Q{qIdx + 1}. {q.question}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.88rem',
                                  border: optIdx === q.correctIndex ? '2px solid #16A34A' : '1px solid #CBD5E1',
                                  background: optIdx === q.correctIndex ? '#DCFCE7' : '#FFF',
                                  color: optIdx === q.correctIndex ? '#15803D' : '#334155',
                                  fontWeight: optIdx === q.correctIndex ? 700 : 500,
                                }}
                              >
                                {String.fromCharCode(65 + optIdx)}. {opt} {optIdx === q.correctIndex && '✓ (Correct)'}
                              </div>
                            ))}
                          </div>

                          <div style={{ background: '#FEF3C7', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#92400E', lineHeight: 1.4 }}>
                            <strong>💡 Official Explanation:</strong> {q.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
