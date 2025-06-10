'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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
  Trophy
} from 'lucide-react'

interface DashboardStats {
  totalLessons: number
  completedLessons: number
  currentStreak: number
  totalTimeSpent: number
  averageScore: number
  level: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats] = useState<DashboardStats>({
    totalLessons: 24,
    completedLessons: 8,
    currentStreak: 5,
    totalTimeSpent: 120,
    averageScore: 85,
    level: 'BEGINNER'
  })

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
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const progressPercentage = Math.round((stats.completedLessons / stats.totalLessons) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Γεῖα σου, {session?.user?.name || 'Estudiante'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Continúa tu viaje aprendiendo griego antiguo
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Nivel actual</div>
            <div className="text-2xl font-bold text-primary">{stats.level}</div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Tu Progreso
            </CardTitle>
            <CardDescription>
              Has completado {stats.completedLessons} de {stats.totalLessons} lecciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso General</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{stats.currentStreak}</div>
                  <div className="text-sm text-blue-600">días seguidos</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{stats.totalTimeSpent}</div>
                  <div className="text-sm text-green-600">minutos totales</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
                  <div className="text-sm text-purple-600">puntuación media</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <BookOpen className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.completedLessons}</p>
                <p className="text-sm text-muted-foreground">Lecciones completadas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Target className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Racha actual</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="w-8 h-8 text-orange-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTimeSpent}m</p>
                <p className="text-sm text-muted-foreground">Tiempo de estudio</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <Award className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Puntuación media</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Continúa Aprendiendo
                </CardTitle>
                <CardDescription>
                  Retoma donde lo dejaste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Alfabeto Griego - Parte II</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">BEGINNER</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Aprende las últimas 12 letras del alfabeto griego y los diptongos.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        35 min
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-4 h-4 mr-1" />
                        4.8
                      </div>
                    </div>
                    <Button onClick={() => router.push('/lessons/alphabet-2')}>
                      Continuar
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Vocabulario Básico I</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">BEGINNER</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Las 50 palabras más importantes del griego antiguo.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        45 min
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-4 h-4 mr-1" />
                        4.9
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/lessons/vocabulary-1')}>
                      Empezar
                    </Button>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => router.push('/lessons')}>
                    Ver todas las lecciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/analysis')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Analizar Texto
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dictionary')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Diccionario
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/practice')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Práctica
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/progress')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Mi Progreso
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Comunidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Estudiantes activos hoy:</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Tu ranking:</span>
                    <span className="font-semibold">#24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Puntos totales:</span>
                    <span className="font-semibold">1,250</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Ver leaderboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tip del Día</CardTitle>
              </CardHeader>              <CardContent>
                <p className="text-sm text-muted-foreground">
                  💡 <strong>¿Sabías que...</strong> la palabra filosofía (φιλοσοφία) 
                  literalmente significa amor a la sabiduría en griego? 
                  φίλος (amor) + σοφία (sabiduría).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
