import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import AuthSession from './session'
import { redirect } from 'next/dist/server/api-utils'
import Nav from '@/components/nav'
import Visit from '@/components/etc/visit'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sooo의 미니 게시판',
  description: 'Next.js를 활용한 게시판 만들기',
  icons: {
    icon: "/favicon.ico"
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSession>
          <Visit />
          <Nav />
          <div className='text-center mt-5 text-5xl'><Link href='/'>Sooo</Link></div>
          {children}
        </AuthSession>
      </body>
    </html>
  )
}