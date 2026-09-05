"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const STATISTICAL_TOPICS = [
  'National Accounts & GDP Compilation',
  'Survey Design & Sampling Methods',
  'Price Statistics (CPI / WPI)',
  'Labour & Employment Statistics (PLFS)',
  'Data Quality Frameworks & Metadata Standards',
];

const TECHNICAL_TOPICS = [
  'Python for Data Processing',
  'GIS & Spatial Analytics (QGIS/GeoPandas)',
  'Statistical Software (R / Stata / SPSS / SAS)',
  'AI & Machine Learning for Forecasting',
  'SQL Database Querying & Open Data',
];

const GOVERNANCE_TOPICS = [
  'Digital Personal Data Protection (DPDP Act)',
  'Government Cloud (MeghRaj) & Secure APIs',
  'Cybersecurity & Digital Signatures',
];

const MANAGERIAL_TOPICS = [
  'Statistical Project Management',
  'Evidence-Based Public Policy Communication',
  'Data Ethics & Decision Making',
];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [designation, setDesignation] = useState('Deputy Director');
  const [department, setDepartment] = useState('National Accounts Division (NAD)');
  const [cadre, setCadre] = useState('Indian Statistical Service (ISS)');
  const [qualifications, setQualifications] = useState('M.Sc Statistics');
  const [workExperienceYears, setWorkExperienceYears] = useState(6);

  const [ratings, setRatings] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = (topic: string, rating: string) => {
    setRatings((prev) => ({ ...prev, [topic]: rating }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setStep(3);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/official/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designation,
          department,
          cadre,
          qualifications,
          workExperienceYears,
          ratings,
        }),
      });

      if (res.ok) {
        setTimeout(() => router.push('/dashboard'), 1200);
      } else {
        setStep(2);
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error('Onboarding submission error:', e);
      setStep(2);
      setIsSubmitting(false);
    }
  };

  const allTopics = [
    ...STATISTICAL_TOPICS,
    ...TECHNICAL_TOPICS,
    ...GOVERNANCE_TOPICS,
    ...MANAGERIAL_TOPICS,
  ];

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: 'calc(100vh - 64px)',
          paddingTop: '80px',
          paddingBottom: '40px',
          background: 'radial-gradient(circle at top right, #EFF6FF 0%, #F8FAFC 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '840px', width: '100%', padding: '0 24px' }}>
          {step === 1 && (
            <div
              className="glass-card animate-fade-in-up"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(30, 58, 138, 0.1)',
                boxShadow: '0 20px 40px -15px rgba(30, 58, 138, 0.08)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span
                  style={{
                    background: '#EFF6FF',
                    color: '#1E3A8A',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Step 1 of 2: Official Profile Setup
                </span>
                <h1 style={{ fontSize: '2.25rem', color: '#1E3A8A', marginTop: '16px', marginBottom: '8px' }}>
                  Welcome to Official Statistics Skill Intelligence
                </h1>
                <p style={{ color: '#475569', fontSize: '1.05rem' }}>
                  Please enter your official details to establish baseline competency frameworks.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                      Designation / Job Role
                    </label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #CBD5E1',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                      Service / Cadre
                    </label>
                    <select
                      value={cadre}
                      onChange={(e) => setCadre(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #CBD5E1',
                        fontSize: '1rem',
                        background: '#FFF',
                      }}
                    >
                      <option value="Indian Statistical Service (ISS)">Indian Statistical Service (ISS)</option>
                      <option value="Subordinate Statistical Service (SSS)">Subordinate Statistical Service (SSS)</option>
                      <option value="State Statistical Bureau (SSB)">State Statistical Bureau (SSB)</option>
                      <option value="General Central Service / Other">General Central Service / Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                      Department / Division
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #CBD5E1',
                        fontSize: '1rem',
                        background: '#FFF',
                      }}
                    >
                      <option value="National Accounts Division (NAD)">National Accounts Division (NAD)</option>
                      <option value="Survey Design & Research Division (SDRD)">Survey Design & Research Division (SDRD)</option>
                      <option value="Field Operations Division (FOD)">Field Operations Division (FOD)</option>
                      <option value="Price Statistics Division (PSD)">Price Statistics Division (PSD)</option>
                      <option value="Economic Statistics Division (ESD)">Economic Statistics Division (ESD)</option>
                      <option value="State Directorate of Economics & Statistics">State Directorate of Economics & Statistics</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                      Work Experience (Years)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={workExperienceYears}
                      onChange={(e) => setWorkExperienceYears(Number(e.target.value))}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid #CBD5E1',
                        fontSize: '1rem',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Highest Educational Qualification
                  </label>
                  <input
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="pill pill-primary"
                  style={{
                    padding: '14px 28px',
                    fontSize: '1.05rem',
                    marginTop: '12px',
                    alignSelf: 'flex-end',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  Proceed to Competency Self-Assessment →
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div
              className="glass-card animate-fade-in-up"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '40px',
                border: '1px solid rgba(30, 58, 138, 0.1)',
                boxShadow: '0 20px 40px -15px rgba(30, 58, 138, 0.08)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span
                  style={{
                    background: '#EFF6FF',
                    color: '#1E3A8A',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Step 2 of 2: 4-Domain Competency Assessment
                </span>
                <h2 style={{ fontSize: '2rem', color: '#1E3A8A', marginTop: '16px', marginBottom: '8px' }}>
                  Evaluate Existing Skill Levels
                </h2>
                <p style={{ color: '#475569', fontSize: '1rem' }}>
                  Rate your current proficiency across Statistical, Technical, Digital Governance, and Managerial competencies.
                </p>
              </div>

              {/* Statistical Domain */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', borderBottom: '2px solid #DBEAFE', paddingBottom: '8px', marginBottom: '16px' }}>
                  📊 Statistical Competencies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {STATISTICAL_TOPICS.map((topic) => (
                    <CompetencyRatingRow key={topic} topic={topic} rating={ratings[topic]} onSelect={handleRating} />
                  ))}
                </div>
              </div>

              {/* Technical Domain */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', borderBottom: '2px solid #DBEAFE', paddingBottom: '8px', marginBottom: '16px' }}>
                  💻 Technical Competencies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {TECHNICAL_TOPICS.map((topic) => (
                    <CompetencyRatingRow key={topic} topic={topic} rating={ratings[topic]} onSelect={handleRating} />
                  ))}
                </div>
              </div>

              {/* Digital Governance */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', borderBottom: '2px solid #DBEAFE', paddingBottom: '8px', marginBottom: '16px' }}>
                  🔒 Digital Governance Competencies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {GOVERNANCE_TOPICS.map((topic) => (
                    <CompetencyRatingRow key={topic} topic={topic} rating={ratings[topic]} onSelect={handleRating} />
                  ))}
                </div>
              </div>

              {/* Managerial Competencies */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#1E3A8A', borderBottom: '2px solid #DBEAFE', paddingBottom: '8px', marginBottom: '16px' }}>
                  💼 Behavioural & Managerial Competencies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {MANAGERIAL_TOPICS.map((topic) => (
                    <CompetencyRatingRow key={topic} topic={topic} rating={ratings[topic]} onSelect={handleRating} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="pill pill-ghost"
                  style={{ padding: '12px 24px' }}
                >
                  ← Back to Profile
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="pill pill-primary"
                  style={{
                    padding: '14px 32px',
                    fontSize: '1.05rem',
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  {isSubmitting ? 'Analyzing Skill Gaps...' : 'Generate Skill Gap Profile & iGOT Pathways →'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div
              className="glass-card animate-fade-in-up"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '60px 40px',
                textAlign: 'center',
                boxShadow: '0 20px 40px -15px rgba(30, 58, 138, 0.08)',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <span className="status-badge test-out animate-pulse-glow" style={{ fontSize: '1.1rem', padding: '12px 24px' }}>
                  ⚡ AI Engine Analyzing Competency Frameworks...
                </span>
              </div>
              <h2 style={{ fontSize: '2.25rem', color: '#1E3A8A' }}>Mapping iGOT Karmayogi Pathways</h2>
              <p style={{ marginTop: '12px', color: '#475569', fontSize: '1.1rem' }}>
                Evaluating your profile against MoSPI standards & NSSTA TPAC recommended programs.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function CompetencyRatingRow({
  topic,
  rating,
  onSelect,
}: {
  topic: string;
  rating?: string;
  onSelect: (t: string, r: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        background: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
      }}
    >
      <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>{topic}</span>
      <div style={{ display: 'flex', gap: '8px' }}>
        {['Newbie', 'Familiar', 'Expert'].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => onSelect(topic, lvl)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: rating === lvl ? 'none' : '1px solid #CBD5E1',
              background: rating === lvl ? '#1E3A8A' : '#FFF',
              color: rating === lvl ? '#FFF' : '#475569',
              transition: 'all 0.2s ease',
            }}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
}
