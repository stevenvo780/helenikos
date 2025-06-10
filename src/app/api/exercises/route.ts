import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')
    const level = searchParams.get('level')
    const category = searchParams.get('category')

    let whereClause: any = {}

    if (lessonId) {
      whereClause.lessonId = lessonId
    }

    // Obtener quizzes de la base de datos
    const quizzes = await db.quiz.findMany({
      where: whereClause,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            level: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Si no hay quizzes en la base de datos, retornar datos de ejemplo
    if (quizzes.length === 0) {
      const exampleExercises = getExampleExercises(level, category)
      return NextResponse.json({
        exercises: exampleExercises,
        total: exampleExercises.length,
        source: 'example'
      })
    }

    // Convertir quizzes a formato de ejercicios
    const exercises = quizzes.map(quiz => {
      const questions = JSON.parse(quiz.questions)
      return {
        id: quiz.id,
        title: quiz.title,
        description: `Ejercicios de ${quiz.lesson.title}`,
        category: getCategoryFromLevel(quiz.lesson.level),
        level: quiz.lesson.level,
        estimatedTime: questions.length * 2, // 2 minutos por pregunta
        exercises: questions
      }
    })

    return NextResponse.json({
      exercises,
      total: exercises.length,
      source: 'database'
    })

  } catch (error) {
    console.error('Error obteniendo ejercicios:', error)
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
    const { quizId, answers, score, timeSpent } = body
    const userId = session.user.id

    if (!quizId || !answers) {
      return NextResponse.json(
        { error: 'Quiz ID y respuestas son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el quiz existe
    const quiz = await db.quiz.findUnique({
      where: { id: quizId }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz no encontrado' },
        { status: 404 }
      )
    }

    // Guardar resultado del quiz
    const result = await db.quizResult.create({
      data: {
        userId,
        quizId,
        score: score ?? 0,
        answers: JSON.stringify(answers),
        completedAt: new Date()
      }
    })

    // Actualizar progreso de la lección si el score es suficiente
    if (score >= 70) { // 70% mínimo para considerar completada
      await db.progress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId: quiz.lessonId
          }
        },
        update: {
          completed: true,
          completedAt: new Date(),
          timeSpent: {
            increment: timeSpent ?? 0
          }
        },
        create: {
          userId,
          lessonId: quiz.lessonId,
          completed: true,
          completedAt: new Date(),
          timeSpent: timeSpent ?? 0
        }
      })
    }

    return NextResponse.json({
      message: 'Resultado guardado exitosamente',
      result: {
        id: result.id,
        score: result.score,
        completedAt: result.completedAt
      }
    })

  } catch (error) {
    console.error('Error guardando resultado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getCategoryFromLevel(level: string): string {
  switch (level) {
    case 'BEGINNER': return 'Básico'
    case 'INTERMEDIATE': return 'Intermedio'
    case 'ADVANCED': return 'Avanzado'
    default: return 'General'
  }
}

function getExampleExercises(level?: string | null, category?: string | null) {
  const exercises = [
    {
      id: 'alphabet-practice',
      title: 'Práctica del Alfabeto',
      description: 'Ejercicios para dominar las letras griegas',
      category: 'Alfabeto',
      estimatedTime: 15,
      level: 'BEGINNER',
      exercises: [
        {
          id: 'alpha-1',
          type: 'multiple-choice',
          question: '¿Cómo se pronuncia la letra Α?',
          options: ['[a]', '[e]', '[i]', '[o]'],
          correctAnswer: '[a]',
          hint: 'Es igual que la "a" en español',
          explanation: 'La alfa (Α) se pronuncia como "a" en español.',
          difficulty: 'easy'
        },
        {
          id: 'beta-1',
          type: 'multiple-choice',
          question: '¿Cuál es la forma minúscula de Β?',
          options: ['α', 'β', 'γ', 'δ'],
          correctAnswer: 'β',
          hint: 'Se parece a una "B" pero con curvas',
          explanation: 'La beta minúscula es β.',
          difficulty: 'easy'
        }
      ]
    },
    {
      id: 'vocabulary-basic',
      title: 'Vocabulario Básico',
      description: 'Palabras fundamentales del griego antiguo',
      category: 'Vocabulario',
      estimatedTime: 25,
      level: 'BEGINNER',
      exercises: [
        {
          id: 'vocab-1',
          type: 'translation',
          question: 'Traduce: λόγος',
          correctAnswer: 'palabra',
          hint: 'Es la raíz de "lógica"',
          explanation: 'λόγος significa palabra, razón o discurso.',
          difficulty: 'easy'
        },
        {
          id: 'vocab-2',
          type: 'multiple-choice',
          question: '¿Qué significa σοφία?',
          options: ['amor', 'sabiduría', 'guerra', 'casa'],
          correctAnswer: 'sabiduría',
          hint: 'Raíz de "filosofía"',
          explanation: 'σοφία significa sabiduría.',
          difficulty: 'easy'
        }
      ]
    },
    {
      id: 'morphology-intro',
      title: 'Introducción a la Morfología',
      description: 'Casos y declinaciones básicas',
      category: 'Gramática',
      estimatedTime: 35,
      level: 'INTERMEDIATE',
      exercises: [
        {
          id: 'morph-1',
          type: 'multiple-choice',
          question: '¿En qué caso está λόγου?',
          options: ['nominativo', 'genitivo', 'dativo', 'acusativo'],
          correctAnswer: 'genitivo',
          hint: 'Indica posesión o pertenencia',
          explanation: 'λόγου es genitivo singular de λόγος.',
          difficulty: 'medium'
        }
      ]
    }
  ]

  // Filtrar por nivel y categoría si se especifican
  return exercises.filter(exercise => {
    if (level && exercise.level !== level) return false
    if (category && exercise.category !== category) return false
    return true
  })
}
