"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(30, 58, 138, 0.1)',
      zIndex: 50,
      padding: '12px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
    }}>
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)', 
          color: 'white',
          width: 34, height: 34, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: 18,
          boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
        }}>I</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E3A8A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ImpactX <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '2px 8px', borderRadius: '6px', marginLeft: '6px' }}>iGOT MoSPI</span>
          </span>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500 }}>Skill Intelligence & Capacity Building Platform</span>
        </div>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/dashboard" className="pill pill-ghost" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1E3A8A', textDecoration: 'none' }}>
          Learner Hub
        </Link>
        <Link href="/quiz/generator" className="pill pill-ghost" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4F46E5', textDecoration: 'none' }}>
          Quiz Studio
        </Link>
        <Link href="/admin" className="pill pill-ghost" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0284C7', textDecoration: 'none' }}>
          Admin Analytics
        </Link>

        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="pill pill-primary" style={{ padding: '8px 20px', fontSize: '0.9rem', cursor: 'pointer' }}>Sign In</button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center' }}>
            <UserButton appearance={{ elements: { avatarBox: { width: 38, height: 38 } } }} />
          </div>
        </Show>
      </div>
    </header>
  );
}
