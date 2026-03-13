"use client"

interface FilterBarProps {
  categorias: string[]
  activeCategoria: string
  onCategoriaChange: (categoria: string) => void
}

export function FilterBar({
  categorias,
  activeCategoria,
  onCategoriaChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoriaChange(cat)}
          className={`px-5 py-2 text-sm font-sans transition-all duration-200 ${
            activeCategoria === cat
              ? "bg-primary text-off-white border border-primary"
              : "bg-transparent text-dark-brown border border-dark-brown hover:border-primary hover:text-primary"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
