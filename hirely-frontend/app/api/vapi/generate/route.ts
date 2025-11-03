// Next.js API Route - Proxy to Django Backend for Interview Generation
// This acts as an API Gateway between frontend and Django backend

const DJANGO_BASE_URL = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000';

export async function GET() {
  return Response.json({ 
    success: true, 
    message: "Interview Generation API Gateway",
    backend: `Django Backend at ${DJANGO_BASE_URL}`,
    endpoints: {
      generate: "POST /api/vapi/generate",
      django_direct: `${DJANGO_BASE_URL}/interviews/generate/`
    }
  }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, role, level, techstack, amount, _userid } = body;

    // Validate required fields
    if (!type || !role || !level || !amount) {
      return Response.json({ 
        success: false, 
        error: "Missing required fields: type, role, level, amount are required" 
      }, { status: 400 });
    }

    // Get authorization header for Django
    const authHeader = request.headers.get('authorization');
    
    // Prepare Django-compatible payload
    const djangoPayload = {
      role,
      type,
      level,
      techstack: Array.isArray(techstack) ? techstack : (techstack ? [techstack] : []),
      amount: parseInt(amount.toString()) || 5
    };

    // Forward to Django backend
    const djangoResponse = await fetch(`${DJANGO_BASE_URL}/interviews/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      body: JSON.stringify(djangoPayload)
    });

    const djangoData = await djangoResponse.json();

    if (!djangoResponse.ok) {
      return Response.json({
        success: false,
        error: djangoData.error || 'Backend error',
        details: djangoData.details || null
      }, { status: djangoResponse.status });
    }

    // Return Django response with consistent format
    return Response.json(djangoData, { status: 200 });

  } catch (error) {
    console.error("API Gateway Error:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return Response.json({
        success: false,
        error: `Cannot connect to Django backend at ${DJANGO_BASE_URL}. Make sure Django server is running.`
      }, { status: 503 });
    }
    
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Gateway error" 
    }, { status: 500 });
  }
}