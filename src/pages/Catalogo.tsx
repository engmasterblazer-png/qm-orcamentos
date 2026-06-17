import React, { useState, useEffect } from 'react'
import { getMaterials, updateMaterialPrice, Material, getRelatedMaterials, RelatedMaterial } from '../lib/supabase'

interface MaterialWithCategory extends Material {
  category_name: string
}

export default function CatalogoPage() {
  const [materials, setMaterials] = useState<MaterialWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialWithCategory | null>(null)
  const [relatedMaterials, setRelatedMaterials] = useState<RelatedMaterial[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

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

  const loadRelatedMaterials = async (material: MaterialWithCategory) => {
    setSelectedMaterial(material)
    setLoadingRelated(true)
    try {
      const related = await getRelatedMaterials(material.id)
      setRelatedMaterials(related)
    } catch (err) {
      console.error('Erro ao carregar materiais relacionados:', err)
      setRelatedMaterials([])
    } finally {
      setLoadingRelated(false)
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
        alert('Preco invalido')
        return
      }

      await updateMaterialPrice(editingId, price)
      setMaterials(prev => prev.map(m =>
        m.id === editingId ? { ...m, unit_price: price } : m
      ))
      if (selectedMaterial && selectedMaterial.id === editingId) {
        setSelectedMaterial({ ...selectedMaterial, unit_price: price })
      }
      setEditingId(null)
      setEditPrice('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar preco'
      alert(message)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditPrice('')
  }

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterCategory || m.category_name === filterCategory
    return matchesSearch && matchesFilter
  })

  const categories = Array.from(new Set(materials.map(m => m.category_name)))

  const groupedRelated = relatedMaterials.reduce((acc, item) => {
    if (!acc[item.relation_label]) {
      acc[item.relation_label] = []
    }
    acc[item.relation_label].push(item)
    return acc
  }, {} as Record<string, RelatedMaterial[]>)

  if (loading) {
    return (
      <div className="qm-page">
        <div style={{ padding: '48px', textAlign: 'center' }}>
          Carregando catalogo...
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
    <div className="qm-page" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Painel Principal */}
      <div style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: '700', color: '#1a2a4a' }}>
            Catalogo de Materiais
          </h1>
          <p style={{ margin: 0, color: '#7a8aaa', marginBottom: '24px' }}>
            Clique em qualquer material para ver itens relacionados. Edite precos conforme necessario.
          </p>
        </div>

        {/* Filtros e Busca */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '10px 14px',
              border: '1px solid #d0d8ea',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#1a2a4a'
            }}
          />
          <select
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            style={{
              padding: '10px 14px',
              border: '1px solid #d0d8ea',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#1a2a4a',
              minWidth: '180px'
            }}
          >
            <option value="">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div style={{ color: '#7a8aaa', padding: '10px' }}>
            {filteredMaterials.length} material(is)
          </div>
        </div>

        {/* Grid de Materiais */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {filteredMaterials.map(material => (
            <div
              key={material.id}
              onClick={() => loadRelatedMaterials(material)}
              style={{
                padding: '16px',
                border: selectedMaterial?.id === material.id ? '2px solid #2A5AAE' : '1px solid #e7ecf6',
                borderRadius: '8px',
                backgroundColor: selectedMaterial?.id === material.id ? '#f0f4ff' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedMaterial?.id === material.id 
                  ? '0 4px 12px rgba(42, 90, 174, 0.15)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (selectedMaterial?.id !== material.id) {
                  e.currentTarget.style.borderColor = '#2A5AAE'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(42, 90, 174, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMaterial?.id !== material.id) {
                  e.currentTarget.style.borderColor = '#e7ecf6'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#2A5AAE',
                  backgroundColor: '#e7ecf6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  marginBottom: '4px'
                }}>
                  {material.category_name}
                </span>
              </div>
              <div style={{
                fontWeight: '600',
                color: '#1a2a4a',
                fontSize: '15px',
                lineHeight: '1.4'
              }}>
                {material.name}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
                color: '#7a8aaa'
              }}>
                <span>{material.unit}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2A5AAE' }}>
                  R$ {material.unit_price.toFixed(2)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditPrice(material)
                }}
                style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  background: '#f4f6fb',
                  color: '#2A5AAE',
                  border: '1px solid #2A5AAE',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#2A5AAE'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f4f6fb'
                  e.currentTarget.style.color = '#2A5AAE'
                }}
              >
                {editingId === material.id ? 'Editando...' : 'Editar Preco'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Painel Lateral - Itens Relacionados */}
      {selectedMaterial && (
        <div style={{
          width: '380px',
          borderLeft: '1px solid #e7ecf6',
          backgroundColor: '#f8fafb',
          padding: '32px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header do Painel */}
          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={() => setSelectedMaterial(null)}
              style={{
                fontSize: '18px',
                background: 'none',
                border: 'none',
                color: '#7a8aaa',
                cursor: 'pointer',
                marginBottom: '16px',
                padding: 0,
                fontWeight: '600'
              }}
            >
              voltar
            </button>
            <div style={{
              backgroundColor: '#e7ecf6',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <div style={{
                color: '#2A5AAE',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {selectedMaterial.category_name}
              </div>
              <div style={{
                color: '#1a2a4a',
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                {selectedMaterial.name}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '13px',
                color: '#7a8aaa'
              }}>
                <span>{selectedMaterial.unit}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2A5AAE' }}>
                  R$ {selectedMaterial.unit_price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Editar Preco no Painel */}
            {editingId === selectedMaterial.id && (
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    border: '1px solid #d0d8ea',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  autoFocus
                />
                <button
                  onClick={handleSavePrice}
                  style={{
                    padding: '8px 12px',
                    background: '#2A5AAE',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: '8px 12px',
                    background: '#f4f6fb',
                    color: '#4a5d7a',
                    border: '1px solid #d0d8ea',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  X
                </button>
              </div>
            )}
          </div>

          {/* Itens Relacionados */}
          <div>
            <h3 style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#1a2a4a',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '16px',
              color: '#7a8aaa'
            }}>
              Itens Relacionados
            </h3>

            {loadingRelated ? (
              <div style={{ textAlign: 'center', color: '#7a8aaa', padding: '24px' }}>
                Carregando...
              </div>
            ) : relatedMaterials.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#7a8aaa',
                padding: '24px',
                fontSize: '14px'
              }}>
                Nenhum item relacionado encontrado
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {Object.entries(groupedRelated).map(([relationLabel, items]) => (
                  <div key={relationLabel}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#2A5AAE',
                      marginBottom: '12px',
                      padding: '8px 12px',
                      backgroundColor: '#e7ecf6',
                      borderRadius: '4px'
                    }}>
                      {relationLabel}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {items.map(item => (
                        <div key={`${item.id}-${item.relation_label}`} style={{
                          padding: '12px',
                          backgroundColor: '#fff',
                          border: '1px solid #d0d8ea',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}>
                          <div style={{
                            fontWeight: '600',
                            color: '#1a2a4a',
                            marginBottom: '4px'
                          }}>
                            {item.name}
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: '#7a8aaa',
                            fontSize: '12px'
                          }}>
                            <span>{item.unit}</span>
                            <span style={{ fontWeight: '600', color: '#2A5AAE' }}>
                              R$ {item.unit_price.toFixed(2)}
                            </span>
                          </div>
                          {item.quantity !== null && (
                            <div style={{
                              color: '#7a8aaa',
                              fontSize: '12px',
                              marginTop: '4px'
                            }}>
                              Qtd: {item.quantity}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
