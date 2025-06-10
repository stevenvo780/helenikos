const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando base de datos...')

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@helenikos.com' },
    update: {},
    create: {
      email: 'admin@helenikos.com',
      name: 'Administrador',
      passwordHash: hashedPassword,
      role: 'TEACHER',
    },
  })

  console.log('✅ Usuario creado:', user.email)

  // Crear lecciones básicas
  const alphabetLesson = await prisma.lesson.upsert({
    where: { id: 'alphabet-1' },
    update: {},
    create: {
      id: 'alphabet-1',
      title: 'El Alfabeto Griego',
      description: 'Aprende las 24 letras del alfabeto griego clásico',
      content: JSON.stringify({
        introduction: 'El alfabeto griego es la base de todo el aprendizaje del griego antiguo.',
        sections: [
          {
            title: 'Letras mayúsculas',
            content: 'Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω'
          },
          {
            title: 'Letras minúsculas',
            content: 'α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ/ς τ υ φ χ ψ ω'
          }
        ]
      }),
      level: 'BEGINNER',
      order: 1,
      estimatedDuration: 30,
      prerequisites: [],
    },
  })

  const nounsLesson = await prisma.lesson.upsert({
    where: { id: 'nouns-1' },
    update: {},
    create: {
      id: 'nouns-1',
      title: 'Sustantivos: Primera Declinación',
      description: 'Aprende la primera declinación de sustantivos griegos',
      content: JSON.stringify({
        introduction: 'La primera declinación incluye principalmente sustantivos femeninos.',
        sections: [
          {
            title: 'Terminaciones',
            content: 'Singular: -η, -ης, -ῃ, -ην, -η\nPlural: -αι, -ων, -αις, -ας'
          }
        ]
      }),
      level: 'BEGINNER',
      order: 2,
      estimatedDuration: 45,
      prerequisites: ['alphabet-1'],
    },
  })

  console.log('✅ Lecciones creadas:', alphabetLesson.title, nounsLesson.title)

  // Crear vocabulario básico
  const vocabularyEntries = [
    {
      greekWord: 'λόγος',
      lemma: 'λόγος',
      definition: 'palabra, razón, discurso, argumento',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'De la raíz λεγ- (λέγω, decir, hablar)',
      examples: JSON.stringify([
        { greek: 'ὁ λόγος τοῦ θεοῦ', translation: 'la palabra de Dios' },
        { greek: 'κατὰ λόγον', translation: 'según razón' }
      ]),
      frequency: 95,
      level: 'BEGINNER',
      morphology: JSON.stringify({
        declension: 'Segunda declinación',
        irregularities: []
      }),
    },
    {
      greekWord: 'σοφία',
      lemma: 'σοφία',
      definition: 'sabiduría, conocimiento, habilidad',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'De σοφός (sabio) + sufijo -ία',
      examples: JSON.stringify([
        { greek: 'ἡ σοφία Σωκράτους', translation: 'la sabiduría de Sócrates' },
        { greek: 'σοφίᾳ διαφέρειν', translation: 'destacar en sabiduría' }
      ]),
      frequency: 72,
      level: 'BEGINNER',
      morphology: JSON.stringify({
        declension: 'Primera declinación',
        irregularities: []
      }),
    },
    {
      greekWord: 'δικαιοσύνη',
      lemma: 'δικαιοσύνη',
      definition: 'justicia, rectitud',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'De δίκαιος (justo) + sufijo -σύνη',
      examples: JSON.stringify([
        { greek: 'ἡ δικαιοσύνη τῆς πόλεως', translation: 'la justicia de la ciudad' },
        { greek: 'δικαιοσύνης ἕνεκα', translation: 'por causa de la justicia' }
      ]),
      frequency: 58,
      level: 'INTERMEDIATE',
      morphology: JSON.stringify({
        declension: 'Primera declinación',
        irregularities: []
      }),
    },
    {
      greekWord: 'ἄνθρωπος',
      lemma: 'ἄνθρωπος',
      definition: 'ser humano, hombre, persona',
      partOfSpeech: 'sustantivo masculino',
      etymology: 'Etimología incierta, posiblemente relacionado con ἀνήρ',
      examples: JSON.stringify([
        { greek: 'ὁ ἄνθρωπός ἐστι ζῷον πολιτικόν', translation: 'el hombre es un animal político' },
        { greek: 'πάντες ἄνθρωποι', translation: 'todos los hombres' }
      ]),
      frequency: 89,
      level: 'BEGINNER',
      morphology: JSON.stringify({
        declension: 'Segunda declinación',
        irregularities: []
      }),
    },
    {
      greekWord: 'φιλοσοφία',
      lemma: 'φιλοσοφία',
      definition: 'amor a la sabiduría, filosofía',
      partOfSpeech: 'sustantivo femenino',
      etymology: 'Compuesto de φίλος (amigo) + σοφία (sabiduría)',
      examples: JSON.stringify([
        { greek: 'φιλοσοφίας ἔρως', translation: 'amor por la filosofía' },
        { greek: 'ἡ φιλοσοφία Πλάτωνος', translation: 'la filosofía de Platón' }
      ]),
      frequency: 65,
      level: 'INTERMEDIATE',
      morphology: JSON.stringify({
        declension: 'Primera declinación',
        irregularities: []
      }),
    }
  ]

  for (const vocab of vocabularyEntries) {
    await prisma.vocabulary.upsert({
      where: { greekWord: vocab.greekWord },
      update: {},
      create: vocab,
    })
  }

  console.log('✅ Vocabulario creado:', vocabularyEntries.length, 'entradas')

  // Crear formas morfológicas básicas
  const morphologicalForms = [
    {
      baseForm: 'λόγος',
      inflectedForm: 'λόγου',
      morphology: JSON.stringify({
        case: 'genitivo',
        number: 'singular',
        gender: 'masculino'
      }),
      partOfSpeech: 'sustantivo',
    },
    {
      baseForm: 'λόγος',
      inflectedForm: 'λόγῳ',
      morphology: JSON.stringify({
        case: 'dativo',
        number: 'singular',
        gender: 'masculino'
      }),
      partOfSpeech: 'sustantivo',
    },
    {
      baseForm: 'λόγος',
      inflectedForm: 'λόγον',
      morphology: JSON.stringify({
        case: 'acusativo',
        number: 'singular',
        gender: 'masculino'
      }),
      partOfSpeech: 'sustantivo',
    }
  ]

  for (const form of morphologicalForms) {
    await prisma.morphologicalForm.upsert({
      where: {
        inflectedForm_baseForm: {
          inflectedForm: form.inflectedForm,
          baseForm: form.baseForm
        }
      },
      update: {},
      create: form,
    })
  }

  console.log('✅ Formas morfológicas creadas:', morphologicalForms.length, 'formas')

  console.log('🎉 Base de datos sembrada exitosamente!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
