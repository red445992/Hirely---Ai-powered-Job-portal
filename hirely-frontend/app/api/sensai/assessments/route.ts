import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { getUserFromToken, getOrCreateUserProfile } from '@/lib/auth-sync'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No valid authorization token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const user = getUserFromToken(token)
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Ensure user has a SensAI profile
    await getOrCreateUserProfile(user.id, user.email)

    // Get user's assessments using userId
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      assessments,
      user: {
        id: user.id,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No valid authorization token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const user = getUserFromToken(token)
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { quizScore, questions, category, improvementTip } = body

    // Ensure user has a SensAI profile
    await getOrCreateUserProfile(user.id, user.email)

    // Create new assessment with userId
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        quizScore,
        questions,
        category,
        improvementTip
      }
    })

    return NextResponse.json({
      success: true,
      assessment
    })

  } catch (error) {
    console.error('Error creating assessment:', error)
    return NextResponse.json(
      { error: 'Failed to create assessment' },
      { status: 500 }
    )
  }
}