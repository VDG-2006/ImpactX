import Link from 'next/link';
import SkillGraph from '@/components/SkillGraph';
import Navbar from '@/components/Navbar';
import { SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function LandingPage() {
  const authObj = await auth();
  const userId = authObj.userId;
  
  return (
    <>
      <Navbar />
      <main style={{ 
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at top right, #EFF6FF 0%, #F8FAFC 100%)'
      }}>
      {/* Ambient graph — background visualization */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.65 }}>
        <SkillGraph ambient={true} />
      </div>
      
      {/* Center-left positioned text content */}
      <div className="animate-fade-in-up" style={{ 
        position: 'absolute', 
        top: '44%',
        transform: 'translateY(-50%)',
        left: '80px', 
        maxWidth: '680px',
        zIndex: 10, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
            padding: '6px 18px',
            borderRadius: '20px',
            boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.3)'
          }}>
            <span style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Ministry of Statistics & Programme Implementation • iGOT Karmayogi
            </span>
          </div>

          <h1 style={{ color: '#0F172A', fontSize: '3.2rem', margin: 0, lineHeight: 1.15, fontWeight: 800 }}>
            AI Skill Intelligence & Capacity Building Platform
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: '#334155', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            Empowering India's Official Statistical System with automated 4-domain skill-gap profiling, personalized iGOT Karmayogi & NSSTA TPAC pathways, and AI document-to-quiz generation.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {!userId ? (
            <SignInButton mode="modal">
              <button className="pill pill-primary" style={{ padding: '16px 36px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.4)' }}>
                Start Official Competency Profiling →
              </button>
            </SignInButton>
          ) : (
            <>
              <Link href="/onboarding" className="pill pill-primary" style={{ padding: '16px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.4)', textDecoration: 'none' }}>
                Profile & Assess Competencies →
              </Link>
              <Link href="/dashboard" className="pill pill-outline" style={{ padding: '16px 32px', fontSize: '1.05rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', textDecoration: 'none', border: '1px solid #CBD5E1', color: '#1E3A8A', fontWeight: 700 }}>
                Go to Learner Hub
              </Link>
            </>
          )}
        </div>

        {/* Feature Badges */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', fontWeight: 600, color: '#1E3A8A', border: '1px solid #DBEAFE' }}>
            📊 Statistical & Survey Sampling
          </span>
          <span style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', fontWeight: 600, color: '#2563EB', border: '1px solid #DBEAFE' }}>
            💻 Python & Spatial GIS
          </span>
          <span style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', fontWeight: 600, color: '#0284C7', border: '1px solid #DBEAFE' }}>
            🔒 DPDP Act Data Privacy
          </span>
          <span style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', fontWeight: 600, color: '#4F46E5', border: '1px solid #DBEAFE' }}>
            ⚡ AI Quiz Generator
          </span>
        </div>
      </div>

      <footer style={{ position: 'absolute', bottom: '30px', right: '40px', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ padding: '6px 16px', fontSize: '0.85rem', background: 'rgba(239, 246, 255, 0.95)', borderRadius: '12px', color: '#1E3A8A', fontWeight: 700 }}>
            iGOT Karmayogi Interoperable
          </span>
          <span style={{ padding: '6px 16px', fontSize: '0.85rem', background: 'rgba(254, 243, 199, 0.95)', borderRadius: '12px', color: '#D97706', fontWeight: 700 }}>
            NSSTA TPAC Aligned
          </span>
        </div>
      </footer>
    </main>
    </>
  );
}
