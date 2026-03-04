export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white overflow-hidden animate-skeleton">
      <div className="aspect-[3/4] bg-stone-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-1/3 bg-stone-200 rounded" />
        <div className="h-4 w-full bg-stone-200 rounded" />
        <div className="h-5 w-1/4 bg-stone-200 rounded" />
        <div className="h-9 w-full bg-stone-200 rounded mt-2" />
      </div>
    </div>
  );
}
