'use client'

import { useState, useRef } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAudio } from '@/hooks/useAudio'
import { AnalysisManager } from '@/lib/analysis-manager'
import { 
  Search, 
  FileText, 
  Microscope, 
  Download,
  Copy,
  BookOpen,
  BarChart3,
  Volume2,
  Info,
  Brain,
  Target,
  Upload,
  Share2
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
  etymology?: string
  syntacticRole?: string
}

interface TextAnalysis {
  words: WordAnalysis[]
  statistics: {
    totalWords: number
    uniqueWords: number
    averageWordLength: number
    difficultyScore: number
    readabilityIndex: number
    mostFrequentWords: { word: string; count: number }[]
    syntacticPatterns: { pattern: string; frequency: number }[]
  }
  syntacticAnalysis: {
    sentences: {
      text: string
      structure: string
      clauses: { type: string; text: string }[]
    }[]
  }
}

export default function AnalysisPage() {
  const [inputText, setInputText] = useState('')
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedWord, setSelectedWord] = useState<WordAnalysis | null>(null)
  const [analysisMode, setAnalysisMode] = useState<'morphological' | 'syntactic' | 'complete'>('complete')

  // Datos de ejemplo más completos
  const sampleTexts = [
    {
      title: 'Ilíada I.1-5',
      author: 'Homero',
      text: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἅϊδι προΐαψεν ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν οἰωνοῖσί τε πᾶσι',
      translation: 'Canta, diosa, la cólera del Pelida Aquiles, la funesta, que causó miles de dolores a los aqueos, y precipitó al Hades muchas valientes almas de héroes, a ellos mismos los hizo presa de perros y de todas las aves'
    },
    {
      title: 'Apología 20c',
      author: 'Platón',
      text: 'ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ',
      translation: 'La vida sin examen no es digna de ser vivida por el hombre'
    },
    {
      title: 'República 514a',
      author: 'Platón',
      text: 'εἰκάσαι τοιούτῳ πάθει τὴν ἡμετέραν φύσιν παιδείας τε πέρι καὶ ἀπαιδευσίας',
      translation: 'Compara nuestra naturaleza respecto de la educación y de la falta de educación con una experiencia como esta'
    }
  ]
  // Simulación mejorada del análisis
  const handleAnalyze = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    
    try {
      // Importar el motor de análisis dinámicamente
      const { analysisEngine } = await import('@/lib/analysis-engine')
      
      // Usar el motor de análisis real
      const result = await analysisEngine.analyzeText(inputText, analysisMode)
      
      // Convertir al formato esperado por la UI
      const convertedAnalysis: TextAnalysis = {
        words: result.words.map(word => ({
          word: word.word,
          lemma: word.lemma,
          partOfSpeech: word.partOfSpeech,
          morphology: word.morphology,
          translation: word.translation,
          frequency: word.frequency,
          etymology: word.etymology,
          syntacticRole: word.syntacticRole
        })),
        statistics: {
          totalWords: result.statistics.totalWords,
          uniqueWords: result.statistics.uniqueWords,
          averageWordLength: result.statistics.averageWordLength,
          difficultyScore: result.statistics.difficultyScore,
          readabilityIndex: result.statistics.readabilityIndex,
          mostFrequentWords: result.statistics.mostFrequentWords,
          syntacticPatterns: result.statistics.syntacticPatterns.map(p => ({
            pattern: p.pattern,
            frequency: p.frequency
          }))
        },
        syntacticAnalysis: result.syntacticAnalysis
      }
      
      setAnalysis(convertedAnalysis)
    } catch (error) {
      console.error('Error en el análisis:', error)
      // Fallback al análisis simulado si hay error
      fallbackAnalysis()
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Análisis de respaldo si falla el motor principal
  const fallbackAnalysis = () => {
    const words = inputText.split(/\s+/).filter(word => word.length > 0)
    
    const mockAnalysis: TextAnalysis = {
      words: words.map((word, index) => ({
        word: word.replace(/[.,;·]/g, ''),
        lemma: getMockLemma(word),
        partOfSpeech: getMockPartOfSpeech(word, index),
        morphology: getMockMorphology(word, index),
        translation: getMockTranslation(word),
        frequency: Math.floor(Math.random() * 100) + 1,
        etymology: getMockEtymology(word),
        syntacticRole: getMockSyntacticRole(index)
      })),
      statistics: {
        totalWords: words.length,
        uniqueWords: new Set(words).size,
        averageWordLength: words.join('').length / words.length,
        difficultyScore: Math.floor(Math.random() * 40) + 60,
        readabilityIndex: Math.floor(Math.random() * 30) + 70,
        mostFrequentWords: [
          { word: 'καί', count: 15 },
          { word: 'ὁ', count: 12 },
          { word: 'δέ', count: 8 },
          { word: 'εἰμί', count: 6 }
        ],
        syntacticPatterns: [
          { pattern: 'Sujeto + Verbo + Objeto', frequency: 45 },
          { pattern: 'Participio + Sustantivo', frequency: 23 },
          { pattern: 'Genitivo Absoluto', frequency: 12 }
        ]
      },
      syntacticAnalysis: {
        sentences: analyzeSyntax(inputText)
      }
    }
    
    setAnalysis(mockAnalysis)
  }

  // Funciones auxiliares para simulación
  const getMockLemma = (word: string): string => {
    const lemmaMap: { [key: string]: string } = {
      'μῆνιν': 'μῆνις',
      'ἄειδε': 'ἀείδω',
      'θεὰ': 'θεός',
      'οὐλομένην': 'οὐλόμενος',
      'ἄλγε': 'ἄλγος',
      'ἔθηκε': 'τίθημι'
    }
    return lemmaMap[word.replace(/[.,;·]/g, '')] || word.replace(/[.,;·]/g, '')
  }

  const getMockPartOfSpeech = (word: string, index: number): string => {
    const parts = ['sustantivo', 'verbo', 'adjetivo', 'artículo', 'pronombre', 'preposición', 'adverbio']
    const wordMap: { [key: string]: string } = {
      'μῆνιν': 'sustantivo',
      'ἄειδε': 'verbo',
      'θεὰ': 'sustantivo',
      'ὁ': 'artículo',
      'δέ': 'partícula'
    }
    return wordMap[word.replace(/[.,;·]/g, '')] || parts[index % parts.length]
  }

  const getMockMorphology = (word: string, index: number) => {
    const morphologies = [
      { case: 'acusativo', number: 'singular', gender: 'femenino' },
      { tense: 'presente', voice: 'activa', mood: 'imperativo', person: 'segunda' },
      { case: 'nominativo', number: 'singular', gender: 'femenino' },
      { case: 'genitivo', number: 'singular', gender: 'masculino' }
    ]
    return morphologies[index % morphologies.length]
  }

  const getMockTranslation = (word: string): string => {
    const translations: { [key: string]: string } = {
      'μῆνιν': 'cólera, ira',
      'ἄειδε': 'canta',
      'θεὰ': 'diosa',
      'οὐλομένην': 'funesta, destructiva',
      'ἄλγε': 'dolores',
      'ἔθηκε': 'puso, causó'
    }
    return translations[word.replace(/[.,;·]/g, '')] || 'traducción'
  }

  const getMockEtymology = (word: string): string => {
    return `Deriva de la raíz indoeuropea *${word.slice(0, 3)}-`
  }

  const getMockSyntacticRole = (index: number): string => {
    const roles = ['sujeto', 'objeto directo', 'predicado', 'complemento', 'modificador']
    return roles[index % roles.length]
  }

  const analyzeSyntax = (text: string) => {
    // Análisis sintáctico básico simulado
    const sentences = text.split(/[.;]/g).filter(s => s.trim())
    return sentences.map(sentence => ({
      text: sentence.trim(),
      structure: 'SVO', // Simplificado
      clauses: [
        { type: 'principal', text: sentence.trim() }
      ]
    }))
  }

  const loadSampleText = (text: string) => {
    setInputText(text)
    setAnalysis(null)
    setSelectedWord(null)
  }

  const exportAnalysis = () => {
    if (!analysis) return
    
    const data = {
      text: inputText,
      analysis: analysis,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analisis-griego.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  const copyText = () => {
    navigator.clipboard.writeText(inputText)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis Morfológico y Sintáctico</h1>
          <p className="text-muted-foreground mt-2">
            Herramientas avanzadas para el análisis de textos griegos antiguos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Área de Entrada */}
            <div className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Texto a Analizar</h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyText}
                    disabled={!inputText}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportAnalysis}
                    disabled={!analysis}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant={analysisMode === 'morphological' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnalysisMode('morphological')}
                  >
                    <Microscope className="w-4 h-4 mr-2" />
                    Morfológico
                  </Button>
                  <Button
                    variant={analysisMode === 'syntactic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnalysisMode('syntactic')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Sintáctico
                  </Button>
                  <Button
                    variant={analysisMode === 'complete' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnalysisMode('complete')}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Completo
                  </Button>
                </div>

                <textarea
                  className="w-full h-32 p-4 border border-border rounded-lg font-mono greek-text"
                  placeholder="Escribe o pega aquí tu texto en griego antiguo..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <Button
                  onClick={handleAnalyze}
                  disabled={!inputText.trim() || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analizando...
                    </div>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analizar Texto
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Resultados del Análisis */}
            {analysis && (
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Resultados del Análisis</h2>
                
                <Tabs defaultValue="words" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="words">Palabras</TabsTrigger>
                    <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
                    <TabsTrigger value="syntax">Sintaxis</TabsTrigger>
                    <TabsTrigger value="patterns">Patrones</TabsTrigger>
                  </TabsList>

                  <TabsContent value="words" className="space-y-4">
                    <div className="grid gap-2">
                      {analysis.words.map((word, index) => (
                        <div
                          key={index}
                          className="p-3 border border-border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedWord(word)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-lg font-mono greek-text">{word.word}</span>
                              <span className="text-sm text-muted-foreground">
                                {word.lemma}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {word.partOfSpeech}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {word.translation}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="statistics" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analysis.statistics.totalWords}
                        </div>
                        <div className="text-sm text-blue-600">Palabras totales</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {analysis.statistics.uniqueWords}
                        </div>
                        <div className="text-sm text-green-600">Palabras únicas</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {analysis.statistics.difficultyScore}%
                        </div>
                        <div className="text-sm text-purple-600">Dificultad</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {analysis.statistics.readabilityIndex}%
                        </div>
                        <div className="text-sm text-orange-600">Legibilidad</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Palabras más frecuentes</h3>
                      <div className="space-y-2">
                        {analysis.statistics.mostFrequentWords.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-mono greek-text">{item.word}</span>
                            <span className="text-sm text-muted-foreground">{item.count} veces</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="syntax" className="space-y-4">
                    {analysis.syntacticAnalysis.sentences.map((sentence, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="font-mono greek-text text-lg mb-2">
                          {sentence.text}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Estructura: {sentence.structure}
                        </div>
                        <div className="space-y-1">
                          {sentence.clauses.map((clause, clIndex) => (
                            <div key={clIndex} className="text-sm">
                              <span className="font-medium">{clause.type}:</span> {clause.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="patterns" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Patrones sintácticos identificados</h3>
                      <div className="space-y-2">
                        {analysis.statistics.syntacticPatterns.map((pattern, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span>{pattern.pattern}</span>
                            <span className="text-sm text-muted-foreground">{pattern.frequency}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Textos de Ejemplo */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Textos de Ejemplo
              </h3>
              <div className="space-y-3">
                {sampleTexts.map((sample, index) => (
                  <div key={index} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{sample.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadSampleText(sample.text)}
                      >
                        Usar
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{sample.author}</p>
                    <p className="text-xs greek-text">{sample.text.substring(0, 50)}...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sample.translation.substring(0, 80)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Análisis de Palabra Seleccionada */}
            {selectedWord && (
              <div className="bg-white rounded-lg border border-border p-6">
                <h3 className="font-semibold mb-4">Análisis Detallado</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-mono greek-text mb-2">{selectedWord.word}</div>
                    <div className="text-lg text-muted-foreground">{selectedWord.lemma}</div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Traducción:</span>
                      <div className="text-sm text-muted-foreground">{selectedWord.translation}</div>
                    </div>

                    <div>
                      <span className="font-medium">Categoría:</span>
                      <div className="text-sm text-muted-foreground">{selectedWord.partOfSpeech}</div>
                    </div>

                    <div>
                      <span className="font-medium">Función sintáctica:</span>
                      <div className="text-sm text-muted-foreground">{selectedWord.syntacticRole}</div>
                    </div>

                    <div>
                      <span className="font-medium">Morfología:</span>
                      <div className="text-sm text-muted-foreground">                        {Object.entries(selectedWord.morphology)
                          .filter(([, value]) => value)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Frecuencia:</span>
                      <div className="text-sm text-muted-foreground">{selectedWord.frequency}/100</div>
                    </div>

                    {selectedWord.etymology && (
                      <div>
                        <span className="font-medium">Etimología:</span>
                        <div className="text-sm text-muted-foreground">{selectedWord.etymology}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Herramientas Rápidas */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Herramientas</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Diccionario
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Búsqueda en Corpus
                </Button>                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Análisis Métrico
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
