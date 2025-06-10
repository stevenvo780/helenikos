'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Check, 
  X, 
  RotateCcw,
  Lightbulb,
  Target,
  Trophy,
  Clock,
  BookOpen
} from 'lucide-react'

interface Exercise {
  id: string
  type: 'translation' | 'multiple-choice' | 'fill-blank' | 'matching'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  userAnswer?: string | string[]
  hint?: string
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface ExerciseSet {
  id: string
  title: string
  description: string
  category: string
  exercises: Exercise[]
  estimatedTime: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}

export default function PracticePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedSet, setSelectedSet] = useState<ExerciseSet | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({})
  const [showResults, setShowResults] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeStarted, setTimeStarted] = useState<number | null>(null)

  const exerciseSets: ExerciseSet[] = [
    {
      id: 'alphabet-review',
      title: 'Repaso del Alfabeto',
      description: 'Practica el reconocimiento y pronunciación del alfabeto griego',
      category: 'Alfabeto',
      estimatedTime: 10,
      level: 'BEGINNER',
      exercises: [
        {
          id: 'alpha-1',
          type: 'multiple-choice',
          question: '¿Cuál es la pronunciación correcta de la letra Α (α)?',
          options: ['/a/', '/e/', '/i/', '/o/'],
          correctAnswer: '/a/',
          hint: 'Es similar a la vocal "a" en español',
          explanation: 'Alpha se pronuncia como la "a" abierta en español.',
          difficulty: 'easy'
        },
        {
          id: 'beta-1',
          type: 'multiple-choice',
          question: '¿Qué letra griega corresponde al sonido /b/?',
          options: ['Π (π)', 'Β (β)', 'Φ (φ)', 'Ψ (ψ)'],
          correctAnswer: 'Β (β)',
          hint: 'Esta letra dio origen a nuestra letra "B"',
          explanation: 'Beta (Β/β) representa el sonido /b/ en griego antiguo.',
          difficulty: 'easy'
        },
        {
          id: 'gamma-1',
          type: 'fill-blank',
          question: 'Complete: La letra Γ se llama _____ y se pronuncia /_____/',
          correctAnswer: ['gamma', 'g'],
          hint: 'Piensa en la palabra "gramática"',
          explanation: 'Gamma es la tercera letra del alfabeto griego.',
          difficulty: 'medium'
        }
      ]
    },
    {
      id: 'basic-vocabulary',
      title: 'Vocabulario Básico',
      description: 'Aprende las palabras más importantes del griego antiguo',
      category: 'Vocabulario',
      estimatedTime: 15,
      level: 'BEGINNER',
      exercises: [
        {
          id: 'vocab-1',
          type: 'translation',
          question: 'Traduce al español: λόγος',
          correctAnswer: 'palabra',
          hint: 'Piensa en "lógica" o "diálogo"',
          explanation: 'λόγος significa palabra, razón o discurso. Es la raíz de muchas palabras en español.',
          difficulty: 'easy'
        },
        {
          id: 'vocab-2',
          type: 'multiple-choice',
          question: '¿Qué significa σοφία?',
          options: ['amor', 'sabiduría', 'tiempo', 'lugar'],
          correctAnswer: 'sabiduría',
          hint: 'Piensa en "filosofía" (amor a la sabiduría)',
          explanation: 'σοφία significa sabiduría, y es parte de la palabra φιλοσοφία (filosofía).',
          difficulty: 'easy'
        },
        {
          id: 'vocab-3',
          type: 'matching',
          question: 'Relaciona las palabras griegas con sus traducciones:',
          correctAnswer: ['ἄνθρωπος:humano', 'θεός:dios', 'κόσμος:mundo', 'ψυχή:alma'],
          hint: 'Piensa en palabras derivadas como "antropología", "teología", etc.',
          explanation: 'Estas son palabras fundamentales del vocabulario griego.',
          difficulty: 'medium'
        }
      ]
    },
    {
      id: 'grammar-basics',
      title: 'Gramática Básica',
      description: 'Conceptos fundamentales de la gramática griega',
      category: 'Gramática',
      estimatedTime: 20,
      level: 'INTERMEDIATE',
      exercises: [
        {
          id: 'grammar-1',
          type: 'multiple-choice',
          question: '¿Cuál es el caso nominativo singular de "honor" (τιμή)?',
          options: ['τιμῆς', 'τιμῇ', 'τιμή', 'τιμήν'],
          correctAnswer: 'τιμή',
          hint: 'El nominativo es el caso del sujeto',
          explanation: 'τιμή es la forma nominativo singular de "honor".',
          difficulty: 'medium'
        },
        {
          id: 'grammar-2',
          type: 'fill-blank',
          question: 'Complete la conjugación: λύω, λύεις, _____',
          correctAnswer: 'λύει',
          hint: 'Es la tercera persona singular del presente',
          explanation: 'λύει es la forma de tercera persona singular del presente de λύω.',
          difficulty: 'medium'
        }
      ]
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const startExerciseSet = (set: ExerciseSet) => {
    setSelectedSet(set)
    setCurrentExerciseIndex(0)
    setUserAnswers({})
    setShowResults(false)
    setShowHint(false)
    setTimeStarted(Date.now())
  }

  const handleAnswer = (answer: string | string[]) => {
    if (!selectedSet) return
    
    const currentExercise = selectedSet.exercises[currentExerciseIndex]
    setUserAnswers({
      ...userAnswers,
      [currentExercise.id]: answer
    })
  }

  const nextExercise = () => {
    if (!selectedSet) return
    
    if (currentExerciseIndex < selectedSet.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setShowHint(false)
    } else {
      setShowResults(true)
    }
  }

  const resetExercises = () => {
    setSelectedSet(null)
    setCurrentExerciseIndex(0)
    setUserAnswers({})
    setShowResults(false)
    setShowHint(false)
    setTimeStarted(null)
  }

  const calculateScore = () => {
    if (!selectedSet) return 0
    
    let correct = 0
    selectedSet.exercises.forEach(exercise => {
      const userAnswer = userAnswers[exercise.id]
      if (Array.isArray(exercise.correctAnswer)) {
        if (Array.isArray(userAnswer) && 
            exercise.correctAnswer.every(ans => userAnswer.includes(ans))) {
          correct++
        }
      } else {
        if (userAnswer === exercise.correctAnswer) {
          correct++
        }
      }
    })
    
    return Math.round((correct / selectedSet.exercises.length) * 100)
  }

  const getTimeElapsed = () => {
    if (!timeStarted) return 0
    return Math.round((Date.now() - timeStarted) / 1000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  if (!selectedSet) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Práctica</h1>
            <p className="text-muted-foreground mt-2">
              Refuerza tu aprendizaje con ejercicios interactivos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exerciseSets.map((set) => (
              <div key={set.id} className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      set.level === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                      set.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {set.level === 'BEGINNER' ? 'Principiante' :
                       set.level === 'INTERMEDIATE' ? 'Intermedio' : 'Avanzado'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{set.category}</span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{set.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{set.description}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{set.exercises.length} ejercicios</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{set.estimatedTime} min</span>
                  </div>
                </div>

                <Button onClick={() => startExerciseSet(set)} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Comenzar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const timeElapsed = getTimeElapsed()
    
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {score >= 80 ? '¡Excelente!' : score >= 60 ? '¡Bien hecho!' : '¡Sigue practicando!'}
            </h2>
            <p className="text-xl text-muted-foreground">
              Tu puntuación: {score}%
            </p>
            <p className="text-sm text-muted-foreground">
              Tiempo: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Resultados Detallados</h3>
            <div className="space-y-4">
              {selectedSet.exercises.map((exercise, index) => {
                const userAnswer = userAnswers[exercise.id]
                const isCorrect = Array.isArray(exercise.correctAnswer) 
                  ? Array.isArray(userAnswer) && exercise.correctAnswer.every(ans => userAnswer.includes(ans))
                  : userAnswer === exercise.correctAnswer

                return (
                  <div key={exercise.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-1">Pregunta {index + 1}</p>
                      <p className="text-sm text-muted-foreground mb-2">{exercise.question}</p>
                      <div className="text-sm">
                        <p>Tu respuesta: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer}
                        </span></p>
                        {!isCorrect && (
                          <p>Respuesta correcta: <span className="text-green-600">
                            {Array.isArray(exercise.correctAnswer) 
                              ? exercise.correctAnswer.join(', ') 
                              : exercise.correctAnswer}
                          </span></p>
                        )}
                      </div>
                      {exercise.explanation && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {exercise.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={resetExercises} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Volver a Práctica
            </Button>
            <Button onClick={() => router.push('/dashboard')}>
              Ir al Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const currentExercise = selectedSet.exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + 1) / selectedSet.exercises.length) * 100

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{selectedSet.title}</h1>
            <p className="text-muted-foreground">
              Pregunta {currentExerciseIndex + 1} de {selectedSet.exercises.length}
            </p>
          </div>
          <Button variant="outline" onClick={resetExercises}>
            Salir
          </Button>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Exercise */}
        <div className="bg-white rounded-lg border border-border p-8">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">{currentExercise.question}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentExercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentExercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentExercise.difficulty === 'easy' ? 'Fácil' :
                 currentExercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </span>
            </div>

            {/* Exercise Content */}
            {currentExercise.type === 'multiple-choice' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentExercise.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant={userAnswers[currentExercise.id] === option ? "default" : "outline"}
                    onClick={() => handleAnswer(option)}
                    className="justify-start h-auto p-4 text-left"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentExercise.type === 'translation' && (
              <div>
                <input
                  type="text"
                  placeholder="Escribe tu traducción..."
                  value={userAnswers[currentExercise.id] as string || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {currentExercise.type === 'fill-blank' && (
              <div>
                <input
                  type="text"
                  placeholder="Completa los espacios en blanco..."
                  value={userAnswers[currentExercise.id] as string || ''}
                  onChange={(e) => handleAnswer(e.target.value.split(','))}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separa múltiples respuestas con comas
                </p>
              </div>
            )}

            {/* Hint */}
            {currentExercise.hint && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Ocultar' : 'Ver'} Pista
                </Button>
                {showHint && (
                  <p className="text-sm text-muted-foreground italic">
                    {currentExercise.hint}
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                disabled={currentExerciseIndex === 0}
              >
                Anterior
              </Button>
              <Button
                onClick={nextExercise}
                disabled={!userAnswers[currentExercise.id]}
              >
                {currentExerciseIndex === selectedSet.exercises.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
