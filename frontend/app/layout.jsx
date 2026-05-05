import '../styles/globals.css'
import Navigation from '../components/Navigation'

export const metadata = {
  title: 'KIET Loop',
  description: 'Private campus marketplace for KIET students'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
        <Navigation />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
