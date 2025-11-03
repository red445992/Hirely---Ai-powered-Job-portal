// Test script for Django backend API
const testDjangoAPI = async () => {
  console.log("🚀 Testing Django Interview Generation API...\n");
  
  const DJANGO_URL = "http://localhost:8000";
  
  // Test health check
  console.log("1. Testing Django health check...");
  try {
    const healthResponse = await fetch(`${DJANGO_URL}/interviews/`, {
      method: "GET",
    });
    const healthData = await healthResponse.json();
    console.log("Health check response:", healthData);
    console.log("Status:", healthResponse.status);
  } catch (error) {
    console.error("Health check error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test interview generation (requires authentication)
  console.log("2. Testing interview generation...");
  
  // Note: In a real scenario, you'd need to authenticate first
  // For testing purposes, you might need to get a valid JWT token
  
  const testPayload = {
    type: "Technical",
    role: "Frontend Developer", 
    level: "Mid",
    techstack: ["React", "TypeScript", "Next.js"],
    amount: 5
  };

  console.log("Test Payload:", JSON.stringify(testPayload, null, 2));

  // This will fail without proper authentication
  try {
    const response = await fetch(`${DJANGO_URL}/interviews/generate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
      },
      body: JSON.stringify(testPayload),
    });

    console.log("Response Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("Generation test error:", error.message);
  }

  console.log("\n📝 Note: For full testing, you need to:");
  console.log("1. Start Django server: python manage.py runserver");
  console.log("2. Get a JWT token by logging in");
  console.log("3. Add the token to Authorization header");
};

// Run the test
testDjangoAPI();