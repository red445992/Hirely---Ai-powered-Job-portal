"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      // Test 1: Check localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      const userString = localStorage.getItem('user');
      
      console.log('🔍 Auth Debug Info:');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('User Data:', userString ? 'Present' : 'Missing');
      
      if (userString) {
        const user = JSON.parse(userString);
        console.log('Parsed User:', user);
      }

      // Test 2: Test API call
      const response = await fetch('/api/sensai/profile', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('API Response:', data);

      setDebugInfo({
        localStorage: {
          token: token ? 'Present' : 'Missing',
          user: userString ? JSON.parse(userString) : 'Missing'
        },
        apiResponse: {
          status: response.status,
          data: data
        }
      });

    } catch (error) {
      console.error('Debug test failed:', error);
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔧 Authentication Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testAuth} disabled={loading} className="mb-4">
          {loading ? 'Testing...' : 'Test Authentication'}
        </Button>

        {debugInfo && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Debug Results:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}