import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { getUserFromCookies, getOrCreateUserProfile } from '@/lib/auth-sync'
import getCurrentUser from '@/actions/getCurrentUser'

export async function GET(request: NextRequest) {
  try {
    // Use your existing getCurrentUser function which reads from cookies
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get or create user profile using the Django user ID
    const profile = await getOrCreateUserProfile(user.id, user.email)

    return NextResponse.json({
      success: true,
      profile,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        user_type: user.user_type
      }
    })

  } catch (error) {
    console.error('Error fetching SensAI profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Use your existing getCurrentUser function
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { industry, bio, experience, skills, preferences } = body

    // Update user profile
    const updatedProfile = await db.userProfile.update({
      where: { userId: user.id },
      data: {
        ...(industry !== undefined && { industry }),
        ...(bio !== undefined && { bio }),
        ...(experience !== undefined && { experience }),
        ...(skills !== undefined && { skills }),
        ...(preferences !== undefined && { preferences }),
      }
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Error updating SensAI profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use your existing getCurrentUser function
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { industry, bio, experience, skills, preferences } = body

    // Create or update user profile
    const profile = await db.userProfile.upsert({
      where: { userId: user.id },
      update: {
        industry,
        bio,
        experience,
        skills: skills || [],
        preferences: preferences || {}
      },
      create: {
        userId: user.id,
        userEmail: user.email,
        industry,
        bio,
        experience,
        skills: skills || [],
        preferences: preferences || {}
      }
    })

    return NextResponse.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error('Error creating/updating SensAI profile:', error)
    return NextResponse.json(
      { error: 'Failed to create/update profile' },
      { status: 500 }
    )
  }
}