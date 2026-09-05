import { NextRequest, NextResponse } from 'next/server';
import { AIQuizGenerator } from '@/services/aiQuizGenerator';

export async function POST(req: NextRequest) {
  try {
    const { title, content, questionCount, targetDomain } = await req.json();

    if (!content || !title) {
      return NextResponse.json(
        { success: false, message: 'Title and document content are required' },
        { status: 400 }
      );
    }

    const quizResult = await AIQuizGenerator.generateQuizFromText(
      title,
      content,
      Number(questionCount || 5),
      targetDomain || 'Official Statistics'
    );

    return NextResponse.json({
      success: true,
      quiz: quizResult,
    });
  } catch (error: any) {
    console.error('Quiz Generation API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
