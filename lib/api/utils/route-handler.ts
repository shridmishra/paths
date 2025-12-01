import { NextResponse } from 'next/server';
import { AppError } from './errors.util';
import { ZodError } from 'zod';

export function handleApiError(error: unknown) {
  console.error(error);
  
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation Error', details: error.issues },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}
