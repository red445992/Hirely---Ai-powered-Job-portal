"use client";

import React from 'react';
import { useSensAIUser } from '@/hooks/useSensAIUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SensAIUserExample() {
  const { 
    user, 
    profile, 
    isLoading, 
    error, 
    isAuthenticated, 
    fetchUserProfile, 
    updateProfile,
    fullName 
  } = useSensAIUser();

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        bio: "Updated bio from frontend",
        industry: "Technology",
        skills: ["React", "TypeScript", "Next.js"]
      });
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Please log in to view your SensAI profile.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Loading your profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={fetchUserProfile} className="mt-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Django User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Name:</strong> {fullName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>User Type:</strong> {user?.user_type}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SensAI Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-2">
              <p><strong>Profile ID:</strong> {profile.id}</p>
              <p><strong>Industry:</strong> {profile.industry || 'Not set'}</p>
              <p><strong>Bio:</strong> {profile.bio || 'Not set'}</p>
              <p><strong>Experience:</strong> {profile.experience ? `${profile.experience} years` : 'Not set'}</p>
              <p><strong>Skills:</strong> {profile.skills?.length > 0 ? profile.skills.join(', ') : 'None set'}</p>
              <p><strong>Created:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
              <Button onClick={handleUpdateProfile} className="mt-4">
                Update Profile
              </Button>
            </div>
          ) : (
            <p>No SensAI profile found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}