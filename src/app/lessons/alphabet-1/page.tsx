'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X,
  Award,
  BookOpen,
  Headphones
} from 'lucide-react'

interface GreekLetter {
  uppercase: string
  lowercase: string
  name: string
  pronunciation: string
  transliteration: string
  examples: string[]
  audioKey: string
}

export default function AlphabetLessonPage() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(0)
  const [progress, setProgress] = useState(0)
  const [completedSections, setCompletedSections] = useState<number[]>([])
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({})
  const [showResults, setShowResults] = useState(false)

  const letters: GreekLetter[] = [
    {
      uppercase: 'Α',
      lowercase: 'α',
      name: 'Alfa',
      pronunciation: '/a/',
      transliteration: 'a',
      examples: ['ἀνήρ (anēr) - hombre', 'ἀγάπη (agapē) - amor'],
      audioKey: 'alpha'
    },
    {
      uppercase: 'Β',
      lowercase: 'β',
      name: 'Beta',
      pronunciation: '/b/',
      transliteration: 'b',
      examples: ['βίβλος (biblos) - libro', 'βασιλεύς (basileus) - rey'],
      audioKey: 'beta'
    },
    {
      uppercase: 'Γ',
      lowercase: 'γ',
      name: 'Gamma',
      pronunciation: '/g/',
      transliteration: 'g',
      examples: ['γῆ (gē) - tierra', 'γάλα (gala) - leche'],
      audioKey: 'gamma'
    },
    {
      uppercase: 'Δ',
      lowercase: 'δ',
      name: 'Delta',
      pronunciation: '/d/',
      transliteration: 'd',
      examples: ['δῶρον (dōron) - regalo', 'δίκη (dikē) - justicia'],
      audioKey: 'delta'
    },
    {
      uppercase: 'Ε',
      lowercase: 'ε',
      name: 'Epsilon',
      pronunciation: '/e/',
      transliteration: 'e',
      examples: ['ἔργον (ergon) - trabajo', 'ἐλπίς (elpis) - esperanza'],
      audioKey: 'epsilon'
    },
    {
      uppercase: 'Ζ',
      lowercase: 'ζ',
      name: 'Zeta',
      pronunciation: '/z/',
      transliteration: 'z',
      examples: ['ζωή (zōē) - vida', 'ζῶον (zōon) - animal'],
      audioKey: 'zeta'
    }
  ]

  const quizQuestions = [
    {
      question: '¿Cuál es la letra griega para el sonido /a/?',
      options: ['Α', 'Ε', 'Ι', 'Ο'],
      correct: 'Α'
    },
    {
      question: '¿Cómo se pronuncia la letra Β?',
      options: ['/v/', '/b/', '/p/', '/f/'],
      correct: '/b/'
    },
    {
      question: '¿Cuál es la transliteración de Γ?',
      options: ['c', 'g', 'k', 'j'],
      correct: 'g'
    }
  ]

  const sections = [
    'Introducción',
    'Letras Α-Γ',
    'Letras Δ-Ζ',
    'Práctica de Escritura',
    'Evaluación'
  ]

  useEffect(() => {
    const newProgress = (completedSections.length / sections.length) * 100
    setProgress(newProgress)
  }, [completedSections, sections.length])

  const playAudio = (audioKey: string) => {
    // En una implementación real, esto reproduciría audio
    console.log(`Playing audio for: ${audioKey}`)
  }

  const markSectionComplete = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection])
    }
  }

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answer
    })
  }

  const submitQuiz = () => {
    setShowResults(true)
    markSectionComplete()
  }

  const calculateScore = () => {
    let correct = 0
    quizQuestions.forEach((q, index) => {
      if (quizAnswers[index] === q.correct) {
        correct++
      }
    })
    return Math.round((correct / quizQuestions.length) * 100)
  }

  const renderIntroduction = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">¡Bienvenido al Alfabeto Griego!</h2>
        <p className="text-lg text-muted-foreground mb-6">
          En esta lección aprenderás las primeras 6 letras del alfabeto griego, 
          su pronunciación y cómo escribirlas.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold">Aprenderás</h3>
          <p className="text-sm text-muted-foreground">6 letras del alfabeto</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Headphones className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold">Pronunciación</h3>
          <p className="text-sm text-muted-foreground">Audio y fonética</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold">Práctica</h3>
          <p className="text-sm text-muted-foreground">Ejercicios interactivos</p>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={() => { setCurrentSection(1); markSectionComplete(); }} size="lg">
          Comenzar Lección
        </Button>
      </div>
    </div>
  )

  const renderLetterSection = (startIndex: number, endIndex: number) => (
    <div className="space-y-6">
      {letters.slice(startIndex, endIndex).map((letter, index) => (
        <div key={index} className="bg-white border border-border rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-8xl font-bold text-primary mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                {letter.uppercase}
              </div>
              <div className="text-6xl text-muted-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                {letter.lowercase}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => playAudio(letter.audioKey)}
                className="mb-4"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Escuchar
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{letter.name}</h3>
                <p className="text-muted-foreground">
                  Pronunciación: <span className="font-mono">{letter.pronunciation}</span>
                </p>
                <p className="text-muted-foreground">
                  Transliteración: <span className="font-mono">{letter.transliteration}</span>
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Ejemplos:</h4>
                <ul className="space-y-1">
                  {letter.examples.map((example, exIndex) => (
                    <li key={exIndex} className="text-sm">
                      <span className="font-mono" style={{ fontFamily: 'Georgia, serif' }}>
                        {example}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center">
        <Button onClick={() => { setCurrentSection(currentSection + 1); markSectionComplete(); }}>
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderWritingPractice = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Práctica de Escritura</h2>
        <p className="text-muted-foreground">
          Practica escribir las letras que has aprendido
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {letters.slice(0, 6).map((letter, index) => (
          <div key={index} className="bg-white border border-border rounded-lg p-4">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                {letter.uppercase} {letter.lowercase}
              </span>
              <p className="text-sm text-muted-foreground">{letter.name}</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-20 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Área de práctica</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={() => { setCurrentSection(4); markSectionComplete(); }}>
          Ir a Evaluación
        </Button>
      </div>
    </div>
  )

  const renderQuiz = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Evaluación</h2>
        <p className="text-muted-foreground">
          Responde las siguientes preguntas para completar la lección
        </p>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {quizQuestions.map((question, index) => (
            <div key={index} className="bg-white border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">{question.question}</h3>
              <div className="grid grid-cols-2 gap-3">
                {question.options.map((option, optIndex) => (
                  <Button
                    key={optIndex}
                    variant={quizAnswers[index] === option ? "default" : "outline"}
                    onClick={() => handleQuizAnswer(index, option)}
                    className="justify-start"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center">
            <Button
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
              size="lg"
            >
              Enviar Respuestas
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center bg-white border border-border rounded-lg p-8">
            <div className="text-6xl mb-4">
              {calculateScore() >= 70 ? '🎉' : '📚'}
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {calculateScore() >= 70 ? '¡Excelente trabajo!' : '¡Sigue practicando!'}
            </h3>
            <p className="text-lg text-muted-foreground mb-4">
              Tu puntuación: {calculateScore()}%
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => router.push('/lessons')}>
                Volver a Lecciones
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Ir al Dashboard
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {quizQuestions.map((question, index) => (
              <div key={index} className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  {quizAnswers[index] === question.correct ? (
                    <Check className="w-5 h-5 text-green-600 mt-1" />
                  ) : (
                    <X className="w-5 h-5 text-red-600 mt-1" />
                  )}
                  <div>
                    <p className="font-medium">{question.question}</p>
                    <p className="text-sm text-muted-foreground">
                      Tu respuesta: {quizAnswers[index]} | 
                      Correcta: {question.correct}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderIntroduction()
      case 1:
        return renderLetterSection(0, 3)
      case 2:
        return renderLetterSection(3, 6)
      case 3:
        return renderWritingPractice()
      case 4:
        return renderQuiz()
      default:
        return renderIntroduction()
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push('/lessons')}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver a Lecciones
            </Button>
            <h1 className="text-3xl font-bold">Alfabeto Griego - Parte I</h1>
            <p className="text-muted-foreground">Aprende las primeras 6 letras del alfabeto griego</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso de la lección</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mb-4" />
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    index === currentSection
                      ? 'bg-primary text-primary-foreground'
                      : completedSections.includes(index)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {section}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                disabled={currentSection === sections.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-50 rounded-lg p-8">
          {renderCurrentSection()}
        </div>
      </div>
    </DashboardLayout>
  )
}
