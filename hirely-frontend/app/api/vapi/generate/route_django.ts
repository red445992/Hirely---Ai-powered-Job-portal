import { NextRequest, NextResponse } from "next/server";

// Django backend URL - update this to match your Django server
const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || "http://localhost:8000";

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "Interview Generation API is working!",
    backend: "Django",
    timestamp: new Date().toISOString()
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  console.log("API called at:", new Date().toISOString());
  
  try {
    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);
    
    const { type, role, level, techstack, amount } = body;

    // Validate required fields
    if (!type || !role || !level || !amount) {
      console.error("Missing required fields");
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields: type, role, level, amount are required" 
      }, { status: 400 });
    }

    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: "Authorization header is required"
      }, { status: 401 });
    }

    console.log("Calling Django backend to generate interview...");
    
    // Call Django backend
    const djangoResponse = await fetch(`${DJANGO_BASE_URL}/interviews/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        type,
        role,
        level,
        techstack,
        amount: parseInt(amount)
      })
    });

    const djangoData = await djangoResponse.json();
    console.log("Django response:", djangoData);

    if (!djangoResponse.ok) {
      return NextResponse.json({
        success: false,
        error: djangoData.error || "Failed to generate interview",
        details: djangoData.details || null
      }, { status: djangoResponse.status });
    }

    return NextResponse.json({
      success: true,
      data: djangoData.data,
      message: "Interview generated successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}