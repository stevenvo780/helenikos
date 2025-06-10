'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Volume2, 
  BookOpen, 
  Star,
  Filter,
  ArrowRight,
  Info,
  Heart,
  Copy,
  ExternalLink
} from 'lucide-react'

interface DictionaryEntry {
  id: string
  greekWord: string
  lemma: string
  definition: string
  partOfSpeech: string
  etymology?: string
  examples: { greek: string; translation: string }[]
  frequency: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  morphology?: {
    declension?: string
    conjugation?: string
    irregularities?: string[]
  }
  relatedWords?: string[]
  audioUrl?: string
}

export default function DictionaryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<DictionaryEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchMode, setSearchMode] = useState<'greek' | 'spanish' | 'lemma'>('greek')
  const [levelFilter, setLevelFilter] = useState<string>('all')

  // Datos de ejemplo del diccionario
  const dictionaryData: DictionaryEntry[] = [
    {
      id: '1',
      greekWord: 'λόγος',
      lemma: 'λόγος',
      definition: 'palabra, razón, discurso, argumento',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'De la raíz λεγ- (λέγω, decir, hablar)',
      examples: [
        { greek: 'ὁ λόγος τοῦ θεοῦ', translation: 'la palabra de Dios' },
        { greek: 'κατὰ λόγον', translation: 'según razón' },
        { greek: 'λόγον διδόναι', translation: 'dar cuenta/explicación' }
      ],
      frequency: 95,
      level: 'BEGINNER',
      morphology: {
        declension: 'Segunda declinación',
        irregularities: []
      },
      relatedWords: ['λέγω', 'λογικός', 'ἀναλογία'],
      audioUrl: 'logos.mp3'
    },
    {
      id: '2',
      greekWord: 'σοφία',
      lemma: 'σοφία',
      definition: 'sabiduría, conocimiento, habilidad',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'De σοφός (sabio) + sufijo -ία',
      examples: [
        { greek: 'ἡ σοφία Σωκράτους', translation: 'la sabiduría de Sócrates' },
        { greek: 'σοφίᾳ διαφέρειν', translation: 'destacar en sabiduría' }
      ],
      frequency: 72,
      level: 'BEGINNER',
      morphology: {
        declension: 'Primera declinación',
        irregularities: []
      },
      relatedWords: ['σοφός', 'φιλοσοφία', 'σοφιστής'],
      audioUrl: 'sophia.mp3'
    },
    {
      id: '3',
      greekWord: 'δικαιοσύνη',
      lemma: 'δικαιοσύνη',
      definition: 'justicia, rectitud',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'De δίκαιος (justo) + sufijo -σύνη',
      examples: [
        { greek: 'ἡ δικαιοσύνη τῆς πόλεως', translation: 'la justicia de la ciudad' },
        { greek: 'δικαιοσύνης ἕνεκα', translation: 'por causa de la justicia' }
      ],
      frequency: 58,
      level: 'INTERMEDIATE',
      morphology: {
        declension: 'Primera declinación',
        irregularities: []
      },
      relatedWords: ['δίκαιος', 'δίκη', 'δικαστής'],
      audioUrl: 'dikaiosyne.mp3'
    },
    {
      id: '4',
      greekWord: 'ἀνθρωπος',
      lemma: 'ἄνθρωπος',
      definition: 'ser humano, hombre, persona',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'Etimología incierta, posiblemente relacionado con ἀνήρ',
      examples: [
        { greek: 'ὁ ἄνθρωπός ἐστι ζῷον πολιτικόν', translation: 'el hombre es un animal político' },
        { greek: 'πάντες ἄνθρωποι', translation: 'todos los hombres' }
      ],
      frequency: 89,
      level: 'BEGINNER',
      morphology: {
        declension: 'Segunda declinación',
        irregularities: []
      },
      relatedWords: ['ἀνθρώπινος', 'ἀνθρωπότης', 'φιλανθρωπία'],
      audioUrl: 'anthropos.mp3'
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  useEffect(() => {
    if (searchTerm.length > 0) {
      handleSearch()
    } else {
      setSearchResults([])
    }
  }, [searchTerm, searchMode, levelFilter])

  const handleSearch = () => {
    setIsSearching(true)
    
    // Simular búsqueda - en producción esto sería una llamada a API
    setTimeout(() => {
      let results = dictionaryData.filter(entry => {
        const matchesLevel = levelFilter === 'all' || entry.level.toLowerCase() === levelFilter
        
        switch (searchMode) {
          case 'greek':
            return entry.greekWord.toLowerCase().includes(searchTerm.toLowerCase()) && matchesLevel
          case 'spanish':
            return entry.definition.toLowerCase().includes(searchTerm.toLowerCase()) && matchesLevel
          case 'lemma':
            return entry.lemma.toLowerCase().includes(searchTerm.toLowerCase()) && matchesLevel
          default:
            return false
        }
      })
      
      setSearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const playAudio = (audioUrl: string) => {
    console.log(`Playing audio: ${audioUrl}`)
    // En producción, esto reproduciría el archivo de audio
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aquí podrías mostrar una notificación de éxito
  }

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

  if (!session) return null

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diccionario Griego</h1>
          <p className="text-muted-foreground mt-2">
            Busca y explora palabras del griego antiguo con definiciones, etimologías y ejemplos
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg border border-border p-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar palabra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={searchMode}
                  onChange={(e) => setSearchMode(e.target.value as any)}
                  className="px-3 py-2 border border-border rounded-md text-sm"
                >
                  <option value="greek">Griego</option>
                  <option value="spanish">Español</option>
                  <option value="lemma">Lema</option>
                </select>
                
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md text-sm"
                >
                  <option value="all">Todos los niveles</option>
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold">
              {searchTerm ? `Resultados (${searchResults.length})` : 'Palabras Populares'}
            </h2>
            
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Buscando...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(searchTerm ? searchResults : dictionaryData.slice(0, 10)).map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-4 border border-border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedEntry?.id === entry.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg greek-text">{entry.greekWord}</h3>
                        <p className="text-sm text-muted-foreground">{entry.definition}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.level === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                          entry.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.level.charAt(0)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Entry Details */}
          <div className="lg:col-span-2">
            {selectedEntry ? (
              <div className="bg-white rounded-lg border border-border p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold greek-text mb-2">{selectedEntry.greekWord}</h1>
                    <p className="text-xl text-muted-foreground">{selectedEntry.lemma}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playAudio(selectedEntry.audioUrl || '')}
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Pronunciar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedEntry.greekWord)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Definition & Part of Speech */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Definición</h3>
                  <p className="text-gray-700">{selectedEntry.definition}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Parte del discurso:</strong> {selectedEntry.partOfSpeech}
                  </p>
                </div>

                {/* Etymology */}
                {selectedEntry.etymology && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Etimología</h3>
                    <p className="text-gray-700">{selectedEntry.etymology}</p>
                  </div>
                )}

                {/* Examples */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Ejemplos</h3>
                  <div className="space-y-3">
                    {selectedEntry.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="greek-text text-lg mb-1">{example.greek}</p>
                        <p className="text-gray-600 italic">{example.translation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Morphology */}
                {selectedEntry.morphology && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Morfología</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      {selectedEntry.morphology.declension && (
                        <p><strong>Declinación:</strong> {selectedEntry.morphology.declension}</p>
                      )}
                      {selectedEntry.morphology.conjugation && (
                        <p><strong>Conjugación:</strong> {selectedEntry.morphology.conjugation}</p>
                      )}
                      {selectedEntry.morphology.irregularities && selectedEntry.morphology.irregularities.length > 0 && (
                        <p><strong>Irregularidades:</strong> {selectedEntry.morphology.irregularities.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Related Words */}
                {selectedEntry.relatedWords && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Palabras Relacionadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.relatedWords.map((word, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="greek-text"
                          onClick={() => {
                            const relatedEntry = dictionaryData.find(entry => entry.greekWord === word)
                            if (relatedEntry) setSelectedEntry(relatedEntry)
                          }}
                        >
                          {word}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frequency & Level */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      <strong>Frecuencia:</strong> {selectedEntry.frequency}/100
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedEntry.level === 'BEGINNER' ? 'bg-green-100 text-green-800' :
                      selectedEntry.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedEntry.level === 'BEGINNER' ? 'Principiante' :
                       selectedEntry.level === 'INTERMEDIATE' ? 'Intermedio' : 'Avanzado'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-border p-8 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Selecciona una palabra</h3>
                <p className="text-muted-foreground">
                  Busca o selecciona una palabra de la lista para ver sus detalles completos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
