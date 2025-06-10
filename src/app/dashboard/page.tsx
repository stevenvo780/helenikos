'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  Calendar,
  ChevronRight,
  Play
} from 'lucide-react'
import Link from 'next/link'

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
  const [stats, setStats] = useState<DashboardStats>({
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Καλημέρα, {session.user.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Continúa tu viaje de aprendizaje del griego antiguo
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Progress value={progressPercentage} className="mt-4" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedLessons} de {stats.totalLessons} lecciones
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Racha</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              días consecutivos
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTimeSpent}h</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              de estudio
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              en evaluaciones
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-6">Continuar Aprendiendo</h2>
              
              <Tabs defaultValue="lessons" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="lessons">Lecciones</TabsTrigger>
                  <TabsTrigger value="practice">Práctica</TabsTrigger>
                  <TabsTrigger value="analysis">Análisis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lessons" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">Alfabeto Griego - Parte II</h3>
                          <p className="text-sm text-muted-foreground">Consonantes y dígrafos</p>
                        </div>
                      </div>
                      <Link href="/lessons/alphabet-2">
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Continuar
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Vocabulario Básico</h3>
                          <p className="text-sm text-muted-foreground">50 palabras esenciales</p>
                        </div>
                      </div>
                      <Link href="/lessons/vocabulary-1">
                        <Button variant="outline" size="sm">
                          Comenzar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="practice" className="space-y-4">
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Ejercicios de Práctica</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Refuerza lo aprendido con ejercicios interactivos
                    </p>
                    <Link href="/practice">
                      <Button>Ver Ejercicios</Button>
                    </Link>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis" className="space-y-4">
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Herramientas de Análisis</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analiza textos griegos con herramientas avanzadas
                    </p>
                    <Link href="/analysis">
                      <Button>Abrir Analizador</Button>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Goal */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Meta Semanal</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>5 de 7 días</span>
                  <span className="text-muted-foreground">71%</span>
                </div>
                <Progress value={71} />
                <p className="text-xs text-muted-foreground">
                  ¡Excelente progreso! Continúa así para alcanzar tu meta.
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Actividad Reciente</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Completaste "Alfabeto Griego I"</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Quiz de vocabulario - 90%</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Análisis de texto homérico</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Acceso Rápido</h3>
              <div className="space-y-2">
                <Link href="/dictionary" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm">Diccionario</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link href="/texts" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm">Textos Clásicos</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link href="/progress" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm">Mi Progreso</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
