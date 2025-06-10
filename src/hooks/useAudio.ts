import { useState, useCallback } from 'react'

interface AudioState {
  isPlaying: boolean
  isLoading: boolean
  error: string | null
}

export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    error: null
  })

  const playText = useCallback(async (text: string) => {
    setAudioState({ isPlaying: false, isLoading: true, error: null })

    try {
      // Por ahora, usar Web Speech API como fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Configurar para griego si está disponible
        const voices = speechSynthesis.getVoices()
        const greekVoice = voices.find(voice => 
          voice.lang.includes('el') || voice.lang.includes('gr')
        )
        
        if (greekVoice) {
          utterance.voice = greekVoice
        }
        
        // Configuraciones para mejor pronunciación del griego
        utterance.rate = 0.8
        utterance.pitch = 1.0
        utterance.volume = 1.0

        utterance.onstart = () => {
          setAudioState({ isPlaying: true, isLoading: false, error: null })
        }

        utterance.onend = () => {
          setAudioState({ isPlaying: false, isLoading: false, error: null })
        }

        utterance.onerror = (event) => {
          console.error('Error en síntesis de voz:', event.error)
          setAudioState({ 
            isPlaying: false, 
            isLoading: false, 
            error: 'Error al reproducir audio' 
          })
        }

        speechSynthesis.speak(utterance)
      } else {
        throw new Error('Síntesis de voz no soportada en este navegador')
      }
    } catch (error) {
      console.error('Error reproduciendo audio:', error)
      setAudioState({ 
        isPlaying: false, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      })
    }
  }, [])

  const stopAudio = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    setAudioState({ isPlaying: false, isLoading: false, error: null })
  }, [])

  const playGreekText = useCallback((greekText: string) => {
    // Función específica para texto griego con mejor pronunciación
    playText(greekText)
  }, [playText])

  const playPronunciation = useCallback((pronunciation: string) => {
    // Para pronunciaciones en notación fonética, convertir a algo más "pronunciable"
    const cleanPronunciation = pronunciation
      .replace(/\[|\]/g, '') // Remover corchetes
      .replace(/-/g, ' ') // Convertir guiones en espacios
      .toLowerCase()
    
    playText(cleanPronunciation)
  }, [playText])

  return {
    ...audioState,
    playText,
    stopAudio,
    playGreekText,
    playPronunciation
  }
}
