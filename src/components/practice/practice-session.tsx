'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Clock, 
  Brain,
  Trophy,
  Play,
  ArrowLeft
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

export default function PracticeSession({ exerciseSet, onComplete, onBack }: PracticeSessionProps) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [stats, setStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    timeSpent: 0,
    score: 0
  })

  const exercises = exerciseSet.exercises

  const startSession = () => {
    setSessionActive(true)
    setStartTime(Date.now())
  }

  const handleAnswer = () => {
    const exercise = exercises[currentExercise]
    const isCorrect = Array.isArray(exercise.correctAnswer) 
      ? exercise.correctAnswer.includes(userAnswer.toLowerCase().trim())
      : exercise.correctAnswer.toString().toLowerCase().trim() === userAnswer.toLowerCase().trim()
    
    setStats(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      score: Math.round(((prev.correctAnswers + (isCorrect ? 1 : 0)) / (prev.questionsAnswered + 1)) * 100)
    }))

    setShowResult(true)
  }

  const nextQuestion = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      completeSession()
    }
  }

  const completeSession = async () => {
    const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
    const finalStats = {
      ...stats,
      timeSpent
    }

    const results: ExerciseResults = {
      totalQuestions: exercises.length,
      correctAnswers: finalStats.correctAnswers,
      timeSpent: finalStats.timeSpent,
      score: finalStats.score
    }

    setSessionCompleted(true)
    await onComplete(results)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (sessionCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>¡Sesión Completada!</CardTitle>
            <CardDescription>Has terminado: {exerciseSet.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">{stats.correctAnswers}/{exercises.length}</div>
                <div className="text-sm text-muted-foreground">Respuestas correctas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.score}%</div>
                <div className="text-sm text-muted-foreground">Puntuación</div>
              </div>
            </div>
            <Button onClick={onBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Ejercicios
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!sessionActive) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{exerciseSet.title}</CardTitle>
            <CardDescription>
              {exerciseSet.description}
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
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-semibold">{exerciseSet.estimatedTime} min</div>
                <div className="text-sm text-gray-600">Tiempo estimado</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-semibold">{exerciseSet.level}</div>
                <div className="text-sm text-gray-600">Nivel</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <Button onClick={startSession}>
                <Play className="w-4 h-4 mr-2" />
                Comenzar Práctica
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentExerciseData = exercises[currentExercise]
  const progressPercentage = ((currentExercise) / exercises.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{exerciseSet.title}</h2>
          <p className="text-muted-foreground">
            Pregunta {currentExercise + 1} de {exercises.length}
          </p>
        </div>
        <Badge variant="secondary" className={getDifficultyColor(currentExerciseData.difficulty)}>
          {currentExerciseData.difficulty}
        </Badge>
      </div>

      <Progress value={progressPercentage} className="h-2" />

      {/* Exercise Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentExerciseData.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentExerciseData.type === 'multiple-choice' && currentExerciseData.options && (
            <div className="space-y-2">
              {currentExerciseData.options.map((option, index) => (
                <Button
                  key={index}
                  variant={userAnswer === option ? "default" : "outline"}
                  className="w-full text-left justify-start"
                  onClick={() => setUserAnswer(option)}
                  disabled={showResult}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {(currentExerciseData.type === 'translation' || currentExerciseData.type === 'fill-blank') && (
            <div>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full p-3 border rounded-lg"
                disabled={showResult}
                onKeyPress={(e) => e.key === 'Enter' && !showResult && userAnswer.trim() && handleAnswer()}
              />
            </div>
          )}

          {showResult && (
            <div className="space-y-3">
              <div className={`p-4 rounded-lg border ${
                Array.isArray(currentExerciseData.correctAnswer)
                  ? currentExerciseData.correctAnswer.includes(userAnswer.toLowerCase())
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                  : currentExerciseData.correctAnswer.toString().toLowerCase() === userAnswer.toLowerCase()
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
              }`}>
                <div className="font-semibold mb-2">
                  {Array.isArray(currentExerciseData.correctAnswer)
                    ? currentExerciseData.correctAnswer.includes(userAnswer.toLowerCase())
                      ? '✅ ¡Correcto!'
                      : '❌ Incorrecto'
                    : currentExerciseData.correctAnswer.toString().toLowerCase() === userAnswer.toLowerCase()
                      ? '✅ ¡Correcto!'
                      : '❌ Incorrecto'}
                </div>
                <div className="text-sm">
                  Respuesta correcta: {Array.isArray(currentExerciseData.correctAnswer) 
                    ? currentExerciseData.correctAnswer.join(' o ')
                    : currentExerciseData.correctAnswer}
                </div>
                {currentExerciseData.explanation && (
                  <div className="text-sm mt-2 text-muted-foreground">
                    {currentExerciseData.explanation}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Salir
            </Button>
            
            {!showResult ? (
              <Button 
                onClick={handleAnswer}
                disabled={!userAnswer.trim()}
              >
                Comprobar
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                {currentExercise === exercises.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
