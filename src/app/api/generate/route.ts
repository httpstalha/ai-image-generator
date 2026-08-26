import { NextRequest, NextResponse } from 'next/server';
import { generateImageUrl, generateQwenImage } from '@/lib/ai-generator';
import { sanitizeInput, checkRateLimit } from '@/lib/security';
import { ImageStyle } from '@/types';

// Valid 4 styles strictly enforced (Requirement 2)
const VALID_STYLES: ImageStyle[] = ['Anime', 'Realistic', 'Cinematic', 'Digital Art'];

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 20, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
    }

    const body = await req.json();
    const rawPrompt = body?.prompt;
    const style = body?.style;
    const numImages = body?.numImages || 1;
    const userId = body?.userId || 'usr_cerulia_001';

    if (!rawPrompt || typeof rawPrompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const prompt = sanitizeInput(rawPrompt);

    if (!style || !VALID_STYLES.includes(style as ImageStyle)) {
      return NextResponse.json({
        error: `Invalid style. Allowed styles: ${VALID_STYLES.join(', ')}`
      }, { status: 400 });
    }

    const count = Math.min(Math.max(Number(numImages) || 1, 1), 4);
    const apiKey = process.env.AI_GENERATOR_API_KEY || 'sk-ws-H.DMYIHLX.flPL.MEUCIQDLakNtUNdisU0ZRSqPfAktswkRINLI8Jedq5G60P3JcQIgR65nwnulnSx9qDBTv66n3_aEHzAtC87E4RilEAOSvyg';
    const generatedImages = [];

    for (let i = 0; i < count; i++) {
      const seed = Math.floor(Math.random() * 1000000);
      const res = await generateQwenImage(prompt, style as ImageStyle, seed, apiKey);
      
      generatedImages.push({
        id: `img_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        userId,
        prompt,
        style: style as ImageStyle,
        imageUrl: res.url,
        provider: res.provider,
        createdAt: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      data: generatedImages,
      generation: {
        id: `gen_${Date.now()}`,
        userId,
        prompt,
        style,
        numImages: count,
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
  }
}
