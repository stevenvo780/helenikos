import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { analysisEngine } from '@/lib/analysis-engine'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, mode = 'complete' } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Texto requerido' },
        { status: 400 }
      )
    }

    // Realizar el análisis
    const analysis = await analysisEngine.analyzeText(text, mode)

    // Crear o encontrar el texto griego
    let greekText = await db.greekText.findFirst({
      where: {
        content: text,
        isPublic: true
      }
    })

    if (!greekText) {
      greekText = await db.greekText.create({
        data: {
          title: `Análisis ${new Date().toLocaleDateString()}`,
          content: text,
          difficulty: analysis.statistics.vocabularyLevel,
          isPublic: false
        }
      })
    }

    // Guardar el análisis
    const savedAnalysis = await db.textAnalysis.create({
      data: {
        textId: greekText.id,
        userId: session.user.id,
        analysis: JSON.stringify(analysis),
        notes: `Análisis ${mode} realizado el ${new Date().toLocaleString()}`
      }
    })

    return NextResponse.json({
      analysisId: savedAnalysis.id,
      analysis: analysis
    })

  } catch (error) {
    console.error('Error en análisis de texto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Obtener análisis del usuario
    const analyses = await db.textAnalysis.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        text: {
          select: {
            title: true,
            content: true,
            author: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const total = await db.textAnalysis.count({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json({
      analyses: analyses.map(analysis => ({
        id: analysis.id,
        textTitle: analysis.text.title,
        textPreview: analysis.text.content.substring(0, 100) + '...',
        author: analysis.text.author,
        createdAt: analysis.createdAt,
        notes: analysis.notes
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error obteniendo análisis:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
