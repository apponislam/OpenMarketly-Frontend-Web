"use client";

import React, { useState } from "react";
import { 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    Image as ImageIcon,
    X,
    Check
} from "lucide-react";
import { Product, IMGS } from "@/components/types";

export default function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([
        { _id: "p1", name: "Sony WH-1000XM5 Wireless Headphones", brand: "Sony", price: 28000, originalPrice: 38000, rating: 4.8, category: "Electronics", thumbnail: IMGS.headphones },
        { _id: "p2", name: "Nike Air Max 270", brand: "Nike", price: 12000, originalPrice: 15000, rating: 4.5, category: "Fashion", thumbnail: IMGS.shoes },
        { _id: "p3", name: "Smart Watch Series 7", brand: "Apple", price: 18000, originalPrice: 22000, rating: 4.7, category: "Electronics", thumbnail: IMGS.watch },
        { _id: "p4", name: "Leather Backpack", brand: "Urban", price: 4500, originalPrice: 6000, rating: 4.2, category: "Accessories", thumbnail: IMGS.backpack },
        { _id: "p5", name: "Modern Table Lamp", brand: "Aura", price: 3200, originalPrice: 4000, rating: 4.4, category: "Home & Living", thumbnail: IMGS.lamp },
    ]);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showAddModal, setShowAddModal] = useState(false);

    // Form inputs
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [category, setCategory] = useState("Electronics");
    const [thumbnail, setThumbnail] = useState("");

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct: Product = {
            _id: `p${Date.now()}`,
            name,
            brand,
            price: Number(price),
            originalPrice: Number(originalPrice),
            rating: 5.0,
            category,
            thumbnail: thumbnail || IMGS.flatlay,
        };
        setProducts([newProduct, ...products]);
        setShowAddModal(false);
        // Reset form
        setName("");
        setBrand("");
        setPrice(0);
        setOriginalPrice(0);
        setCategory("Electronics");
        setThumbnail("");
    };

    const handleDeleteProduct = (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter(p => p._id !== id));
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
        const catName = typeof p.category === "string" ? p.category : p.category?.name || "";
        const matchesCategory = selectedCategory === "All" || catName.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Products Management</h1>
                    <p className="mt-1.5 text-sm text-gray-500">
                        View, add, edit, or delete items from your store.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 bg-[#2c1654] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2c1654]/90 transition-all duration-200 shadow-md shadow-[#2c1654]/10 cursor-pointer"
                >
                    <Plus className="h-5 w-5" /> Add Product
                </button>
            </div>

            {/* Filter Panel */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or brand..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]/30 bg-[#f8f7fc] transition-colors"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="text-sm bg-transparent outline-none cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Home & Living">Home & Living</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Price</th>
                                <th className="px-6 py-3 text-right">Original Price</th>
                                <th className="px-6 py-3 text-center">Rating</th>
                                <th className="px-6 py-3 text-right rounded-r-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => {
                                const catName = typeof product.category === "string" ? product.category : product.category?.name || "";
                                return (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.thumbnail ? (
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                                        <ImageIcon className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                                                    <div className="text-xs text-gray-400">{product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f5f0ff] text-[#2c1654]">
                                                {catName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">৳ {product.price.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right text-gray-400 line-through">৳ {product.originalPrice?.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-amber-500 font-bold">★</span> {product.rating}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                                                    <Edit className="h-4.5 w-4.5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="h-4.5 w-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#2c1654] text-white">
                            <h3 className="font-bold text-lg">Add New Product</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                    placeholder="Sony WH-1000XM5"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Brand</label>
                                    <input
                                        type="text"
                                        required
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                        placeholder="Sony"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                    >
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Home & Living">Home & Living</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Selling Price (৳)</label>
                                    <input
                                        type="number"
                                        required
                                        value={price || ""}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                        placeholder="28000"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Original Price (৳)</label>
                                    <input
                                        type="number"
                                        required
                                        value={originalPrice || ""}
                                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                        placeholder="38000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    value={thumbnail}
                                    onChange={(e) => setThumbnail(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-[#2c1654] text-white text-sm font-semibold hover:bg-[#2c1654]/90 transition-colors"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
