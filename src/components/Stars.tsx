import { StarIcon } from "@/components/Icons";

export function Stars({
  rating,
  size = 12,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-[2px] ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <StarIcon className="absolute inset-0 text-slate-300" style={{ width: size, height: size }} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <StarIcon className="text-star" style={{ width: size, height: size }} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
