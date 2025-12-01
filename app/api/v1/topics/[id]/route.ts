import { NextRequest, NextResponse } from 'next/server';
import { topicsService } from '@/lib/api/services/topics.service';
import { updateTopicSchema, getTopicSchema } from '@/lib/api/validators/topics.validator';
import { handleApiError } from '@/lib/api/utils/route-handler';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validation = getTopicSchema.safeParse({ params: { id } });
    
    if (!validation.success) {
       return NextResponse.json({ error: 'Validation Error', details: validation.error.issues }, { status: 400 });
    }

    const topic = await topicsService.getTopicById(id);
    return NextResponse.json(topic);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const validation = updateTopicSchema.safeParse({ params: { id }, body });
    
    if (!validation.success) {
       return NextResponse.json({ error: 'Validation Error', details: validation.error.issues }, { status: 400 });
    }

    const topic = await topicsService.updateTopic(id, validation.data.body);
    return NextResponse.json(topic);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validation = getTopicSchema.safeParse({ params: { id } });
    
    if (!validation.success) {
       return NextResponse.json({ error: 'Validation Error', details: validation.error.issues }, { status: 400 });
    }

    await topicsService.deleteTopic(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
