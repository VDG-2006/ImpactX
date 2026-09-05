import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CompetencyProfilerAgent } from '@/services/competencyProfilerAgent';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const learnerId = userId || body.learnerId || 'guest_official_01';

    const result = await CompetencyProfilerAgent.processOfficialProfile({
      learnerId,
      name: body.name || 'Official User',
      role: body.role || 'learner_official',
      designation: body.designation || 'Statistical Officer',
      department: body.department || 'National Accounts Division',
      cadre: body.cadre || 'ISS',
      qualifications: body.qualifications || 'M.Sc Statistics',
      workExperienceYears: Number(body.workExperienceYears || 5),
      ratings: body.ratings || {},
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Official Profile API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
