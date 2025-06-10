import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Obtener progreso general del usuario
    const progress = await db.progress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            level: true,
            order: true
          }
        }
      },
      orderBy: {
        lesson: { order: 'asc' }
      }
    })

    // Obtener resultados de quizzes
    const quizResults = await db.quizResult.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                title: true,
                level: true
              }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    // Calcular estadísticas
    const totalLessons = await db.lesson.count({ where: { isPublished: true } })
    const completedLessons = progress.filter(p => p.completed).length
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0)
    const averageScore = quizResults.length > 0 
      ? quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length 
      : 0

    // Calcular racha actual
    const recentProgress = progress
      .filter(p => p.completed && p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Calcular racha basada en días consecutivos
    if (recentProgress.length > 0) {
      const today = new Date()
      let checkDate = new Date(today)
      
      for (const prog of recentProgress) {
        const progressDate = new Date(prog.completedAt!)
        const daysDiff = Math.floor((checkDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff <= 1) {
          currentStreak++
          tempStreak++
          checkDate = progressDate
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak
          }
          tempStreak = 0
          break
        }
      }
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
    }

    // Progreso por habilidades (basado en niveles de lecciones)
    const skillProgress = {
      alphabet: progress.filter(p => p.lesson.title.toLowerCase().includes('alfabeto')),
      vocabulary: progress.filter(p => p.lesson.title.toLowerCase().includes('vocabulario')),
      grammar: progress.filter(p => p.lesson.title.toLowerCase().includes('gramática') || p.lesson.title.toLowerCase().includes('sustantivo')),
      reading: progress.filter(p => p.lesson.title.toLowerCase().includes('lectura')),
      analysis: progress.filter(p => p.lesson.title.toLowerCase().includes('análisis'))
    }

    const response = {
      overallStats: {
        totalLessons,
        completedLessons,
        totalTime: totalTimeSpent,
        averageScore: Math.round(averageScore * 100) / 100,
        currentStreak,
        longestStreak
      },
      lessonsProgress: progress.map(p => ({
        lessonId: p.lessonId,
        lessonTitle: p.lesson.title,
        level: p.lesson.level,
        order: p.lesson.order,
        completed: p.completed,
        completedAt: p.completedAt,
        timeSpent: p.timeSpent
      })),
      quizResults: quizResults.map(r => ({
        quizId: r.quizId,
        quizTitle: r.quiz.title,
        lessonTitle: r.quiz.lesson.title,
        score: r.score,
        completedAt: r.completedAt
      })),
      skillProgress: {
        alphabet: {
          completed: skillProgress.alphabet.filter(p => p.completed).length,
          total: skillProgress.alphabet.length,
          level: skillProgress.alphabet.filter(p => p.completed).length > 0 ? 1 : 0
        },
        vocabulary: {
          completed: skillProgress.vocabulary.filter(p => p.completed).length,
          total: skillProgress.vocabulary.length,
          level: Math.floor(skillProgress.vocabulary.filter(p => p.completed).length / 2)
        },
        grammar: {
          completed: skillProgress.grammar.filter(p => p.completed).length,
          total: skillProgress.grammar.length,
          level: Math.floor(skillProgress.grammar.filter(p => p.completed).length / 3)
        },
        reading: {
          completed: skillProgress.reading.filter(p => p.completed).length,
          total: skillProgress.reading.length,
          level: Math.floor(skillProgress.reading.filter(p => p.completed).length / 3)
        },
        analysis: {
          completed: skillProgress.analysis.filter(p => p.completed).length,
          total: skillProgress.analysis.length,
          level: Math.floor(skillProgress.analysis.filter(p => p.completed).length / 4)
        }
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error obteniendo progreso:', error)
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

    const body = await request.json()
    const { lessonId, completed, timeSpent } = body
    const userId = session.user.id

    if (!lessonId) {
      return NextResponse.json(
        { error: 'ID de lección requerido' },
        { status: 400 }
      )
    }

    // Verificar que la lección existe
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lección no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar o crear progreso
    const progress = await db.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        completed: completed ?? undefined,
        completedAt: completed ? new Date() : undefined,
        timeSpent: timeSpent ?? undefined
      },
      create: {
        userId,
        lessonId,
        completed: completed ?? false,
        completedAt: completed ? new Date() : undefined,
        timeSpent: timeSpent ?? 0
      }
    })

    return NextResponse.json({
      message: 'Progreso actualizado exitosamente',
      progress
    })

  } catch (error) {
    console.error('Error actualizando progreso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
