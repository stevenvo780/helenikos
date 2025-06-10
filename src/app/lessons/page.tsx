'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Clock, 
  Star, 
  CheckCircle,
  Play,
  Lock,
  Users,
  Award
} from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  description: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: number
  completed: boolean
  locked: boolean
  progress: number
  rating: number
  topics: string[]
}

export default function LessonsPage() {
  const [selectedLevel, setSelectedLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER')

  const lessons: Lesson[] = [
    {
      id: 'alphabet-1',
      title: 'Alfabeto Griego - Parte I',
      description: 'Aprende las primeras 12 letras del alfabeto griego con pronunciación y escritura.',
      level: 'BEGINNER',
      duration: 30,
      completed: true,
      locked: false,
      progress: 100,
      rating: 4.8,
      topics: ['Alfabeto', 'Pronunciación', 'Escritura']
    },
    {
      id: 'alphabet-2',
      title: 'Alfabeto Griego - Parte II',
      description: 'Completa el alfabeto con las consonantes restantes y dígrafos.',
      level: 'BEGINNER',
      duration: 35,
      completed: false,
      locked: false,
      progress: 65,
      rating: 4.7,
      topics: ['Alfabeto', 'Consonantes', 'Dígrafos']
    },
    {
      id: 'vocabulary-1',
      title: 'Vocabulario Básico I',
      description: 'Las 50 palabras más importantes del griego antiguo.',
      level: 'BEGINNER',
      duration: 45,
      completed: false,
      locked: false,
      progress: 0,
      rating: 4.9,
      topics: ['Vocabulario', 'Sustantivos', 'Verbos']
    },
    {
      id: 'declensions-1',
      title: 'Primera Declinación',
      description: 'Aprende la declinación de sustantivos femeninos en -α y -η.',
      level: 'BEGINNER',
      duration: 50,
      completed: false,
      locked: true,
      progress: 0,
      rating: 4.6,
      topics: ['Gramática', 'Declinaciones', 'Sustantivos']
    },
    {
      id: 'syntax-basic',
      title: 'Sintaxis Básica',
      description: 'Estructura básica de la oración griega y orden de palabras.',
      level: 'INTERMEDIATE',
      duration: 40,
      completed: false,
      locked: true,
      progress: 0,
      rating: 4.5,
      topics: ['Sintaxis', 'Oración', 'Estructura']
    },
    {
      id: 'homer-intro',
      title: 'Introducción a Homero',
      description: 'Primeros versos de la Ilíada con análisis morfológico.',
      level: 'ADVANCED',
      duration: 60,
      completed: false,
      locked: true,
      progress: 0,
      rating: 4.9,
      topics: ['Literatura', 'Homero', 'Poesía épica']
    }
  ]

  const filteredLessons = lessons.filter(lesson => lesson.level === selectedLevel)
  const completedCount = lessons.filter(lesson => lesson.completed).length
  const totalProgress = Math.round((completedCount / lessons.length) * 100)

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return <Star className="w-4 h-4 text-green-500" />
      case 'INTERMEDIATE':
        return <Award className="w-4 h-4 text-yellow-500" />
      case 'ADVANCED':
        return <Users className="w-4 h-4 text-red-500" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'Principiante'
      case 'INTERMEDIATE':
        return 'Intermedio'
      case 'ADVANCED':
        return 'Avanzado'
      default:
        return level
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lecciones</h1>
          <p className="text-muted-foreground mt-2">
            Aprende griego antiguo paso a paso con nuestras lecciones estructuradas
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tu Progreso</h2>
            <span className="text-sm text-muted-foreground">
              {completedCount} de {lessons.length} lecciones completadas
            </span>
          </div>
          <Progress value={totalProgress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {totalProgress}% del curso completado
          </p>
        </div>

        {/* Level Tabs */}
        <Tabs defaultValue="BEGINNER" onValueChange={(value) => setSelectedLevel(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="BEGINNER" className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-green-500" />
              <span>Principiante</span>
            </TabsTrigger>
            <TabsTrigger value="INTERMEDIATE" className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>Intermedio</span>
            </TabsTrigger>
            <TabsTrigger value="ADVANCED" className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-red-500" />
              <span>Avanzado</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedLevel} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`bg-white rounded-lg border border-border p-6 transition-all hover:shadow-md ${
                    lesson.locked ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(lesson.level)}
                      <span className="text-xs font-medium text-muted-foreground">
                        {getLevelLabel(lesson.level)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {lesson.completed && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {lesson.locked && (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {lesson.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{lesson.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{lesson.rating}</span>
                      </div>
                    </div>

                    {lesson.progress > 0 && !lesson.completed && (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progreso</span>
                          <span>{lesson.progress}%</span>
                        </div>
                        <Progress value={lesson.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {lesson.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-gray-100 text-xs rounded-md"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      {lesson.locked ? (
                        <Button disabled className="w-full">
                          <Lock className="w-4 h-4 mr-2" />
                          Bloqueado
                        </Button>
                      ) : lesson.completed ? (
                        <Link href={`/lessons/${lesson.id}`} className="block">
                          <Button variant="outline" className="w-full">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Revisar
                          </Button>
                        </Link>
                      ) : lesson.progress > 0 ? (
                        <Link href={`/lessons/${lesson.id}`} className="block">
                          <Button className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Continuar
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/lessons/${lesson.id}`} className="block">
                          <Button className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Comenzar
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning Path */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Ruta de Aprendizaje Recomendada</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium">Domina el Alfabeto</h3>
                <p className="text-sm text-muted-foreground">
                  Completa las lecciones de alfabeto antes de continuar
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border border-border rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium">Construye tu Vocabulario</h3>
                <p className="text-sm text-muted-foreground">
                  Aprende las palabras más frecuentes del griego
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 border border-border rounded-lg opacity-50">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium">Estudia la Gramática</h3>
                <p className="text-sm text-muted-foreground">
                  Declinaciones, conjugaciones y sintaxis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
