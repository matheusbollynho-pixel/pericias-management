import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars')
  root.render(
    <div className="p-10 text-red-600">
      <h1 className="text-2xl font-bold">Erro de Configuração</h1>
      <p>As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram encontradas.</p>
      <p>Verifique se o arquivo .env existe na raiz do projeto e reinicie o servidor.</p>
    </div>
  )
} else {
  try {
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>,
    )
  } catch (e) {
    console.error(e)
    root.render(<div className="p-10 text-red-600">Erro ao renderizar App: {String(e)}</div>)
  }
}
