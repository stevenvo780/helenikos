import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string
      email: string
      role: 'STUDENT' | 'TEACHER' | 'ADMIN'
    }
  }

  interface User {
    role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  }
}
