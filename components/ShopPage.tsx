import React, { useState } from "react";
import { ChevronRight, SlidersHorizontal, Package } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Product } from "./types";

interface ShopPageProps {
  onBack: () => void;
  onView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  products: Product[];
  activeFilter: string;
  setActiveFilter: (cat: string) => void;
}

export function ShopPage({
  onBack,
  onView,
  onAddToCart,
  products,
  activeFilter,
  setActiveFilter,
}: ShopPageProps) {
  const [sortBy, setSortBy] = useState("Featured");
  const filters = ["All", "Electronics", "Fashion", "Beauty", "Home & Living", "Sports", "Accessories"];

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Best Rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#f8f7fc]">
      {/* Page Header */}
      <div className="py-8" style={{ background: "linear-gradient(135deg, #2c1654, #4a2b8c)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1.5 text-sm text-purple-300 mb-3">
            <button onClick={onBack} className="hover:text-white transition-colors font-medium">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">Shop</span>
          </nav>
          <h1 className="text-3xl font-black text-white">
            {activeFilter === "All" || activeFilter === "All Categories" ? "All Products" : activeFilter}
          </h1>
          <p className="text-purple-300 mt-1 text-sm">{sortedProducts.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
                style={
                  activeFilter === f || (f === "All" && activeFilter === "All Categories")
                    ? { backgroundColor: "#2c1654", color: "#fff", borderColor: "#2c1654" }
                    : { backgroundColor: "#fff", color: "#374151", borderColor: "#e5e7eb" }
                }
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-semibold border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700"
            >
              {["Featured", "Price: Low to High", "Price: High to Low", "Best Rating"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sortedProducts.map((p) => (
            <ProductCard key={p._id} product={p} onView={onView} onAddToCart={onAddToCart} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">No products found in this category</p>
            <button onClick={() => setActiveFilter("All")} className="mt-4 text-[#2c1654] font-bold text-sm hover:underline">
              View all products
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
