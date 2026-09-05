import { NextRequest, NextResponse } from 'next/server';
import { IGotRecommendationEngine } from '@/services/igotRecommendationEngine';
import { db } from '@/db';
import { learner } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const targetUserId = userId || 'guest_official_01';

    const [user] = await db.select().from(learner).where(eq(learner.id, targetUserId));

    const skillGaps = (user?.identifiedSkillGaps as string[]) || [
      'National Accounts Statistics',
      'GIS & Spatial Analytics',
      'Data Privacy (DPDP Act)',
    ];

    const domainScores = user?.domainScores || {
      statistical: 70,
      technical: 65,
      governance: 60,
      managerial: 75,
    };

    const department = user?.department || 'National Accounts Division';

    const recommendations = IGotRecommendationEngine.recommendPathways(skillGaps, domainScores, department);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error: any) {
    console.error('iGOT Recommendations API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
