import './globals.css'

export const metadata = {
  title: 'Movie Bucket',
  description: 'Browse, filter, and manage your movie bucket',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
