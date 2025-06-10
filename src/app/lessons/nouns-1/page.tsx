'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Star
} from 'lucide-react'

interface DeclensionExample {
  greekWord: string
  lemma: string
  meaning: string
  declension: {
    case: string
    singular: string
    plural: string
    singularTranslation: string
    pluralTranslation: string
  }[]
}

export default function NounsLessonPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [lessonCompleted, setLessonCompleted] = useState(false)

  const steps = [
    'Introducción',
    'Terminaciones',
    'Ejemplo: σοφία',
    'Ejemplo: μούσα',
    'Práctica'
  ]

  const declensionExamples: DeclensionExample[] = [
    {
      greekWord: 'σοφία',
      lemma: 'σοφία',
      meaning: 'sabiduría',
      declension: [
        { case: 'Nominativo', singular: 'ἡ σοφία', plural: 'αἱ σοφίαι', singularTranslation: 'la sabiduría', pluralTranslation: 'las sabidurías' },
        { case: 'Genitivo', singular: 'τῆς σοφίας', plural: 'τῶν σοφιῶν', singularTranslation: 'de la sabiduría', pluralTranslation: 'de las sabidurías' },
        { case: 'Dativo', singular: 'τῇ σοφίᾳ', plural: 'ταῖς σοφίαις', singularTranslation: 'a/para la sabiduría', pluralTranslation: 'a/para las sabidurías' },
        { case: 'Acusativo', singular: 'τὴν σοφίαν', plural: 'τὰς σοφίας', singularTranslation: 'a la sabiduría', pluralTranslation: 'a las sabidurías' }
      ]
    },
    {
      greekWord: 'μούσα',
      lemma: 'μούσα',
      meaning: 'musa',
      declension: [
        { case: 'Nominativo', singular: 'ἡ μούσα', plural: 'αἱ μοῦσαι', singularTranslation: 'la musa', pluralTranslation: 'las musas' },
        { case: 'Genitivo', singular: 'τῆς μούσης', plural: 'τῶν μουσῶν', singularTranslation: 'de la musa', pluralTranslation: 'de las musas' },
        { case: 'Dativo', singular: 'τῇ μούσῃ', plural: 'ταῖς μούσαις', singularTranslation: 'a/para la musa', pluralTranslation: 'a/para las musas' },
        { case: 'Acusativo', singular: 'τὴν μοῦσαν', plural: 'τὰς μούσας', singularTranslation: 'a la musa', pluralTranslation: 'a las musas' }
      ]
    }
  ]

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const markStepCompleted = () => {
    const newCompleted = new Set(completedSteps)
    newCompleted.add(currentStep)
    setCompletedSteps(newCompleted)
    
    if (newCompleted.size === steps.length) {
      setLessonCompleted(true)
      updateLessonProgress()
    }
  }

  const updateLessonProgress = async () => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: 'nouns-1',
          completed: true,
          timeSpent: 35
        }),
      })
    } catch (error) {
      console.error('Error actualizando progreso:', error)
    }
  }

  const handleNext = () => {
    if (!completedSteps.has(currentStep)) {
      markStepCompleted()
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando lección...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  if (lessonCompleted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">¡Lección Completada!</CardTitle>
              <CardDescription>
                Has aprendido la primera declinación de sustantivos griegos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-muted-foreground">Progreso completado</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Lo que has aprendido:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Las terminaciones de la primera declinación</li>
                  <li>Cómo declinar sustantivos femeninos en -α y -η</li>
                  <li>Los cuatro casos: nominativo, genitivo, dativo, acusativo</li>
                  <li>Ejemplos prácticos con σοφία y μούσα</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => router.push('/lessons')} className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Más Lecciones
                </Button>
                <Button onClick={() => router.push('/practice')} className="flex-1">
                  <Star className="w-4 h-4 mr-2" />
                  Practicar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Introducción
        return (
          <Card>
            <CardHeader>
              <CardTitle>Introducción a la Primera Declinación</CardTitle>
              <CardDescription>Fundamentos de los sustantivos griegos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                La primera declinación agrupa principalmente <strong>sustantivos femeninos</strong> que 
                terminan en <span className="greek-text font-bold">-α</span> o <span className="greek-text font-bold">-η</span> 
                en nominativo singular.
              </p>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Características principales:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Mayoría de sustantivos femeninos</li>
                  <li>Terminaciones predecibles</li>
                  <li>Base para entender otras declinaciones</li>
                  <li>Muy frecuente en textos griegos</li>
                </ul>
              </div>

              <p>
                En esta lección aprenderás las terminaciones básicas y verás ejemplos prácticos 
                con las palabras <span className="greek-text font-bold">σοφία</span> (sabiduría) 
                y <span className="greek-text font-bold">μούσα</span> (musa).
              </p>
            </CardContent>
          </Card>
        )

      case 1: // Terminaciones
        return (
          <Card>
            <CardHeader>
              <CardTitle>Terminaciones de la Primera Declinación</CardTitle>
              <CardDescription>Patrones de terminaciones para sustantivos en -η y -α</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="eta" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="eta">Sustantivos en -η</TabsTrigger>
                  <TabsTrigger value="alpha">Sustantivos en -α</TabsTrigger>
                </TabsList>
                
                <TabsContent value="eta">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-3 text-left">Caso</th>
                          <th className="border border-border p-3 text-center">Singular</th>
                          <th className="border border-border p-3 text-center">Plural</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3 font-medium">Nominativo</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-η</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-αι</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Genitivo</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ης</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ῶν</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Dativo</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ῃ</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-αις</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Acusativo</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ην</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ας</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="alpha">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-3 text-left">Caso</th>
                          <th className="border border-border p-3 text-center">Singular</th>
                          <th className="border border-border p-3 text-center">Plural</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3 font-medium">Nominativo</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-α</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-αι</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Genitivo</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ης</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ῶν</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Dativo</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ῃ</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-αις</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Acusativo</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-αν</td>
                          <td className="border border-border p-3 text-center greek-text text-lg">-ας</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">💡 Consejos para recordar:</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-800">
                  <li>El plural es igual para ambos tipos en todos los casos</li>
                  <li>Solo el nominativo y acusativo singular cambian entre -η y -α</li>
                  <li>Los otros casos (genitivo y dativo) son idénticos</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      case 2: // Ejemplo σοφία
        return (
          <Card>
            <CardHeader>
              <CardTitle>Ejemplo Práctico: σοφία (sabiduría)</CardTitle>
              <CardDescription>Declinación completa de un sustantivo en -η</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl greek-text font-bold text-primary mb-2">σοφία</div>
                <div className="text-lg text-muted-foreground">sabiduría (sustantivo femenino)</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Caso</th>
                      <th className="border border-border p-3">Singular</th>
                      <th className="border border-border p-3">Plural</th>
                      <th className="border border-border p-3">Traducción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declensionExamples[0].declension.map((row, index) => (
                      <tr key={index}>
                        <td className="border border-border p-3 font-medium">{row.case}</td>
                        <td className="border border-border p-3 text-center greek-text text-lg">{row.singular}</td>
                        <td className="border border-border p-3 text-center greek-text text-lg">{row.plural}</td>
                        <td className="border border-border p-3 text-sm text-muted-foreground">
                          {row.singularTranslation} / {row.pluralTranslation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Ejemplos en oraciones:</h4>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="greek-text text-lg mb-1">ἡ σοφία ἐστὶ καλή</div>
                    <div className="text-muted-foreground italic">La sabiduría es bella</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      (σοφία en nominativo - sujeto)
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="greek-text text-lg mb-1">τῆς σοφίας ἕνεκα</div>
                    <div className="text-muted-foreground italic">por causa de la sabiduría</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      (σοφίας en genitivo - complemento)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 3: // Ejemplo μούσα
        return (
          <Card>
            <CardHeader>
              <CardTitle>Ejemplo Práctico: μούσα (musa)</CardTitle>
              <CardDescription>Declinación completa de un sustantivo en -α</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl greek-text font-bold text-primary mb-2">μούσα</div>
                <div className="text-lg text-muted-foreground">musa (sustantivo femenino)</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Caso</th>
                      <th className="border border-border p-3">Singular</th>
                      <th className="border border-border p-3">Plural</th>
                      <th className="border border-border p-3">Traducción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declensionExamples[1].declension.map((row, index) => (
                      <tr key={index}>
                        <td className="border border-border p-3 font-medium">{row.case}</td>
                        <td className="border border-border p-3 text-center greek-text text-lg">{row.singular}</td>
                        <td className="border border-border p-3 text-center greek-text text-lg">{row.plural}</td>
                        <td className="border border-border p-3 text-sm text-muted-foreground">
                          {row.singularTranslation} / {row.pluralTranslation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🔍 Observaciones:</h4>
                <ul className="list-disc list-inside space-y-1 text-green-800">
                  <li>Nota la diferencia: <span className="greek-text">μούσα</span> vs <span className="greek-text">μοῦσαν</span> (acusativo)</li>
                  <li>El plural es idéntico al de σοφία</li>
                  <li>Solo cambian nominativo y acusativo singular</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      case 4: // Práctica
        return (
          <Card>
            <CardHeader>
              <CardTitle>Resumen y Práctica</CardTitle>
              <CardDescription>Consolida tu conocimiento de la primera declinación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">✅ Lo que has aprendido:</h4>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  <li>Las terminaciones de la primera declinación (-η y -α)</li>
                  <li>Los cuatro casos y sus funciones</li>
                  <li>Cómo declinar σοφία y μούσα</li>
                  <li>Diferencias entre singular y plural</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Próximos pasos:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">📚 Práctica recomendada</h5>
                    <p className="text-sm text-muted-foreground">
                      Completa los ejercicios de declinación para reforzar estas terminaciones.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">➡️ Siguiente lección</h5>
                    <p className="text-sm text-muted-foreground">
                      Segunda declinación: sustantivos masculinos y neutros.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  ¡Has completado la primera declinación! Ahora puedes declinar sustantivos femeninos básicos.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sustantivos: Primera Declinación</h1>
            <p className="text-muted-foreground">
              Paso {currentStep + 1} de {steps.length}: {steps[currentStep]}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/lessons')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Lecciones
          </Button>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progreso</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentStep
                  ? completedSteps.has(index)
                    ? 'bg-green-500'
                    : 'bg-primary'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex space-x-2">
            {!completedSteps.has(currentStep) && (
              <Button variant="secondary" onClick={markStepCompleted}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como completado
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
