# 🏛️ Helenikos (Ἑλληνικός) - Plataforma de Aprendizaje del Griego Antiguo

Una aplicación web completa y moderna para el aprendizaje interactivo del griego antiguo, construida con Next.js 15, TypeScript, Prisma y Tailwind CSS.

## ✨ Características Implementadas

### 📚 Sistema de Lecciones Interactivas
- **3 Lecciones Completas**: Alfabeto griego, vocabulario básico y primera declinación
- **Contenido multimedia** con pronunciación de texto griego usando el hook `useAudio`
- **Seguimiento de progreso** detallado por lección con base de datos
- **Evaluaciones integradas** con retroalimentación inmediata

### 📝 Ejercicios y Práctica  
- **Componente PracticeSession** con múltiples tipos de ejercicios
- **Sistema de puntuación** y estadísticas de rendimiento
- **Retroalimentación educativa** con explicaciones detalladas
- **Integración con APIs** para guardar progreso

### 🔍 Módulo de Análisis
- **Analizador Morfológico**: Análisis automático de textos griegos
- **Diccionario Interactivo**: Búsqueda avanzada con etimologías y ejemplos
- **Traductor Inteligente**: Traducción contextual palabra por palabra
- **Corpus de Textos**: Biblioteca de textos clásicos anotados

### 👥 Sistema Universitario
- **Roles de Usuario**: Estudiantes, profesores y administradores
- **Gestión de Progreso**: Dashboard personalizado para cada usuario
- **Análisis Estadístico**: Métricas de aprendizaje y rendimiento
- **Exportación de Datos**: Reportes en PDF para evaluación académica

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Base de Datos**: PostgreSQL/SQLite con Prisma ORM
- **Autenticación**: NextAuth.js
- **Estado Global**: Zustand
- **Validación**: Zod
- **Formularios**: React Hook Form

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/helenikos.git
cd helenikos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:
```env
# Base de datos
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-super-seguro-aqui"

# Configuración de desarrollo
NODE_ENV="development"
```

4. **Configurar la base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
Visita [http://localhost:3000](http://localhost:3000)

## 📋 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Compilar para producción
npm run start        # Ejecutar versión de producción
npm run lint         # Ejecutar ESLint
npm run db:generate  # Generar cliente de Prisma
npm run db:push      # Sincronizar esquema con BD
npm run db:migrate   # Crear migración
npm run db:studio    # Abrir Prisma Studio
```

## 🏗️ Estructura del Proyecto

```
helenikos/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── dashboard/         # Panel principal
│   │   ├── lessons/           # Módulo educativo
│   │   ├── analysis/          # Herramientas de análisis
│   │   ├── practice/          # Ejercicios
│   │   ├── dictionary/        # Diccionario
│   │   ├── progress/          # Seguimiento
│   │   └── api/               # API Routes
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/                # Componentes base
│   │   ├── layout/            # Layout components
│   │   ├── forms/             # Formularios
│   │   ├── analysis/          # Herramientas de análisis
│   │   └── lessons/           # Componentes de lecciones
│   ├── lib/                   # Utilidades y configuraciones
│   │   ├── auth.ts            # Configuración NextAuth
│   │   ├── db.ts              # Cliente Prisma
│   │   └── utils.ts           # Funciones utilitarias
│   ├── types/                 # Tipos TypeScript
│   ├── hooks/                 # Custom hooks
│   └── data/                  # Datos estáticos y de ejemplo
├── prisma/                    # Esquema de base de datos
├── public/                    # Archivos estáticos
└── docs/                      # Documentación adicional
```

## 🎯 Funcionalidades Detalladas

### Módulo de Lecciones
- **Alfabeto Griego**: Aprendizaje interactivo de las 24 letras
- **Vocabulario**: 500+ palabras organizadas por frecuencia y tema
- **Gramática**: Declinaciones, conjugaciones y sintaxis
- **Textos Clásicos**: Fragmentos de Homero, Platón, Aristóteles

### Herramientas de Análisis
- **Parser Morfológico**: Identifica formas verbales y nominales
- **Análisis Sintáctico**: Estructura de oraciones complejas
- **Frecuencia de Palabras**: Estadísticas de uso en corpus
- **Análisis Métrico**: Para poesía épica y lírica

### Sistema de Usuario
- **Dashboard Personalizado**: Progreso, estadísticas y recomendaciones
- **Configuración**: Preferencias de estudio y notificaciones
- **Logros**: Sistema de badges y reconocimientos
- **Calendario**: Planificación de estudio y metas

## 🔐 Autenticación y Seguridad

- Autenticación basada en credenciales con NextAuth.js
- Encriptación de contraseñas con bcrypt
- Validación de formularios con Zod
- Sanitización de entradas para prevenir XSS
- Rate limiting en APIs sensibles

## 📊 Base de Datos

### Modelos Principales
- **User**: Información del usuario y rol
- **Lesson**: Contenido educativo estructurado
- **Progress**: Seguimiento de avance por usuario
- **Quiz**: Evaluaciones y resultados
- **GreekText**: Corpus de textos clásicos
- **Vocabulary**: Diccionario con morfología

## 🔧 Configuración de Desarrollo

### Herramientas Recomendadas
- **IDE**: VS Code con extensiones de TypeScript
- **Base de Datos**: PostgreSQL para producción, SQLite para desarrollo
- **Testing**: Jest + React Testing Library (próximamente)
- **Deployment**: Vercel (recomendado) o Netlify

### Variables de Entorno
```env
# Desarrollo
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000

# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/helenikos"

# Autenticación
NEXTAUTH_SECRET="your-secret-here"

# APIs externas (opcional)
OPENAI_API_KEY="your-openai-key"
GOOGLE_TRANSLATE_API_KEY="your-google-key"
```

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Manual
```bash
npm run build
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guías de Contribución
- Sigue las convenciones de código existentes
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación cuando sea necesario
- Usa commits descriptivos en español

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-github](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Comunidad de helenistas y filólogos clásicos
- Recursos de griego antiguo en línea
- Bibliotecas y herramientas de código abierto utilizadas
- Perseus Digital Library por inspiración

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Guía de Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Recursos de Griego Antiguo](https://www.perseus.tufts.edu/)

---

**Nota**: Este proyecto está en desarrollo activo. Algunas funcionalidades pueden estar en fase experimental.

Para soporte técnico o preguntas académicas, abre un [issue](https://github.com/tu-usuario/helenikos/issues) en GitHub.
