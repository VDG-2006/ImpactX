"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface DepartmentMetric {
  department: string;
  officialCount: number;
  avgStatistical: number;
  avgTechnical: number;
  avgGovernance: number;
  avgManagerial: number;
  readinessIndex: number;
}

interface SkillGapHotspot {
  skillName: string;
  domain: string;
  affectedOfficialsCount: number;
  priorityLevel: 'High' | 'Medium' | 'Critical';
}

interface AdminAnalytics {
  totalOfficials: number;
  departmentSummary: DepartmentMetric[];
  skillGapHotspots: SkillGapHotspot[];
  predictiveCapacityInsights: {
    projectedSkillDeficitNextYear: string;
    recommendedCapacityTrainingHours: number;
    tpacHighPriorityCourses: string[];
    estimatedCapacityIncreasePercent: number;
  };
  overallReadinessScore: number;
  igotCourseEnrollments: number;
  tpacCompletions: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error('Failed to fetch admin analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '100vh', paddingTop: '100px', textAlign: 'center', color: '#64748B' }}>
          Loading organization workforce analytics...
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '84px', paddingBottom: '60px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ marginBottom: '28px' }}>
            <span
              style={{
                background: '#E0F2FE',
                color: '#0284C7',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '6px 16px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              MoSPI Executive Dashboard
            </span>
            <h1 style={{ fontSize: '2.25rem', color: '#0C4A6E', marginTop: '12px', marginBottom: '8px', fontWeight: 800 }}>
              🏛️ Organization-Wide Skill Intelligence & Capacity Analytics
            </h1>
            <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0 }}>
              Workforce competency distribution, training utilization, and AI predictive insights for future capacity building.
            </p>
          </div>

          {/* Top KPI Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <KpiCard title="Total Enrolled Officials" value={analytics?.totalOfficials || 142} icon="👥" color="#1E3A8A" />
            <KpiCard title="Overall Readiness Index" value={`${analytics?.overallReadinessScore || 76.4}%`} icon="🎯" color="#16A34A" />
            <KpiCard title="iGOT Course Enrollments" value={analytics?.igotCourseEnrollments || 312} icon="📚" color="#2563EB" />
            <KpiCard title="TPAC Core Completions" value={analytics?.tpacCompletions || 184} icon="🏆" color="#D97706" />
          </div>

          {/* Grid Layout: Department Matrix & Predictive Insights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', marginBottom: '32px' }}>
            
            {/* Left: Department Competency Matrix */}
            <div
              style={{
                background: '#FFF',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
              }}
            >
              <h2 style={{ fontSize: '1.3rem', color: '#0C4A6E', margin: '0 0 16px 0', fontWeight: 700 }}>
                📊 Competency Distribution by Department
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analytics?.departmentSummary.map((dept, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '18px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem' }}>{dept.department}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '10px' }}>({dept.officialCount} Officials)</span>
                      </div>
                      <span
                        style={{
                          background: dept.readinessIndex >= 80 ? '#DCFCE7' : '#FEF3C7',
                          color: dept.readinessIndex >= 80 ? '#15803D' : '#D97706',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          padding: '4px 12px',
                          borderRadius: '12px',
                        }}
                      >
                        {dept.readinessIndex}% Readiness
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '0.8rem' }}>
                      <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B' }}>Statistical</div>
                        <div style={{ fontWeight: 700, color: '#1E3A8A' }}>{dept.avgStatistical}%</div>
                      </div>
                      <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B' }}>Technical</div>
                        <div style={{ fontWeight: 700, color: '#2563EB' }}>{dept.avgTechnical}%</div>
                      </div>
                      <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B' }}>Governance</div>
                        <div style={{ fontWeight: 700, color: '#0284C7' }}>{dept.avgGovernance}%</div>
                      </div>
                      <div style={{ background: '#FFF', padding: '8px', borderRadius: '8px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B' }}>Managerial</div>
                        <div style={{ fontWeight: 700, color: '#4F46E5' }}>{dept.avgManagerial}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Predictive Capacity Analytics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  borderRadius: '20px',
                  padding: '28px',
                  color: '#FFF',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔮</span>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>AI Predictive Capacity Analytics</h2>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '16px' }}>
                  Forecasted skill deficits and capacity requirements for the upcoming year:
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Deficit Forecast</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F87171', marginTop: '4px' }}>
                    {analytics?.predictiveCapacityInsights.projectedSkillDeficitNextYear}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#CBD5E1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Training Allocation</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>
                    {analytics?.predictiveCapacityInsights.recommendedCapacityTrainingHours} Hours
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '8px' }}>High-Priority TPAC Programs:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {analytics?.predictiveCapacityInsights.tpacHighPriorityCourses.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skill Gap Hotspots Card */}
              <div
                style={{
                  background: '#FFF',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', color: '#0C4A6E', margin: '0 0 14px 0', fontWeight: 700 }}>
                  🚨 Organization Skill Gap Hotspots
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analytics?.skillGapHotspots.map((spot, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: '#FFF1F2',
                        borderRadius: '8px',
                        borderLeft: '4px solid #E11D48',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9F1239' }}>{spot.skillName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#881337' }}>{spot.domain}</div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#BE123C', background: '#FFE4E6', padding: '3px 8px', borderRadius: '10px' }}>
                        {spot.affectedOfficialsCount} Officials
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </>
  );
}

function KpiCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  return (
    <div
      style={{
        background: '#FFF',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}15`,
          color: color,
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{value}</div>
      </div>
    </div>
  );
}
