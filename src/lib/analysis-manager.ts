interface AnalysisExport {
  id: string
  text: string
  analysis: any
  createdAt: string
  title?: string
  notes?: string
}

export class AnalysisManager {
  static exportAnalysis(analysis: any, text: string, title?: string): void {
    const exportData: AnalysisExport = {
      id: crypto.randomUUID(),
      text,
      analysis,
      createdAt: new Date().toISOString(),
      title: title || `Análisis ${new Date().toLocaleDateString()}`,
      notes: ''
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `helenikos-analysis-${exportData.id.slice(0, 8)}.json`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  static async importAnalysis(file: File): Promise<AnalysisExport> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const result = event.target?.result
          if (typeof result !== 'string') {
            throw new Error('Error al leer el archivo')
          }
          
          const data = JSON.parse(result) as AnalysisExport
          
          // Validar estructura básica
          if (!data.id || !data.text || !data.analysis || !data.createdAt) {
            throw new Error('Formato de archivo inválido')
          }
          
          resolve(data)
        } catch (error) {
          reject(new Error('Archivo de análisis inválido'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'))
      }
      
      reader.readAsText(file)
    })
  }

  static exportMultipleAnalyses(analyses: AnalysisExport[]): void {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      analyses
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `helenikos-analyses-${new Date().toISOString().split('T')[0]}.json`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  static generateAnalysisReport(analysis: any, text: string): string {
    const report = `
ANÁLISIS MORFOLÓGICO Y SINTÁCTICO
===============================

Texto analizado: ${text}
Fecha: ${new Date().toLocaleDateString()}

ESTADÍSTICAS GENERALES
---------------------
Total de palabras: ${analysis.statistics?.totalWords || 'N/A'}
Palabras únicas: ${analysis.statistics?.uniqueWords || 'N/A'}
Nivel de vocabulario: ${analysis.statistics?.vocabularyLevel || 'N/A'}

ANÁLISIS MORFOLÓGICO
-------------------
${analysis.morphologicalAnalysis?.map((word: any, index: number) => 
  `${index + 1}. ${word.word} (${word.lemma || 'desconocido'})
     - Forma: ${word.morphology?.partOfSpeech || 'desconocido'}
     - Caso: ${word.morphology?.case || 'N/A'}
     - Número: ${word.morphology?.number || 'N/A'}
     - Género: ${word.morphology?.gender || 'N/A'}
`).join('\n') || 'No disponible'}

PATRONES SINTÁCTICOS
-------------------
${analysis.syntacticPatterns?.map((pattern: any, index: number) => 
  `${index + 1}. ${pattern.pattern}: ${pattern.description}`
).join('\n') || 'No disponible'}

NOTAS ADICIONALES
----------------
${analysis.notes || 'Sin notas adicionales'}

---
Generado por Helenikos - Software de análisis de griego antiguo
    `.trim()

    return report
  }

  static exportAnalysisAsText(analysis: any, text: string, title?: string): void {
    const report = this.generateAnalysisReport(analysis, text)
    const dataBlob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || 'analisis'}-${new Date().toISOString().split('T')[0]}.txt`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  static shareAnalysis(analysis: any, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator.share) {
        const report = this.generateAnalysisReport(analysis, text)
        
        navigator.share({
          title: 'Análisis de texto griego - Helenikos',
          text: report,
        })
        .then(() => resolve())
        .catch((error) => reject(error))
      } else {
        // Fallback: copiar al portapapeles
        const report = this.generateAnalysisReport(analysis, text)
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(report)
            .then(() => {
              alert('Análisis copiado al portapapeles')
              resolve()
            })
            .catch((error) => reject(error))
        } else {
          reject(new Error('Compartir no soportado en este navegador'))
        }
      }
    })
  }
}
