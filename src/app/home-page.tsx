'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Search, BarChart3, Users } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (session) {
      router.push('/dashboard')
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

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-primary">Ἑλληνικός</h1>
              <span className="ml-3 text-sm text-muted-foreground">Helenikos</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Aprende Griego Antiguo
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Plataforma universitaria completa para el aprendizaje y análisis del griego clásico. 
            Desde el alfabeto hasta textos complejos con herramientas de análisis morfológico.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/demo">
                <Button variant="outline" size="lg" className="w-full">
                  Ver Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Lecciones Interactivas</h3>
              <p className="mt-2 text-base text-gray-500">
                Aprende alfabeto, vocabulario y gramática con ejercicios interactivos
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Análisis Morfológico</h3>
              <p className="mt-2 text-base text-gray-500">
                Herramientas avanzadas para analizar textos y morfología griega
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Seguimiento de Progreso</h3>
              <p className="mt-2 text-base text-gray-500">
                Monitorea tu avance y mejora continua en el aprendizaje
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">Para Universidades</h3>
              <p className="mt-2 text-base text-gray-500">
                Diseñado específicamente para el ámbito académico universitario
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 bg-white rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                <span className="block">¿Listo para comenzar?</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-gray-500">
                Únete a estudiantes y profesores que ya están utilizando Helenikos 
                para dominar el griego antiguo.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="mt-8">
                  Crear Cuenta Gratuita
                </Button>
              </Link>
            </div>
          </div>
          <div className="aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1 bg-gradient-to-r from-purple-800 to-indigo-700">
            <div className="flex items-center justify-center text-white text-6xl font-bold">
              Ἑλληνικός
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-24">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 Helenikos. Plataforma educativa para el aprendizaje del griego antiguo.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
