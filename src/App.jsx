import { useEffect, useState } from 'react'

const API_URL = 'https://rickandmortyapi.com/api/character'

export default function App() {
  const [characters, setCharacters] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const params = new URLSearchParams({ page })
    if (search.trim()) params.set('name', search.trim())

    fetch(`${API_URL}?${params}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) return { results: [], info: { pages: 1 } }
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setCharacters(data.results)
        setPages(data.info.pages)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [page, search])

  return (
    <main className="container">
      <h1>Rick y Morty</h1>

      <input
        className="search"
        type="search"
        placeholder="Buscar personaje..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
      />

      {loading && <p>Cargando...</p>}
      {error && <p className="error">No se pudo cargar: {error}</p>}
      {!loading && !error && characters.length === 0 && <p>Sin resultados.</p>}

      <section className="grid">
        {characters.map((c) => (
          <article className="card" key={c.id}>
            <img src={c.image} alt={c.name} loading="lazy" />
            <h2>{c.name}</h2>
            <p>
              {c.status} - {c.species}
            </p>
            <p className="origin">{c.origin.name}</p>
          </article>
        ))}
      </section>

      <nav className="pager">
        <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
          Anterior
        </button>
        <span>
          Página {page} de {pages}
        </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page >= pages}>
          Siguiente
        </button>
      </nav>
    </main>
  )
}
