import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const includeProgress = searchParams.get('includeProgress') === 'true'
    
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    let whereClause: any = { isPublished: true }

    if (level) {
      whereClause.level = level
    }

    const lessons = await db.lesson.findMany({
      where: whereClause,
      include: {
        ...(includeProgress && userId ? {
          progress: {
            where: { userId },
            select: {
              completed: true,
              completedAt: true,
              timeSpent: true
            }
          }
        } : {}),
        quizzes: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    // Procesar las lecciones para incluir información de progreso
    const processedLessons = lessons.map(lesson => {
      const progress = includeProgress && lesson.progress ? lesson.progress[0] : null
      
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        order: lesson.order,
        estimatedDuration: lesson.estimatedDuration,
        prerequisites: lesson.prerequisites,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt,
        quizCount: lesson.quizzes.length,
        ...(progress ? {
          progress: {
            completed: progress.completed,
            completedAt: progress.completedAt,
            timeSpent: progress.timeSpent
          }
        } : { progress: null })
      }
    })

    return NextResponse.json({
      lessons: processedLessons,
      total: processedLessons.length
    })

  } catch (error) {
    console.error('Error obteniendo lecciones:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Verificar que el usuario es profesor o admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear lecciones' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      content, 
      level, 
      estimatedDuration, 
      prerequisites = [],
      isPublished = false 
    } = body

    if (!title || !content || !level) {
      return NextResponse.json(
        { error: 'Título, contenido y nivel son requeridos' },
        { status: 400 }
      )
    }

    // Obtener el siguiente orden
    const lastLesson = await db.lesson.findFirst({
      where: { level },
      orderBy: { order: 'desc' }
    })
    
    const nextOrder = (lastLesson?.order ?? 0) + 1

    const lesson = await db.lesson.create({
      data: {
        title,
        description,
        content: JSON.stringify(content),
        level,
        order: nextOrder,
        estimatedDuration,
        prerequisites,
        isPublished
      }
    })

    return NextResponse.json({
      message: 'Lección creada exitosamente',
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        order: lesson.order,
        createdAt: lesson.createdAt
      }
    })

  } catch (error) {
    console.error('Error creando lección:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
