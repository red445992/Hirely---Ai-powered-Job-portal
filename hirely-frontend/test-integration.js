// Test script to verify Django-Next.js integration
// Run this in browser console or as a separate test

async function testInterviewGeneration() {
  const testPayload = {
    type: "technical",
    role: "Frontend Developer", 
    level: "intermediate",
    techstack: ["React", "TypeScript"],
    amount: 3
  };

  try {
    console.log("Testing API Gateway...");
    
    const response = await fetch('http://localhost:3000/api/vapi/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();
    
    console.log("Response Status:", response.status);
    console.log("Response Data:", result);
    
    if (result.success) {
      console.log("✅ Integration working! Interview generated:", result.data);
    } else {
      console.log("❌ Error:", result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error("❌ Network Error:", error);
    return { success: false, error: error.message };
  }
}

// Also test GET endpoint
async function testAPIInfo() {
  try {
    const response = await fetch('http://localhost:3000/api/vapi/generate');
    const result = await response.json();
    console.log("API Info:", result);
    return result;
  } catch (error) {
    console.error("API Info Error:", error);
  }
}

// Run tests
console.log("🚀 Testing Interview Generation API...");
testAPIInfo().then(() => testInterviewGeneration());