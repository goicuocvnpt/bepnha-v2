import { NextRequest, NextResponse } from 'next/server';
import { generateMealPlan } from '@/lib/utils/gemini';

export async function POST(request: NextRequest) {
  try {
    const { numberOfDays, peopleCount, preferences } = await request.json();

    if (!numberOfDays || !peopleCount) {
      return NextResponse.json(
        { error: 'numberOfDays and peopleCount are required' },
        { status: 400 }
      );
    }

    const mealPlan = await generateMealPlan(numberOfDays, peopleCount, preferences);

    return NextResponse.json({ mealPlan });
  } catch (error: any) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
}
