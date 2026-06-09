import { useState } from 'react'
import NovoOrcamentoPage from './pages/NovoOrcamento'
import CatalogoPage from './pages/Catalogo'

type Page = 'orcamento' | 'catalogo'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('orcamento')

  return (
    <div className="App">
      <nav style={{
        background: '#2A5AAE',
        padding: '16px 48px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        borderBottom: '1px solid #1a3a7a'
      }}>
        <div style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: '700'
        }}>
          QM Orçamentos
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => setCurrentPage('orcamento')}
            style={{
              background: currentPage === 'orcamento' ? '#1a3a7a' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            Novo Orçamento
          </button>
          <button
            onClick={() => setCurrentPage('catalogo')}
            style={{
              background: currentPage === 'catalogo' ? '#1a3a7a' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            Catálogo
          </button>
        </div>
      </nav>

      {currentPage === 'orcamento' && <NovoOrcamentoPage />}
      {currentPage === 'catalogo' && <CatalogoPage />}
    </div>
  )
}

export default App
