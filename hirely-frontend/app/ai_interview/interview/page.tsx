"use client";

import React, { useEffect, useState } from 'react'
import Agent from '@/components/ai_interview/Agent'
import { useAuth } from '@/hooks/useAuth'

const Page = () => {
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading during SSR and initial client load
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show auth required after component is mounted and auth is checked
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to access the AI interview.</p>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Interview Generation</h3>
      <Agent 
        userName={user.first_name || user.firstName || user.username || 'you'}
        userId={user?.id?.toString() || user?.id || 'guest'} 
        type="generate"
      />
    </div>
  )
}

export default Page