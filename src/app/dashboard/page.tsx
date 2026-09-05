"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface IGotCourse {
  id: string;
  provider: 'iGOT_Karmayogi' | 'NSSTA_TPAC' | 'Internal_MoSPI';
  title: string;
  domain: 'Statistical' | 'Technical' | 'Digital Governance' | 'Managerial';
  competencyTags: string[];
  difficultyLevel: string;
  durationHours: number;
  url: string;
  description: string;
  tpacRecommended: boolean;
  matchScore?: number;
}

export default function LearnerDashboard() {
  const [profile, setProfile] = useState({
    name: 'Shri Rajesh Kumar',
    designation: 'Deputy Director',
    department: 'National Accounts Division (NAD)',
    cadre: 'Indian Statistical Service (ISS)',
    qualifications: 'M.Sc Statistics (ISU)',
    workExperienceYears: 7,
    domainScores: {
      statistical: 82,
      technical: 68,
      governance: 62,
      managerial: 75,
    },
    benchmark: {
      statistical: 85,
      technical: 75,
      governance: 80,
      managerial: 80,
    },
    identifiedSkillGaps: [
      'GIS & Spatial Analytics for Survey Data',
      'Digital Personal Data Protection (DPDP Act)',
      'AI & Time-Series Forecasting in National Accounts',
      'Advanced Sampling Calibration Weights',
    ],
  });

  const [recommendations, setRecommendations] = useState<IGotCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // StatsGov AI Copilot chat state
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Namaste! I am your StatsGov AI Copilot. How can I assist you today with MoSPI statistical guidelines, iGOT courses, or survey sampling methodology?',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/igot/recommendations');
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSendCopilotQuery = async () => {
    if (!inputQuery.trim()) return;
    const userMsg = inputQuery;
    setInputQuery('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsCopilotTyping(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: 'assistant', text: data.answer || 'Thank you for your question.' }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: 'I am here to assist with official statistics guidelines, survey sampling, and iGOT course details.' },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Statistical query processed. Please check recommended iGOT pathways for further learning.' },
      ]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '84px', paddingBottom: '60px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Official Banner Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
              borderRadius: '20px',
              padding: '32px',
              color: '#FFF',
              marginBottom: '32px',
              boxShadow: '0 12px 30px -5px rgba(30, 58, 138, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {profile.cadre}
                </span>
                <span style={{ background: '#3B82F6', color: '#FFF', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {profile.department}
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>{profile.name}</h1>
              <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '1.05rem' }}>
                {profile.designation} • {profile.qualifications} ({profile.workExperienceYears} Years Experience)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '16px 24px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>320</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Aura Points</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '16px 24px', borderRadius: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>14 Days</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Learning Streak</div>
              </div>
              <Link href="/onboarding" className="pill" style={{ background: '#FFF', color: '#1E3A8A', padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700, alignSelf: 'center', textDecoration: 'none' }}>
                Re-assess Profile
              </Link>
            </div>
          </div>

          {/* Grid Layout: Left Column (Competency Radar & Skill Gaps) | Right Column (iGOT Recommendations) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '32px' }}>
            
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Competency Domain Score Card */}
              <div
                style={{
                  background: '#FFF',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.35rem', color: '#1E3A8A', margin: 0, fontWeight: 700 }}>
                    🎯 Competency Profile vs Benchmark
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Role Target: {profile.designation}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <DomainScoreBar
                    title="Statistical Competencies"
                    score={profile.domainScores.statistical}
                    benchmark={profile.benchmark.statistical}
                    icon="📊"
                  />
                  <DomainScoreBar
                    title="Technical Competencies"
                    score={profile.domainScores.technical}
                    benchmark={profile.benchmark.technical}
                    icon="💻"
                  />
                  <DomainScoreBar
                    title="Digital Governance"
                    score={profile.domainScores.governance}
                    benchmark={profile.benchmark.governance}
                    icon="🔒"
                  />
                  <DomainScoreBar
                    title="Managerial & Behavioural"
                    score={profile.domainScores.managerial}
                    benchmark={profile.benchmark.managerial}
                    icon="💼"
                  />
                </div>
              </div>

              {/* Identified Skill-Gap Heatmap */}
              <div
                style={{
                  background: '#FFF',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h2 style={{ fontSize: '1.35rem', color: '#1E3A8A', margin: '0 0 16px 0', fontWeight: 700 }}>
                  ⚠️ Identified Skill Gaps
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: 0, marginBottom: '16px' }}>
                  Automated gap assessment calculated against MoSPI competency benchmarks.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {profile.identifiedSkillGaps.map((gap, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 16px',
                        background: '#FEF2F2',
                        borderLeft: '4px solid #EF4444',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#991B1B' }}>{gap}</span>
                      <span style={{ fontSize: '0.75rem', background: '#FEE2E2', color: '#991B1B', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                        High Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: iGOT & NSSTA TPAC Pathways */}
            <div>
              <div
                style={{
                  background: '#FFF',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', color: '#1E3A8A', margin: 0, fontWeight: 700 }}>
                      🚀 Recommended iGOT & TPAC Pathways
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
                      AI-curated learning paths to bridge your exact competency gaps.
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading recommendations...</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {recommendations.map((course) => (
                      <div
                        key={course.id}
                        style={{
                          padding: '20px',
                          borderRadius: '14px',
                          border: course.tpacRecommended ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                          background: course.tpacRecommended ? '#F0F9FF' : '#FFF',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span
                              style={{
                                background: course.provider === 'NSSTA_TPAC' ? '#1E3A8A' : '#2563EB',
                                color: '#FFF',
                                fontSize: '0.75rem',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontWeight: 700,
                              }}
                            >
                              {course.provider === 'NSSTA_TPAC' ? 'NSSTA TPAC' : 'iGOT Karmayogi'}
                            </span>
                            {course.tpacRecommended && (
                              <span
                                style={{
                                  background: '#FEF3C7',
                                  color: '#D97706',
                                  fontSize: '0.75rem',
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  fontWeight: 700,
                                }}
                              >
                                ⭐ TPAC Core
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px' }}>
                            {course.matchScore}% Match
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', color: '#0F172A', margin: '8px 0 6px 0', fontWeight: 700 }}>
                          {course.title}
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                          {course.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '12px' }}>
                            <span>⏱️ {course.durationHours} Hours</span>
                            <span>🎯 {course.difficultyLevel}</span>
                            <span>🏷️ {course.domain}</span>
                          </div>
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: 'none',
                              background: '#1E3A8A',
                              color: '#FFF',
                              fontSize: '0.85rem',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              fontWeight: 600,
                            }}
                          >
                            Enroll on iGOT →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* StatsGov AI Copilot Floating Assistant */}
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}>
          {!copilotOpen ? (
            <button
              onClick={() => setCopilotOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                color: '#FFF',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              🤖 Ask StatsGov AI Copilot
            </button>
          ) : (
            <div
              style={{
                width: '380px',
                height: '520px',
                background: '#FFF',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '1px solid #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Copilot Header */}
              <div
                style={{
                  background: '#1E3A8A',
                  color: '#FFF',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🤖</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>StatsGov AI Copilot</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>MoSPI & iGOT Assistant</div>
                  </div>
                </div>
                <button onClick={() => setCopilotOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '1.2rem', cursor: 'pointer' }}>
                  ✕
                </button>
              </div>

              {/* Messages Body */}
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#F8FAFC' }}>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      background: m.role === 'user' ? '#1E3A8A' : '#FFF',
                      color: m.role === 'user' ? '#FFF' : '#1E293B',
                      padding: '10px 14px',
                      borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      maxWidth: '82%',
                      fontSize: '0.88rem',
                      lineHeight: 1.4,
                      boxShadow: m.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    {m.text}
                  </div>
                ))}
                {isCopilotTyping && (
                  <div style={{ alignSelf: 'flex-start', color: '#64748B', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    StatsGov AI is searching statistical repositories...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div style={{ padding: '12px', background: '#FFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCopilotQuery()}
                  placeholder="Ask about survey design, DPDP Act..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '20px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSendCopilotQuery}
                  style={{
                    background: '#1E3A8A',
                    color: '#FFF',
                    border: 'none',
                    padding: '0 16px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function DomainScoreBar({
  title,
  score,
  benchmark,
  icon,
}: {
  title: string;
  score: number;
  benchmark: number;
  icon: string;
}) {
  const gap = benchmark - score;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
        <span style={{ fontWeight: 600, color: '#334155' }}>
          {icon} {title}
        </span>
        <span style={{ fontWeight: 700, color: gap > 0 ? '#DC2626' : '#16A34A' }}>
          {score}% <span style={{ color: '#94A3B8', fontWeight: 400 }}>(Target: {benchmark}%)</span>
        </span>
      </div>
      <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: `${score}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)', borderRadius: '5px' }} />
      </div>
    </div>
  );
}
