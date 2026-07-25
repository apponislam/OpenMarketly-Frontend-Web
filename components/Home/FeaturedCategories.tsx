import React from "react";
import { ArrowRight } from "lucide-react";
import { IMGS } from "../types";

interface FeaturedCategoriesProps {
    categories: any[];
    onShopClick: () => void;
    onCategoryClick: (catName: string) => void;
}

export function FeaturedCategories({ categories, onShopClick, onCategoryClick }: FeaturedCategoriesProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#c8960c" }}>
                        Browse
                    </p>
                    <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
                </div>
                <button onClick={onShopClick} className="hidden sm:flex items-center gap-1.5 font-bold text-sm hover:opacity-70 transition-opacity" style={{ color: "#2c1654" }}>
                    View All <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((cat, idx) => (
                    <div key={idx} onClick={() => onCategoryClick(cat.name)} className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style={{ aspectRatio: "4/3" }}>
                        <img src={cat.image || IMGS.headphones} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${cat.color || "from-violet-800"} via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <p className="text-white font-black text-sm">{cat.name}</p>
                            <p className="text-white/60 text-xs mt-0.5">{cat.count || "View Items"}</p>
                        </div>
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "#c8960c" }}>
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
