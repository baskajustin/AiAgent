'LAYOUT'
export const metadata = { title: 'AI Agent', description: 'AI Agent System' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
LAYOUT
