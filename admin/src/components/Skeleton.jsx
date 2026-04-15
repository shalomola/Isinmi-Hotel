// Base shimmer block
const Shimmer = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

// ── Table body rows ───────────────────────────────────────────────
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="border-t border-gray-50">
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="px-5 py-3.5">
            <Shimmer className={`h-4 ${j === 0 ? 'w-2/3' : 'w-full'}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ── Stat card ─────────────────────────────────────────────────────
export const StatCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between">
    <Shimmer className="w-14 h-14 rounded-full flex-shrink-0" />
    <div className="flex flex-col items-end gap-2 flex-1 ml-4">
      <Shimmer className="h-3 w-28" />
      <Shimmer className="h-7 w-16" />
      <Shimmer className="h-3 w-20" />
    </div>
  </div>
);

// ── Room card ─────────────────────────────────────────────────────
export const RoomCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
    <Shimmer className="h-36 w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-3 w-1/2" />
      <div className="flex items-center justify-between mt-3">
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

// ── Occupancy panel (Home page) ───────────────────────────────────
export const OccupancySkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-center py-4">
      <Shimmer className="w-28 h-28 rounded-full" />
    </div>
    <div className="flex justify-around mt-2">
      <div className="flex flex-col items-center gap-2">
        <Shimmer className="h-7 w-8" />
        <Shimmer className="h-3 w-14" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <Shimmer className="h-7 w-8" />
        <Shimmer className="h-3 w-14" />
      </div>
    </div>
    <div className="mt-5 border-t border-gray-50 pt-4 space-y-3">
      <Shimmer className="h-4 w-36 mb-3" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="flex-1 h-1.5" />
          <Shimmer className="h-3 w-7" />
        </div>
      ))}
    </div>
  </div>
);

// ── Activity list items (Home page today section) ─────────────────
export const ActivitySkeleton = ({ rows = 3 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 animate-pulse"
      >
        <div className="space-y-1.5">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-3 w-24" />
        </div>
        <div className="flex items-center gap-3">
          <Shimmer className="h-3 w-14" />
          <Shimmer className="h-6 w-16 rounded-full" />
        </div>
      </div>
    ))}
  </>
);
