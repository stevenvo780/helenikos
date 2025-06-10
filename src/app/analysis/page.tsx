'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  FileText, 
  Brain, 
  BookOpen,
  Download,
  Copy,
  Volume2,
  Info,
  Zap,
  Target
} from 'lucide-react'

interface WordAnalysis {
  word: string
  lemma: string
  partOfSpeech: string
  morphology: {
    case?: string
    number?: string
    gender?: string
    tense?: string
    voice?: string
    mood?: string
    person?: string
  }
  translation: string
  frequency: number
}

interface TextAnalysis {
  words: WordAnalysis[]
  statistics: {
    totalWords: number
    uniqueWords: number
    averageWordLength: number
    difficultyScore: number
  }
}

export default function AnalysisPage() {
  const [inputText, setInputText] = useState('')
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedWord, setSelectedWord] = useState<WordAnalysis | null>(null)

  // Datos de ejemplo para demostración
  const sampleTexts = [
    {
      title: 'Ilíada I.1-5',
      author: 'Homero',
      text: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε',
      translation: 'Canta, diosa, la cólera del Pelida Aquiles, la funesta, que causó miles de dolores a los aqueos'
    },
    {
      title: 'Apología 20c',
      author: 'Platón',
      text: 'ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ',
      translation: 'La vida sin examen no es digna de ser vivida por el hombre'
    }
  ]

  const handleAnalyze = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    
    // Simulación de análisis - en producción esto llamaría a una API real
    setTimeout(() => {
      const mockAnalysis: TextAnalysis = {
        words: inputText.split(' ').map((word, index) => ({
          word: word.replace(/[.,;·]/g, ''),
          lemma: word.replace(/[.,;·]/g, ''),
          partOfSpeech: index % 3 === 0 ? 'sustantivo' : index % 2 === 0 ? 'verbo' : 'artículo',
          morphology: {
            case: 'nominativo',
            number: 'singular',
            gender: 'masculino'
          },
          translation: 'traducción',
          frequency: Math.floor(Math.random() * 100)
        })),
        statistics: {
          totalWords: inputText.split(' ').length,
          uniqueWords: new Set(inputText.split(' ')).size,
          averageWordLength: inputText.replace(/\s/g, '').length / inputText.split(' ').length,
          difficultyScore: Math.floor(Math.random() * 100)
        }
      }
      
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
    }, 2000)
  }

  const loadSampleText = (text: string) => {
    setInputText(text)
    setAnalysis(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Textos</h1>
          <p className="text-muted-foreground mt-2">
            Herramientas avanzadas para el análisis morfológico y sintáctico de textos griegos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Texto a Analizar</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim() || isAnalyzing}
                    className="flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analizando...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>Analizar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ingresa tu texto griego aquí..."
                className="w-full h-32 p-4 border border-border rounded-lg font-mono text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ fontFamily: 'Georgia, serif' }}
              />

              {/* Sample Texts */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Textos de ejemplo:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleTexts.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSampleText(sample.text)}
                      className="text-xs"
                    >
                      {sample.title} - {sample.author}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Resultados del Análisis</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="morphology" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="morphology">Morfología</TabsTrigger>
                    <TabsTrigger value="translation">Traducción</TabsTrigger>
                    <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="morphology" className="space-y-4">
                    <div className="grid gap-2">
                      {analysis.words.map((word, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedWord(word)}
                          className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <span className="font-mono text-lg font-medium" style={{ fontFamily: 'Georgia, serif' }}>
                              {word.word}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {word.lemma}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {word.partOfSpeech}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Volume2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Info className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="translation" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Texto Original</h3>
                        <div className="p-4 bg-gray-50 rounded-lg font-mono text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                          {inputText}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Traducción Sugerida</h3>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-gray-700">
                            {sampleTexts.find(s => s.text === inputText)?.translation || 
                             "Traducción automática generada basada en el análisis morfológico..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="statistics" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{analysis.statistics.totalWords}</div>
                        <div className="text-sm text-muted-foreground">Palabras totales</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{analysis.statistics.uniqueWords}</div>
                        <div className="text-sm text-muted-foreground">Palabras únicas</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{analysis.statistics.averageWordLength.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Long. promedio</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{analysis.statistics.difficultyScore}/100</div>
                        <div className="text-sm text-muted-foreground">Dificultad</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tools */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Herramientas</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Diccionario
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Corpus de Textos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Análisis Métrico
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Traducción Rápida
                </Button>
              </div>
            </div>

            {/* Word Details */}
            {selectedWord && (
              <div className="bg-white rounded-lg border border-border p-6">
                <h3 className="font-semibold mb-4">Detalles de la Palabra</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Forma:</span>
                    <p className="font-mono text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                      {selectedWord.word}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Lema:</span>
                    <p>{selectedWord.lemma}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Parte del discurso:</span>
                    <p>{selectedWord.partOfSpeech}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Traducción:</span>
                    <p>{selectedWord.translation}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Frecuencia:</span>
                    <p>{selectedWord.frequency}/100</p>
                  </div>
                  {selectedWord.morphology && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Morfología:</span>
                      <div className="mt-1 space-y-1">
                        {Object.entries(selectedWord.morphology).map(([key, value]) => (
                          value && (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="capitalize">{key}:</span>
                              <span>{value}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Guide */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Guía Rápida</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <span>Pega tu texto griego en el área de entrada</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <span>Haz clic en "Analizar" para procesar</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <span>Explora las pestañas de resultados</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <span>Haz clic en palabras para ver detalles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
