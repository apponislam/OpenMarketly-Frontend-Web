import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${sz} ${
            n <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : n - 0.5 <= rating
              ? "fill-amber-200 text-amber-400"
              : "fill-gray-200 text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
