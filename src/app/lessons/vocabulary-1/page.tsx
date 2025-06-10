'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  ArrowRight,
  Volume2,
  BookOpen,
  CheckCircle,
  Star
} from 'lucide-react'

interface VocabularyWord {
  greekWord: string
  lemma: string
  definition: string
  partOfSpeech: string
  etymology?: string
  examples: { greek: string; translation: string }[]
  pronunciation?: string
}

export default function VocabularyLessonPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set())
  const [showTranslation, setShowTranslation] = useState(false)
  const [lessonCompleted, setLessonCompleted] = useState(false)

  const vocabularyWords: VocabularyWord[] = [
    {
      greekWord: 'λόγος',
      lemma: 'λόγος',
      definition: 'palabra, razón, discurso, argumento',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'De la raíz λεγ- (λέγω, decir, hablar)',
      examples: [
        { greek: 'ὁ λόγος τοῦ θεοῦ', translation: 'la palabra de Dios' },
        { greek: 'κατὰ λόγον', translation: 'según razón' }
      ],
      pronunciation: 'LO-gos'
    },
    {
      greekWord: 'σοφία',
      lemma: 'σοφία',
      definition: 'sabiduría, conocimiento, habilidad',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'De σοφός (sabio) + sufijo -ία',
      examples: [
        { greek: 'ἡ σοφία Σωκράτους', translation: 'la sabiduría de Sócrates' },
        { greek: 'σοφίᾳ διαφέρειν', translation: 'destacar en sabiduría' }
      ],
      pronunciation: 'so-FI-a'
    },
    {
      greekWord: 'ἄνθρωπος',
      lemma: 'ἄνθρωπος',
      definition: 'ser humano, hombre, persona',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'Etimología incierta, posiblemente relacionado con ἀνήρ',
      examples: [
        { greek: 'ὁ ἄνθρωπός ἐστι ζῷον πολιτικόν', translation: 'el hombre es un animal político' },
        { greek: 'πάντες ἄνθρωποι', translation: 'todos los hombres' }
      ],
      pronunciation: 'AN-thro-pos'
    },
    {
      greekWord: 'θεός',
      lemma: 'θεός',
      definition: 'dios, divinidad',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'Relacionado con θέω (correr, moverse rápidamente)',
      examples: [
        { greek: 'οἱ θεοὶ τῶν Ἑλλήνων', translation: 'los dioses de los griegos' },
        { greek: 'θεὸς μέγας', translation: 'gran dios' }
      ],
      pronunciation: 'the-OS'
    },
    {
      greekWord: 'πόλις',
      lemma: 'πόλις',
      definition: 'ciudad, estado, ciudad-estado',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'Relacionado con πόλος (eje, centro)',
      examples: [
        { greek: 'ἡ πόλις τῶν Ἀθηναίων', translation: 'la ciudad de los atenienses' },
        { greek: 'πολίτης τῆς πόλεως', translation: 'ciudadano de la ciudad' }
      ],
      pronunciation: 'PO-lis'
    }
  ]

  const currentWord = vocabularyWords[currentWordIndex]
  const progressPercentage = ((currentWordIndex + 1) / vocabularyWords.length) * 100

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  const markWordCompleted = () => {
    const newCompleted = new Set(completedWords)
    newCompleted.add(currentWordIndex)
    setCompletedWords(newCompleted)
    
    if (newCompleted.size === vocabularyWords.length) {
      setLessonCompleted(true)
      // Aquí se podría enviar el progreso a la API
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
          lessonId: 'vocabulary-1',
          completed: true,
          timeSpent: 20 // Estimado
        }),
      })
    } catch (error) {
      console.error('Error actualizando progreso:', error)
    }
  }

  const handleNext = () => {
    if (!completedWords.has(currentWordIndex)) {
      markWordCompleted()
    }
    
    if (currentWordIndex < vocabularyWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setShowTranslation(false)
    }
  }

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
      setShowTranslation(false)
    }
  }

  const playPronunciation = () => {
    // Aquí se implementaría la reproducción de audio
    console.log(`Pronunciación: ${currentWord.pronunciation}`)
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
                Has aprendido {vocabularyWords.length} palabras nuevas del vocabulario griego básico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-muted-foreground">Progreso completado</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Palabras aprendidas:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {vocabularyWords.map((word, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-lg greek-text">{word.greekWord}</span>
                      <span className="text-sm text-muted-foreground">{word.definition.split(',')[0]}</span>
                    </div>
                  ))}
                </div>
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Vocabulario Básico I</h1>
            <p className="text-muted-foreground">
              Palabra {currentWordIndex + 1} de {vocabularyWords.length}
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

        {/* Word Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{currentWord.partOfSpeech}</Badge>
              {completedWords.has(currentWordIndex) && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completada
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Greek Word */}
            <div className="text-center">
              <div className="text-6xl font-bold greek-text mb-4 text-primary">
                {currentWord.greekWord}
              </div>
              <div className="flex items-center justify-center space-x-4">
                <span className="text-lg text-muted-foreground">
                  /{currentWord.pronunciation}/
                </span>
                <Button variant="outline" size="sm" onClick={playPronunciation}>
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Translation */}
            <div className="text-center">
              {showTranslation ? (
                <div className="space-y-2">
                  <div className="text-2xl font-semibold">{currentWord.definition}</div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowTranslation(false)}
                  >
                    Ocultar traducción
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowTranslation(true)}>
                  Mostrar traducción
                </Button>
              )}
            </div>

            {/* Etymology */}
            {showTranslation && currentWord.etymology && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Etimología</h4>
                <p className="text-blue-800">{currentWord.etymology}</p>
              </div>
            )}

            {/* Examples */}
            {showTranslation && (
              <div className="space-y-4">
                <h4 className="font-semibold">Ejemplos de uso:</h4>
                <div className="space-y-3">
                  {currentWord.examples.map((example, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="text-lg greek-text font-medium mb-1">
                        {example.greek}
                      </div>
                      <div className="text-muted-foreground italic">
                        {example.translation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentWordIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <div className="flex space-x-2">
                {!completedWords.has(currentWordIndex) && showTranslation && (
                  <Button variant="secondary" onClick={markWordCompleted}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como aprendida
                  </Button>
                )}
              </div>

              <Button
                onClick={handleNext}
                disabled={currentWordIndex === vocabularyWords.length - 1 && !showTranslation}
              >
                {currentWordIndex === vocabularyWords.length - 1 ? 'Finalizar' : 'Siguiente'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
