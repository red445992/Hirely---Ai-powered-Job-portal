import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const data = await pdf(buffer);
    
    if (!data.text || data.text.trim() === '') {
      return NextResponse.json(
        { error: 'No text could be extracted from the PDF. The PDF might be image-based or empty.' },
        { status: 422 }
      );
    }
    
    return NextResponse.json({ 
      text: data.text,
      pages: data.numpages 
    });
  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to extract text from PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}