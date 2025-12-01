import { NextRequest, NextResponse } from 'next/server';
import { pathsService } from '@/lib/api/services/paths.service';
import { createPathSchema } from '@/lib/api/validators/paths.validator';
import { handleApiError } from '@/lib/api/utils/route-handler';

export async function GET() {
  try {
    const paths = await pathsService.getAllPaths();
    return NextResponse.json(paths);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createPathSchema.safeParse({ body });
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation Error', details: validation.error.issues }, { status: 400 });
    }
    
    const path = await pathsService.createPath(validation.data.body);
    return NextResponse.json(path, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
