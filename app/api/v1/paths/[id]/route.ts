import { NextRequest, NextResponse } from 'next/server';
import { pathsService } from '@/lib/api/services/paths.service';
import { updatePathSchema, getPathSchema } from '@/lib/api/validators/paths.validator';
import { handleApiError } from '@/lib/api/utils/route-handler';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validation = getPathSchema.safeParse({ params: { id } });
    
    if (!validation.success) {
       return NextResponse.json({ error: 'Validation Error', details: validation.error.issues }, { status: 400 });
    }

    const path = await pathsService.getPathById(id);
    return NextResponse.json(path);
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
    
    const validation = updatePathSchema.safeParse({ params: { id }, body });
    
    if (!validation.success) {
       return NextResponse.json({ error: 'Validation Error', details: validation.error.issues }, { status: 400 });
    }

    const path = await pathsService.updatePath(id, validation.data.body);
    return NextResponse.json(path);
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
    const validation = getPathSchema.safeParse({ params: { id } });
    
    if (!validation.success) {
       return NextResponse.json({ error: 'Validation Error', details: validation.error.issues }, { status: 400 });
    }

    await pathsService.deletePath(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
