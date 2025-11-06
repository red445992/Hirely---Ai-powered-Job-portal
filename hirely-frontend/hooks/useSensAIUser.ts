"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/lib/prisma';

export interface SensAIUserProfile {
  id: string;
  userId: number;
  userEmail: string;
  industry: string | null;
  bio: string | null;
  experience: number | null;
  skills: string[];
  preferences: any;
  createdAt: Date;
  updatedAt: Date;
}

export function useSensAIUser() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<SensAIUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!user || !isAuthenticated) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sensai/profile', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.profile);
      } else {
        throw new Error(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching SensAI profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<SensAIUserProfile>) => {
    if (!user || !isAuthenticated) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sensai/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.profile);
        return data.profile;
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error updating SensAI profile:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile when user changes
  useEffect(() => {
    if (user && isAuthenticated && !authLoading) {
      fetchUserProfile();
    }
  }, [user, isAuthenticated, authLoading]);

  return {
    // User data
    user, // Django user data
    profile, // SensAI profile data
    isAuthenticated,
    
    // Loading states
    isLoading: authLoading || isLoading,
    
    // Error state
    error,
    
    // Actions
    fetchUserProfile,
    updateProfile,
    
    // Helper computed values
    fullName: user ? `${user.first_name} ${user.last_name}` : null,
    hasProfile: !!profile,
  };
}