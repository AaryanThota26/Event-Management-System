const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden animate-pulse"
            aria-hidden="true"
          >
            <div className="h-40 bg-surface-container-high" />
            <div className="p-lg space-y-lg">
              <div className="h-5 bg-surface-container-high rounded w-3/4" />
              <div className="space-y-sm">
                <div className="h-3 bg-surface-container-high rounded w-full" />
                <div className="h-3 bg-surface-container-high rounded w-2/3" />
              </div>
              <div className="space-y-sm">
                <div className="h-3 bg-surface-container-high rounded w-1/2" />
                <div className="h-3 bg-surface-container-high rounded w-2/3" />
                <div className="h-3 bg-surface-container-high rounded w-1/3" />
              </div>
              <div className="pt-md border-t border-outline-variant flex justify-between">
                <div className="h-6 bg-surface-container-high rounded w-16" />
                <div className="h-8 bg-surface-container-high rounded w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'list-item') {
    return (
      <div className="space-y-md" aria-hidden="true">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg animate-pulse"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md">
              <div className="flex-1 space-y-md">
                <div className="flex items-center gap-sm">
                  <div className="h-5 bg-surface-container-high rounded w-2/3" />
                  <div className="h-6 bg-surface-container-high rounded w-16" />
                </div>
                <div className="flex flex-wrap gap-x-lg gap-y-sm">
                  <div className="h-4 bg-surface-container-high rounded w-32" />
                  <div className="h-4 bg-surface-container-high rounded w-24" />
                  <div className="h-4 bg-surface-container-high rounded w-40" />
                  <div className="h-4 bg-surface-container-high rounded w-28" />
                </div>
              </div>
              <div className="flex gap-sm">
                <div className="h-9 bg-surface-container-high rounded-lg w-24" />
                <div className="h-9 bg-surface-container-high rounded-lg w-20" />
                <div className="h-9 bg-surface-container-high rounded-lg w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-2xl" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg animate-pulse"
          >
            <div className="h-10 bg-surface-container-high rounded w-16 mb-xs" />
            <div className="h-4 bg-surface-container-high rounded w-24" />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="min-h-screen bg-surface-bright animate-pulse" aria-hidden="true">
        <div className="h-16 bg-white border-b border-outline-variant" />
        <div className="max-w-[960px] mx-auto p-xl space-y-xl">
          <div className="h-5 bg-surface-container-high rounded w-32" />
          <div className="rounded-2xl bg-surface-container-high p-2xl h-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
                <div className="h-5 bg-surface-container-high rounded w-3/4 mb-md" />
                <div className="h-4 bg-surface-container-high rounded w-1/2" />
              </div>
            ))}
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl">
            <div className="h-5 bg-surface-container-high rounded w-40 mb-md" />
            <div className="space-y-sm">
              <div className="h-4 bg-surface-container-high rounded w-full" />
              <div className="h-4 bg-surface-container-high rounded w-full" />
              <div className="h-4 bg-surface-container-high rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default SkeletonLoader
