'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Check,
  X,
  Clock,
  Target,
  Award,
  Brain,
  BookOpen,
  Zap
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
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [score, setScore] = useState(0)

  // Datos de ejemplo para conjuntos de ejercicios
  const exerciseSets: ExerciseSet[] = [
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
        },
        {
          id: 'gamma-1',
          type: 'fill-blank',
          question: 'Completa: La letra ___ se pronuncia [g]',
          correctAnswer: 'γ',
          hint: 'Tercera letra del alfabeto',
          explanation: 'Gamma (γ) se pronuncia como "g" en "gato".',
          difficulty: 'medium'
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
        },
        {
          id: 'vocab-3',
          type: 'matching',
          question: 'Relaciona las palabras griegas con sus traducciones:',
          options: ['θεός', 'ἄνθρωπος', 'πόλις', 'βίος'],
          correctAnswer: ['dios', 'hombre', 'ciudad', 'vida'],
          hint: 'Piensa en palabras como "teología", "antropología", "política", "biografía"',
          explanation: 'θεός=dios, ἄνθρωπος=hombre, πόλις=ciudad, βίος=vida',
          difficulty: 'medium'
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
        },
        {
          id: 'morph-2',
          type: 'fill-blank',
          question: 'El dativo singular de λόγος es: λόγ__',
          correctAnswer: 'ῳ',
          hint: 'Usado para el objeto indirecto',
          explanation: 'λόγῳ es el dativo singular.',
          difficulty: 'medium'
        }
      ]
    }
  ]

  const currentExercise = selectedSet?.exercises[currentExerciseIndex]

  const handleStartSet = (set: ExerciseSet) => {
    setSelectedSet(set)
    setCurrentExerciseIndex(0)
    setUserAnswers({})
    setShowResults(false)
    setShowHint(false)
    setTimeStarted(Date.now())
    setTimeElapsed(0)
    setScore(0)
  }

  const handleAnswer = (answer: string | string[]) => {
    if (!currentExercise) return

    setUserAnswers(prev => ({
      ...prev,
      [currentExercise.id]: answer
    }))
  }

  const checkAnswer = () => {
    if (!currentExercise) return false
    
    const userAnswer = userAnswers[currentExercise.id]
    const correctAnswer = currentExercise.correctAnswer

    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      return JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort())
    }
    
    return userAnswer?.toString().toLowerCase().trim() === correctAnswer?.toString().toLowerCase().trim()
  }

  const handleNext = () => {
    if (!selectedSet || !currentExercise) return

    if (checkAnswer()) {
      setScore(prev => prev + 1)
    }

    if (currentExerciseIndex < selectedSet.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setShowHint(false)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentExerciseIndex(0)
    setUserAnswers({})
    setShowResults(false)
    setShowHint(false)
    setTimeStarted(Date.now())
    setTimeElapsed(0)
    setScore(0)
  }

  const handleBackToSets = () => {
    setSelectedSet(null)
    setShowResults(false)
  }

  const getScorePercentage = () => {
    if (!selectedSet) return 0
    return Math.round((score / selectedSet.exercises.length) * 100)
  }

  const getScoreColor = () => {
    const percentage = getScorePercentage()
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (timeStarted && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed(Date.now() - timeStarted)
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timeStarted, showResults])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando ejercicios...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Vista de selección de conjuntos
  if (!selectedSet) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Práctica y Ejercicios</h1>
            <p className="text-muted-foreground mt-2">
              Refuerza tus conocimientos con ejercicios interactivos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exerciseSets.map((set) => (
              <Card key={set.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{set.title}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded ${
                      set.level === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                      set.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {set.level}
                    </span>
                  </div>
                  <CardDescription>{set.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>{set.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center">
                          <Brain className="w-4 h-4 mr-1 text-muted-foreground" />
                          <span>{set.exercises.length} ejercicios</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Categoría: {set.category}
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleStartSet(set)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Comenzar Práctica
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Tu Progreso en Práctica</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-blue-600">ejercicios completados</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Award className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-green-600">precisión promedio</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-purple-600">racha actual</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">2.5h</div>
                  <div className="text-sm text-orange-600">tiempo total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Vista de resultados
  if (showResults) {
    const percentage = getScorePercentage()
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">¡Ejercicio Completado!</CardTitle>
              <CardDescription>{selectedSet.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor()}`}>
                  {percentage}%
                </div>
                <div className="text-muted-foreground">
                  {score} de {selectedSet.exercises.length} correctas
                </div>
              </div>

              {/* Time */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-lg">{formatTime(timeElapsed)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <Progress value={percentage} className="h-3" />
              </div>

              {/* Performance Message */}
              <div className="text-center p-4 rounded-lg bg-gray-50">
                {percentage >= 80 ? (
                  <div>
                    <div className="text-lg font-semibold text-green-600 mb-2">¡Excelente trabajo!</div>
                    <p className="text-sm text-muted-foreground">
                      Has demostrado un dominio sólido del tema. ¡Sigue así!
                    </p>
                  </div>
                ) : percentage >= 60 ? (
                  <div>
                    <div className="text-lg font-semibold text-yellow-600 mb-2">¡Buen progreso!</div>
                    <p className="text-sm text-muted-foreground">
                      Vas por buen camino. Considera repasar los temas donde tuviste dificultades.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-semibold text-red-600 mb-2">Sigue practicando</div>
                    <p className="text-sm text-muted-foreground">
                      No te desanimes. La práctica constante es clave para el aprendizaje.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button variant="outline" onClick={handleRestart} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Repetir
                </Button>
                <Button onClick={handleBackToSets} className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Otros Ejercicios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Vista del ejercicio
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{selectedSet.title}</h1>
            <p className="text-muted-foreground">
              Ejercicio {currentExerciseIndex + 1} de {selectedSet.exercises.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <Button variant="outline" onClick={handleBackToSets}>
              Salir
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progreso</span>
            <span>{currentExerciseIndex + 1}/{selectedSet.exercises.length}</span>
          </div>
          <Progress 
            value={((currentExerciseIndex + 1) / selectedSet.exercises.length) * 100} 
            className="h-2" 
          />
        </div>

        {/* Exercise */}
        {currentExercise && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    currentExercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentExercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentExercise.difficulty}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {currentExercise.type.replace('-', ' ')}
                  </span>
                </div>
                {currentExercise.hint && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                  >
                    💡 Pista
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <div className="text-lg font-medium">{currentExercise.question}</div>

              {/* Hint */}
              {showHint && currentExercise.hint && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-600">💡 Pista:</span>
                    <span className="text-sm text-blue-700">{currentExercise.hint}</span>
                  </div>
                </div>
              )}

              {/* Answer Input */}
              <div className="space-y-4">
                {currentExercise.type === 'multiple-choice' && currentExercise.options && (
                  <div className="space-y-2">
                    {currentExercise.options.map((option, index) => (
                      <button
                        key={index}
                        className={`w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors ${
                          userAnswers[currentExercise.id] === option
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                        onClick={() => handleAnswer(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {currentExercise.type === 'fill-blank' && (
                  <Input
                    placeholder="Escribe tu respuesta..."
                    value={userAnswers[currentExercise.id] as string || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="text-lg"
                  />
                )}

                {currentExercise.type === 'translation' && (
                  <Input
                    placeholder="Escribe la traducción..."
                    value={userAnswers[currentExercise.id] as string || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="text-lg"
                  />
                )}

                {currentExercise.type === 'matching' && currentExercise.options && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Griego</h4>
                      <div className="space-y-2">
                        {currentExercise.options.map((option, index) => (
                          <div key={index} className="p-2 border rounded greek-text">
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Español (arrastra o escribe)</h4>
                      <div className="space-y-2">
                        {Array.isArray(currentExercise.correctAnswer) && 
                         currentExercise.correctAnswer.map((_, index) => (
                          <Input
                            key={index}
                            placeholder={`Traducción ${index + 1}`}
                            value={
                              Array.isArray(userAnswers[currentExercise.id]) 
                                ? (userAnswers[currentExercise.id] as string[])[index] || ''
                                : ''
                            }
                            onChange={(e) => {
                              const currentAnswers = Array.isArray(userAnswers[currentExercise.id]) 
                                ? [...(userAnswers[currentExercise.id] as string[])]
                                : []
                              currentAnswers[index] = e.target.value
                              handleAnswer(currentAnswers)
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                  disabled={currentExerciseIndex === 0}
                >
                  Anterior
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!userAnswers[currentExercise.id]}
                >
                  {currentExerciseIndex === selectedSet.exercises.length - 1 ? 'Finalizar' : 'Siguiente'}
                  <SkipForward className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
