import { NextRequest, NextResponse } from "next/server";

// Django backend URL - update this to match your Django server
const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Valid choices based on Django model
const VALID_TYPES = ['Technical', 'Behavioral', 'Mixed'];
const VALID_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead'];

console.log('🔧 Django Backend URL:', DJANGO_BASE_URL);

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: "Interview Generation API is working!",
    backend: "Django",
    endpoint: `${DJANGO_BASE_URL}/interviews/generate/`,
    validChoices: {
      types: VALID_TYPES,
      levels: VALID_LEVELS
    },
    timestamp: new Date().toISOString()
  }, { status: 200 });
}

export async function POST(request: NextRequest) {
  console.log("🎯 Interview Generation API called at:", new Date().toISOString());
  
  try {
    // Parse request body
    const body = await request.json();
    console.log("📥 Request body:", body);
    
    const { type, role, level, techstack, amount } = body;

    // Validate required fields
    if (!type || !role || !level || !amount) {
      console.error("❌ Missing required fields");
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields: type, role, level, amount are required" 
      }, { status: 400 });
    }

    // Validate type
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({
        success: false,
        error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`
      }, { status: 400 });
    }

    // Validate level
    if (!VALID_LEVELS.includes(level)) {
      return NextResponse.json({
        success: false,
        error: `Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}`
      }, { status: 400 });
    }

    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error("❌ No authorization header");
      return NextResponse.json({
        success: false,
        error: "Authorization header is required"
      }, { status: 401 });
    }

    console.log("🔄 Calling Django backend to generate interview...");
    console.log("🌐 Django URL:", `${DJANGO_BASE_URL}/interviews/generate/`);
    
    // Prepare payload for Django
    const djangoPayload = {
      type,
      role,
      level,
      techstack: Array.isArray(techstack) ? techstack : (techstack ? [techstack] : []),
      amount: parseInt(amount.toString())
    };

    console.log("📤 Django payload:", djangoPayload);

    // Call Django backend
    const djangoResponse = await fetch(`${DJANGO_BASE_URL}/interviews/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(djangoPayload)
    });

    const djangoData = await djangoResponse.json();
    console.log("📨 Django response status:", djangoResponse.status);
    console.log("📨 Django response data:", djangoData);

    if (!djangoResponse.ok) {
      console.error("❌ Django returned error:", djangoData);
      return NextResponse.json({
        success: false,
        error: djangoData.error || "Failed to generate interview",
        details: djangoData.details || null
      }, { status: djangoResponse.status });
    }

    console.log("✅ Interview generated successfully");
    return NextResponse.json({
      success: true,
      data: djangoData.data,
      message: "Interview generated successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("💥 API Error:", error);
    
    // Check if it's a connection error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json({
        success: false,
        error: `Cannot connect to Django backend at ${DJANGO_BASE_URL}. Make sure Django server is running.`
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}