'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import PracticeSession from '@/components/practice/practice-session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Clock,
  Brain,
  Play,
  Trophy,
  Star,
  Target,
  BookOpen,
  Award,
  Zap
} from 'lucide-react'

interface ExerciseSet {
  id: string
  title: string
  description: string
  category: string
  estimatedTime: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  exercises: any[]
}

export default function PracticePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedSet, setSelectedSet] = useState<ExerciseSet | null>(null)
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchExercises()
  }, [session, status, router])

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      const data = await response.json()
      
      if (response.ok) {
        setExerciseSets(data.exercises || [])
      } else {
        console.error('Error al cargar ejercicios:', data.error)
        setExerciseSets(getStaticExercises())
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error)
      setExerciseSets(getStaticExercises())
    } finally {
      setLoading(false)
    }
  }

  const getStaticExercises = (): ExerciseSet[] => [
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
    }
  ]

  const handleStartSet = (set: ExerciseSet) => {
    setSelectedSet(set)
  }

  const handleBackToSets = () => {
    setSelectedSet(null)
  }

  const handleCompleteSet = async (results: any) => {
    // Aquí podrías enviar los resultados a la API
    console.log('Resultados del ejercicio:', results)
    
    // Volver a la selección de ejercicios
    setSelectedSet(null)
  }

  if (status === 'loading' || loading) {
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

  // Si hay un conjunto seleccionado, mostrar el componente PracticeSession
  if (selectedSet) {
    return (
      <DashboardLayout>
        <PracticeSession
          exerciseSet={selectedSet}
          onComplete={handleCompleteSet}
          onBack={handleBackToSets}
        />
      </DashboardLayout>
    )
  }

  // Vista de selección de conjuntos de ejercicios
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
