import React, { useState, useEffect } from 'react'
import { getMaterials, updateMaterialPrice, Material } from '../lib/supabase'

interface MaterialWithCategory extends Material {
  category_name: string
}

export default function CatalogoPage() {
  const [materials, setMaterials] = useState<MaterialWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')

  useEffect(() => {
    loadMaterials()
  }, [])

  const loadMaterials = async () => {
    try {
      setLoading(true)
      const data = await getMaterials()
      setMaterials(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar materiais'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditPrice = (material: MaterialWithCategory) => {
    setEditingId(material.id)
    setEditPrice(material.unit_price.toFixed(2))
  }

  const handleSavePrice = async () => {
    if (!editingId) return

    try {
      const price = parseFloat(editPrice.replace(',', '.'))
      if (isNaN(price) || price < 0) {
        alert('Preço inválido')
        return
      }

      await updateMaterialPrice(editingId, price)
      setMaterials(prev => prev.map(m =>
        m.id === editingId ? { ...m, unit_price: price } : m
      ))
      setEditingId(null)
      setEditPrice('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar preço'
      alert(message)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditPrice('')
  }

  if (loading) {
    return (
      <div className="qm-page">
        <div style={{ padding: '48px', textAlign: 'center' }}>
          Carregando catálogo...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="qm-page">
        <div style={{ padding: '48px', textAlign: 'center', color: 'red' }}>
          Erro: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="qm-page">
      <div style={{ padding: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '700', color: '#1a2a4a' }}>
            Catálogo de Materiais
          </h1>
          <p style={{ margin: 0, color: '#7a8aaa' }}>
            Todos os materiais cadastrados. Clique em Editar para alterar o preço de cada item.
          </p>
        </div>

        <div style={{ marginBottom: '16px', color: '#4a5d7a' }}>
          Total de materiais: {materials.length}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '840px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #e7ecf6', color: '#2A5AAE' }}>
                  Categoria
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #e7ecf6', color: '#2A5AAE' }}>
                  Material
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #e7ecf6', color: '#2A5AAE' }}>
                  Unidade
                </th>
                <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid #e7ecf6', color: '#2A5AAE' }}>
                  Aplica-se a
                </th>
                <th style={{ textAlign: 'right', padding: '12px 16px', borderBottom: '2px solid #e7ecf6', color: '#2A5AAE' }}>
                  Preço
                </th>
                <th style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '2px solid #e7ecf6', color: '#2A5AAE' }}>
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              {materials.map(material => (
                <tr key={material.id} style={{ borderBottom: '1px solid #eef3fb' }}>
                  <td style={{ padding: '12px 16px', color: '#4a5d7a' }}>{material.category_name}</td>
                  <td style={{ padding: '12px 16px', color: '#1a2a4a', fontWeight: 600 }}>{material.name}</td>
                  <td style={{ padding: '12px 16px', color: '#4a5d7a' }}>{material.unit}</td>
                  <td style={{ padding: '12px 16px', color: '#4a5d7a' }}>{material.applies_to}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {editingId === material.id ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#2A5AAE' }}>R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          style={{
                            width: '100px',
                            padding: '6px 10px',
                            border: '1px solid #d0d8ea',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <span style={{ color: '#2A5AAE', fontWeight: 600 }}>
                        R$ {material.unit_price.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {editingId === material.id ? (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={handleSavePrice}
                          style={{
                            padding: '6px 12px',
                            background: '#2A5AAE',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Salvar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '6px 12px',
                            background: '#f4f6fb',
                            color: '#4a5d7a',
                            border: '1px solid #d0d8ea',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditPrice(material)}
                        style={{
                          padding: '6px 12px',
                          background: '#f4f6fb',
                          color: '#2A5AAE',
                          border: '1px solid #2A5AAE',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
