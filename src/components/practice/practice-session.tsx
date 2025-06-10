'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Target, 
  Clock, 
  Award,
  TrendingUp,
  Calendar,
  Brain,
  Users,
  Star,
  Trophy,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

interface Exercise {
  id: string
  type: 'multiple-choice' | 'translation' | 'fill-blank' | 'matching'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  userAnswer?: string | string[]
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface ExerciseSet {
  id: string
  title: string
  description: string
  category: string
  estimatedTime: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  exercises: Exercise[]
}

interface ExerciseResults {
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  score: number
}

interface PracticeSessionProps {
  exerciseSet: ExerciseSet
  onComplete: (results: ExerciseResults) => Promise<void>
  onBack: () => void
}

interface PracticeSessionStats {
  questionsAnswered: number
  correctAnswers: number
  currentStreak: number
  timeSpent: number
  score: number
}

export default function PracticeSession({ exerciseSet, onComplete, onBack }: PracticeSessionProps) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [stats, setStats] = useState<PracticeSessionStats>({
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    timeSpent: 0,
    score: 0
  })

  const exercises: Exercise[] = [
    {
      id: '1',
      type: 'multiple-choice',
      question: '¿Cuál es la traducción correcta de λόγος?',
      options: ['casa', 'palabra', 'hombre', 'dios'],
      correctAnswer: 'palabra',
      explanation: 'λόγος significa palabra, razón, discurso.',
      difficulty: 'easy'
    },
    {
      id: '2',
      type: 'translation',
      question: 'Traduce: ὁ ἄνθρωπος',
      correctAnswer: 'el hombre',
      explanation: 'ὁ ἄνθρωπος = el hombre (artículo + sustantivo masculino)',
      difficulty: 'easy'
    },
    {
      id: '3',
      type: 'fill-blank',
      question: 'Completa: ἡ σοφί_ (la sabiduría)',
      correctAnswer: 'α',
      explanation: 'σοφία es un sustantivo femenino de primera declinación.',
      difficulty: 'medium'
    },
    {
      id: '4',
      type: 'multiple-choice',
      question: '¿En qué caso está τὸν θεόν?',
      options: ['nominativo', 'genitivo', 'dativo', 'acusativo'],
      correctAnswer: 'acusativo',
      explanation: 'τὸν θεόν está en acusativo singular masculino.',
      difficulty: 'medium'
    }
  ]

  const currentExerciseData = exercises[currentExercise]

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer)
    setShowResult(true)
    
    const isCorrect = Array.isArray(currentExerciseData.correctAnswer) 
      ? currentExerciseData.correctAnswer.includes(answer.toLowerCase())
      : currentExerciseData.correctAnswer.toLowerCase() === answer.toLowerCase()

    setStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      score: Math.round(((prev.correctAnswers + (isCorrect ? 1 : 0)) / (prev.questionsAnswered + 1)) * 100)
    }))
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowResult(false)
    }
  }

  const resetSession = () => {
    setCurrentExercise(0)
    setUserAnswer('')
    setShowResult(false)
    setSessionActive(false)
    setStats({
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      timeSpent: 0,
      score: 0
    })
  }

  const startSession = () => {
    setSessionActive(true)
    resetSession()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isCorrect = showResult && (
    Array.isArray(currentExerciseData.correctAnswer) 
      ? currentExerciseData.correctAnswer.includes(userAnswer.toLowerCase())
      : currentExerciseData.correctAnswer.toLowerCase() === userAnswer.toLowerCase()
  )

  if (!sessionActive) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sesión de Práctica</CardTitle>
            <CardDescription>
              Refuerza tus conocimientos con ejercicios interactivos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-semibold">{exercises.length}</div>
                <div className="text-sm text-gray-600">Ejercicios</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-semibold">Mixto</div>
                <div className="text-sm text-gray-600">Dificultad</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-semibold">~10 min</div>
                <div className="text-sm text-gray-600">Duración</div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={startSession} className="px-8 py-3 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Comenzar Práctica
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                Pregunta {currentExercise + 1} de {exercises.length}
              </span>
              <Badge className={getDifficultyColor(currentExerciseData.difficulty)}>
                {currentExerciseData.difficulty}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                <span>{stats.score}%</span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1 text-green-500" />
                <span>{stats.currentStreak}</span>
              </div>
            </div>
          </div>
          <Progress 
            value={(currentExercise / exercises.length) * 100} 
            className="h-2" 
          />
        </CardContent>
      </Card>

      {/* Exercise Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {currentExerciseData.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentExerciseData.type === 'multiple-choice' && (
            <div className="space-y-2">
              {currentExerciseData.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={userAnswer === option ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => !showResult && handleAnswer(option)}
                  disabled={showResult}
                >
                  <span className="flex-1">{option}</span>
                  {showResult && option === currentExerciseData.correctAnswer && (
                    <span className="text-green-600">✓</span>
                  )}
                  {showResult && userAnswer === option && option !== currentExerciseData.correctAnswer && (
                    <span className="text-red-600">✗</span>
                  )}
                </Button>
              ))}
            </div>
          )}

          {(currentExerciseData.type === 'translation' || currentExerciseData.type === 'fill-blank') && (
            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={showResult}
                onKeyPress={(e) => e.key === 'Enter' && !showResult && handleAnswer(userAnswer)}
              />
              {!showResult && (
                <Button 
                  onClick={() => handleAnswer(userAnswer)}
                  disabled={!userAnswer.trim()}
                  className="w-full"
                >
                  Confirmar Respuesta
                </Button>
              )}
            </div>
          )}

          {showResult && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center mb-2">
                <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                </span>
              </div>
              {!isCorrect && (
                <p className="text-sm text-gray-700 mb-2">
                  Respuesta correcta: <strong>{currentExerciseData.correctAnswer}</strong>
                </p>
              )}
              <p className="text-sm text-gray-600">
                {currentExerciseData.explanation}
              </p>
            </div>
          )}

          {showResult && (
            <div className="flex justify-between">
              <Button variant="outline" onClick={resetSession}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
              {currentExercise < exercises.length - 1 ? (
                <Button onClick={nextExercise}>
                  Siguiente Pregunta
                </Button>
              ) : (
                <Button onClick={() => setSessionActive(false)}>
                  Ver Resultados
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estadísticas de la Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.questionsAnswered}</div>
              <div className="text-sm text-gray-600">Respondidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.correctAnswers}</div>
              <div className="text-sm text-gray-600">Correctas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600">Racha</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.score}%</div>
              <div className="text-sm text-gray-600">Puntuación</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
