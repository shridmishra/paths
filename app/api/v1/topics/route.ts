import { NextRequest, NextResponse } from 'next/server';
import { topicsService } from '@/lib/api/services/topics.service';
import { createTopicSchema } from '@/lib/api/validators/topics.validator';
import { handleApiError } from '@/lib/api/utils/route-handler';

export async function GET() {
  try {
    const topics = await topicsService.getAllTopics();
    return NextResponse.json(topics);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createTopicSchema.safeParse({ body });
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation Error', details: validation.error.issues }, { status: 400 });
    }
    
    const topic = await topicsService.createTopic(validation.data.body);
    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
