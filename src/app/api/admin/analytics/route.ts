import { NextResponse } from 'next/server';
import { AdminAnalyticsService } from '@/services/adminAnalyticsService';

export async function GET() {
  try {
    const analytics = await AdminAnalyticsService.getWorkforceAnalytics();
    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    console.error('Admin Analytics API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
