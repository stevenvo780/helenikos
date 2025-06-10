'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Clock,
  BookOpen,
  Zap,
  Download,
  Share2
} from 'lucide-react'

interface ProgressData {
  dailyActivity: { date: string; minutes: number; lessons: number }[]
  weeklyGoals: { week: string; target: number; completed: number }[]
  achievements: { id: string; title: string; description: string; unlockedAt: string; icon: string }[]
  skillProgress: { skill: string; level: number; progress: number }[]
  overallStats: {
    totalLessons: number
    completedLessons: number
    totalTime: number
    averageScore: number
    currentStreak: number
    longestStreak: number
  }
}

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  const generateDailyActivity = (lessonsProgress: any[]) => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // Calcular actividad basada en lecciones completadas en ese día
      const dayLessons = lessonsProgress.filter(lesson => 
        lesson.completedAt && 
        new Date(lesson.completedAt).toDateString() === date.toDateString()
      )
      
      last7Days.push({
        date: dateStr,
        minutes: dayLessons.reduce((sum, lesson) => sum + (lesson.timeSpent || 0), 0),
        lessons: dayLessons.length
      })
    }
    
    return last7Days
  }

  const generateWeeklyGoals = () => {
    return [
      { week: 'Semana 1', target: 300, completed: 250 },
      { week: 'Semana 2', target: 300, completed: 320 },
      { week: 'Semana 3', target: 300, completed: 180 },
      { week: 'Semana 4', target: 300, completed: 290 }
    ]
  }

  const generateAchievements = (overallStats: any) => {
    const achievements = []
    
    if (overallStats.completedLessons > 0) {
      achievements.push({
        id: 'first-lesson',
        title: 'Primer Paso',
        description: 'Completaste tu primera lección',
        unlockedAt: new Date().toISOString().split('T')[0],
        icon: '🎯'
      })
    }
    
    if (overallStats.completedLessons >= 5) {
      achievements.push({
        id: 'alphabet-master',
        title: 'Maestro del Alfabeto',
        description: 'Completaste múltiples lecciones',
        unlockedAt: new Date().toISOString().split('T')[0],
        icon: '🔤'
      })
    }
    
    if (overallStats.currentStreak >= 7) {
      achievements.push({
        id: 'week-streak',
        title: 'Una Semana Constante',
        description: 'Estudiaste 7 días seguidos',
        unlockedAt: new Date().toISOString().split('T')[0],
        icon: '🔥'
      })
    }
    
    return achievements
  }

  const getStaticProgressData = (): ProgressData => ({
    dailyActivity: [
      { date: '2025-06-01', minutes: 45, lessons: 2 },
      { date: '2025-06-02', minutes: 30, lessons: 1 },
      { date: '2025-06-03', minutes: 60, lessons: 3 },
      { date: '2025-06-04', minutes: 0, lessons: 0 },
      { date: '2025-06-05', minutes: 25, lessons: 1 },
      { date: '2025-06-06', minutes: 50, lessons: 2 },
      { date: '2025-06-07', minutes: 40, lessons: 2 }
    ],
    weeklyGoals: [
      { week: 'Semana 1', target: 300, completed: 250 },
      { week: 'Semana 2', target: 300, completed: 320 },
      { week: 'Semana 3', target: 300, completed: 180 },
      { week: 'Semana 4', target: 300, completed: 290 }
    ],
    achievements: [
      { 
        id: 'first-lesson', 
        title: 'Primer Paso', 
        description: 'Completaste tu primera lección', 
        unlockedAt: '2025-06-01',
        icon: '🎯'
      },
      { 
        id: 'alphabet-master', 
        title: 'Maestro del Alfabeto', 
        description: 'Dominaste todas las letras griegas', 
        unlockedAt: '2025-06-03',
        icon: '🔤'
      },
      { 
        id: 'week-streak', 
        title: 'Una Semana Constante', 
        description: 'Estudiaste 7 días seguidos', 
        unlockedAt: '2025-06-07',
        icon: '🔥'
      }
    ],
    skillProgress: [
      { skill: 'Alfabeto', level: 2, progress: 100 },
      { skill: 'Vocabulario', level: 1, progress: 65 },
      { skill: 'Gramática', level: 1, progress: 30 },
      { skill: 'Lectura', level: 1, progress: 20 },
      { skill: 'Análisis', level: 0, progress: 0 }
    ],
    overallStats: {
      totalLessons: 24,
      completedLessons: 8,
      totalTime: 250,
      averageScore: 85,
      currentStreak: 5,
      longestStreak: 7
    }
  })

  const fetchProgressData = useCallback(async () => {
    try {
      const response = await fetch('/api/progress')
      const data = await response.json()
      
      if (response.ok) {
        // Convertir datos de la API al formato esperado
        const processedData: ProgressData = {
          dailyActivity: generateDailyActivity(data.lessonsProgress || []),
          weeklyGoals: generateWeeklyGoals(),
          achievements: generateAchievements(data.overallStats),
          skillProgress: Object.entries(data.skillProgress || {}).map(([skill, skillData]: [string, any]) => ({
            skill: skill.charAt(0).toUpperCase() + skill.slice(1),
            level: skillData.level || 0,
            progress: skillData.total > 0 ? Math.round((skillData.completed / skillData.total) * 100) : 0
          })),
          overallStats: data.overallStats
        }
        setProgressData(processedData)
      } else {
        console.error('Error al cargar progreso:', data.error)
        setProgressData(getStaticProgressData())
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error)
      setProgressData(getStaticProgressData())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchProgressData()
  }, [session, status, router, fetchProgressData])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando progreso...</p>
        </div>
      </div>
    )
  }

  if (!session || !progressData) return null

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getSkillColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100'
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-blue-600 bg-blue-100'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Progreso</h1>
            <p className="text-muted-foreground mt-2">
              Seguimiento detallado de tu aprendizaje del griego antiguo
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lecciones Completadas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {progressData.overallStats.completedLessons}
                </p>
                <p className="text-xs text-muted-foreground">
                  de {progressData.overallStats.totalLessons} total
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Progress 
              value={(progressData.overallStats.completedLessons / progressData.overallStats.totalLessons) * 100} 
              className="mt-4" 
            />
          </div>

          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.floor(progressData.overallStats.totalTime / 60)}h {progressData.overallStats.totalTime % 60}m
                </p>
                <p className="text-xs text-muted-foreground">
                  estudiando
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Racha Actual</p>
                <p className="text-3xl font-bold text-gray-900">
                  {progressData.overallStats.currentStreak}
                </p>
                <p className="text-xs text-muted-foreground">
                  días consecutivos
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Promedio</p>
                <p className="text-3xl font-bold text-gray-900">
                  {progressData.overallStats.averageScore}%
                </p>
                <p className="text-xs text-muted-foreground">
                  en evaluaciones
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Actividad Diaria</h3>
                <div className="flex space-x-2">
                  {(['week', 'month', 'year'] as const).map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                    >
                      {range === 'week' ? 'Semana' : range === 'month' ? 'Mes' : 'Año'}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {progressData.dailyActivity.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">
                      {formatDate(day.date)}
                    </div>
                    <div 
                      className={`w-full h-20 rounded-lg flex flex-col items-center justify-center ${
                        day.minutes > 0 
                          ? day.minutes > 40 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <div className="text-lg font-bold">{day.minutes}</div>
                      <div className="text-xs">min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-xl font-semibold mb-6">Progreso por Habilidad</h3>
              <div className="space-y-4">
                {progressData.skillProgress.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{skill.skill}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillColor(skill.progress)}`}>
                          Nivel {skill.level}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-xl font-semibold mb-6">Logros Desbloqueados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progressData.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Desbloqueado: {formatDate(achievement.unlockedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-xl font-semibold mb-6">Metas Semanales</h3>
              <div className="space-y-4">
                {progressData.weeklyGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{goal.week}</span>
                      <span className="text-sm text-muted-foreground">
                        {goal.completed}/{goal.target} min
                      </span>
                    </div>
                    <Progress value={(goal.completed / goal.target) * 100} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
