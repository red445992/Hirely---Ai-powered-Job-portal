// Test script for the interview generation API
const testAPI = async () => {
  console.log("🚀 Testing Interview Generation API...\n");

  // Test GET endpoint first
  console.log("1. Testing GET endpoint...");
  try {
    const getResponse = await fetch("http://localhost:3000/api/vapi/generate", {
      method: "GET",
    });
    const getData = await getResponse.json();
    console.log("GET Response:", getData);
    console.log("GET Status:", getResponse.status);
  } catch (error) {
    console.error("GET Error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test POST endpoint
  console.log("2. Testing POST endpoint...");
  
  const testPayload = {
    type: "Technical",
    role: "Frontend Developer",
    level: "Mid-level",
    techstack: ["React", "TypeScript", "Next.js"],
    amount: 5,
    userid: "test-user-123"
  };

  console.log("Test Payload:", JSON.stringify(testPayload, null, 2));

  try {
    const postResponse = await fetch("http://localhost:3000/api/vapi/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPayload),
    });

    console.log("POST Status:", postResponse.status);
    
    const postData = await postResponse.json();
    console.log("POST Response:", JSON.stringify(postData, null, 2));

    if (postData.success) {
      console.log("\n✅ API Test Successful!");
      console.log("📝 Generated Questions:");
      postData.data.interview.questions.forEach((q, i) => {
        console.log(`   ${i + 1}. ${q}`);
      });
    } else {
      console.log("\n❌ API Test Failed:");
      console.log("Error:", postData.error);
    }

  } catch (error) {
    console.error("\n❌ API Test Error:", error.message);
  }
};

// Run the test
testAPI();