import { NextRequest, NextResponse } from 'next/server';
import { generateRecipeSuggestions } from '@/lib/utils/gemini';

export async function POST(request: NextRequest) {
  try {
    const { ingredients, preferences } = await request.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients are required' },
        { status: 400 }
      );
    }

    const suggestions = await generateRecipeSuggestions(ingredients, preferences);

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
