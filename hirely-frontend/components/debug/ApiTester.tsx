// components/debug/ApiTester.tsx
"use client";

import { useState } from 'react';

export default function ApiTester() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setResult('Testing backend connection...');
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log("🧪 Testing API connection to:", API_BASE);
      
      // Test basic connection to backend
      const response = await fetch(`${API_BASE}/jobs/addjobs/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("📨 Test response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend connection successful:", data);
        setResult(`✅ Backend connected! Status: ${response.status}\nReceived ${Array.isArray(data.results) ? data.results.length : 'unknown'} jobs`);
      } else {
        console.error("❌ Backend connection failed:", response.status);
        setResult(`❌ Backend connection failed: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testApplicationsEndpoint = async () => {
    setLoading(true);
    setResult('Testing applications endpoint...');
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log("🧪 Testing applications endpoint:", `${API_BASE}/applications/`);
      
      const response = await fetch(`${API_BASE}/applications/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("📨 Applications endpoint response:", response.status);
      
      if (response.status === 401) {
        setResult(`✅ Applications endpoint exists but requires authentication (401) - this is expected!`);
      } else if (response.ok) {
        const data = await response.json();
        setResult(`✅ Applications endpoint accessible! Status: ${response.status}`);
      } else {
        setResult(`⚠️ Applications endpoint status: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">🧪 API Debug Tools</h3>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={testBackendConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Backend Connection
        </button>
        
        <button
          onClick={testApplicationsEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Applications Endpoint
        </button>
      </div>
      
      {result && (
        <div className="bg-gray-100 p-3 rounded font-mono text-sm whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}