"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { 
    useAddToCartMutation, 
    useGetMyCartQuery, 
    useUpdateCartItemQuantityMutation, 
    useRemoveFromCartMutation 
} from "@/redux/features/cart/cartApi";
import { useToggleWishlistMutation } from "@/redux/features/wishlist/wishlistApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

// Public layout components
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";

import { 
    Search, 
    SlidersHorizontal, 
    ChevronDown, 
    Star, 
    Heart, 
    ShoppingCart, 
    Grid, 
    List, 
    ArrowUpDown, 
    Check, 
    X,
    Loader2
} from "lucide-react";

export default function ShopPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const user = useAppSelector(currentUser);

    // Initial search values from query params
    const initialSearch = searchParams.get("search") || "";
    const initialCategory = searchParams.get("category") || "";

    // Filters state
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [limit] = useState(12);

    // Sidebar filter visibility on mobile
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Update state if URL query params change
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setCategory(searchParams.get("category") || "");
    }, [searchParams]);

    // Redux Queries
    const { data: categoriesData } = useGetAllCategoriesQuery();
    const { data: productsData, isLoading, isFetching } = useGetAllProductsQuery({
        search: search || undefined,
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
        page,
        limit,
    });

    const { data: cartData } = useGetMyCartQuery(undefined, { skip: !user });
    const [addToCart] = useAddToCartMutation();
    const [updateCartQty] = useUpdateCartItemQuantityMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [toggleWishlist] = useToggleWishlistMutation();

    const categories = categoriesData?.data || [];
    const products = productsData?.data || [];
    const meta = productsData?.meta;

    const cartItems = cartData?.data?.items || [];
    const cartCount = cartData?.data?.totalQuantity || 0;

    const handleClearFilters = () => {
        setSearch("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("createdAt");
        setSortOrder("desc");
        setPage(1);
        router.push("/shop");
    };

    const handleAddToCart = async (productId: string) => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        try {
            await addToCart({ productId, quantity: 1 }).unwrap();
            alert("Added to cart successfully!");
        } catch (err: any) {
            alert(err?.data?.message || "Failed to add to cart");
        }
    };

    const handleToggleWishlist = async (productId: string) => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
        try {
            const res = await toggleWishlist({ productId }).unwrap();
            alert(res.data.isWishlisted ? "Added to wishlist!" : "Removed from wishlist!");
        } catch (err: any) {
            alert(err?.data?.message || "Failed to update wishlist");
        }
    };

    const handleUpdateCartQty = async (productId: string, color: string, size: string, qty: number) => {
        try {
            await updateCartQty({ productId, color, size, quantity: qty }).unwrap();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemoveCartItem = async (productId: string, color: string, size: string) => {
        try {
            await removeFromCart({ productId, color, size }).unwrap();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to remove item");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f7fc] text-[#0d0a1a] flex flex-col justify-between font-sans">
            <div>
                {/* Announcement & Navigation bar */}
                <AnnouncementBar />
                <Header 
                    onLogoClick={() => router.push("/")}
                    cartCount={cartCount}
                    onCartOpen={() => setIsCartOpen(true)}
                    onShopClick={() => router.push("/shop")}
                    searchQuery={search}
                    setSearchQuery={setSearch}
                />
                <CategoryNav 
                    activeCategory={category ? categories.find(c => c._id === category)?.name || "All" : "All"} 
                    onCategoryClick={(catName) => {
                        if (catName === "All Categories" || catName === "All") {
                            setCategory("");
                        } else {
                            const found = categories.find(c => c.name === catName);
                            if (found) setCategory(found._id);
                        }
                    }} 
                />

                {/* Main Content wrapper */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
                    
                    {/* Breadcrumbs & Product Count */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100/50 pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                <span className="hover:text-[#2c1654] cursor-pointer transition-colors" onClick={() => router.push("/")}>Home</span>
                                <span>/</span>
                                <span className="hover:text-[#2c1654] cursor-pointer transition-colors" onClick={handleClearFilters}>Shop</span>
                                <span>/</span>
                                <span className="text-[#2c1654] font-black">All Products</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 mt-1">
                                {meta?.total || 0} products found
                            </p>
                        </div>
                    </div>

                    {/* Shop Grid View */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        
                        {/* Desktop Sidebar Filters */}
                        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-purple-100/50 shadow-sm space-y-6 sticky top-24">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h2 className="font-bold text-base flex items-center gap-2">
                                    <SlidersHorizontal className="h-5 w-5 text-[#2c1654]" /> Filters
                                </h2>
                                <button 
                                    onClick={handleClearFilters}
                                    className="text-xs text-amber-600 hover:text-amber-700 font-bold hover:underline cursor-pointer"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] bg-[#f8f7fc]"
                                    />
                                </div>
                            </div>

                            {/* Categories List */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                    <button
                                        onClick={() => setCategory("")}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                                            category === ""
                                                ? "bg-[#2c1654] text-white font-bold"
                                                : "hover:bg-purple-50 text-gray-700"
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat._id}
                                            onClick={() => setCategory(cat._id)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer flex justify-between items-center ${
                                                category === cat._id
                                                    ? "bg-[#2c1654] text-white font-bold"
                                                    : "hover:bg-purple-50 text-gray-700"
                                            }`}
                                        >
                                            <span className="truncate">{cat.name}</span>
                                            {category === cat._id && <Check className="h-4 w-4 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range (BDT)</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] bg-[#f8f7fc]"
                                    />
                                    <span className="text-gray-400 text-xs">to</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] bg-[#f8f7fc]"
                                    />
                                </div>
                            </div>
                        </aside>

                        {/* Products Grid & Controls */}
                        <div className="lg:col-span-3 space-y-6">
                            
                            {/* Top controls (Sort and mobile filter triggers) */}
                            <div className="bg-white p-4 rounded-2xl border border-purple-100/50 shadow-sm flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setShowMobileFilters(true)}
                                        className="lg:hidden p-2.5 bg-[#f8f7fc] border border-purple-100 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                                    >
                                        <SlidersHorizontal className="h-4 w-4" /> Filters
                                    </button>
                                </div>

                                {/* Sort Selector */}
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                                    <select
                                        value={`${sortBy}:${sortOrder}`}
                                        onChange={(e) => {
                                            const [by, order] = e.target.value.split(":");
                                            setSortBy(by);
                                            setSortOrder(order as any);
                                        }}
                                        className="bg-[#f8f7fc] border border-purple-100 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] cursor-pointer font-medium"
                                    >
                                        <option value="createdAt:desc">Newest First</option>
                                        <option value="price:asc">Price: Low to High</option>
                                        <option value="price:desc">Price: High to Low</option>
                                        <option value="name:asc">Name: A to Z</option>
                                    </select>
                                </div>
                            </div>

                            {/* Loading / Fetching states */}
                            {isLoading || isFetching ? (
                                <div className="min-h-[400px] bg-white rounded-3xl border border-purple-100/50 flex flex-col items-center justify-center space-y-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-[#2c1654]" />
                                    <span className="text-sm font-semibold text-gray-500">Loading catalog...</span>
                                </div>
                            ) : products.length > 0 ? (
                                /* Products Grid */
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {products.map((product) => {
                                        const discount = product.discountPercentage || 0;
                                        return (
                                            <div 
                                                key={product._id} 
                                                className="bg-white border border-purple-100/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative flex flex-col justify-between"
                                            >
                                                {/* Image container */}
                                                <div className="relative aspect-square bg-purple-50/50 overflow-hidden">
                                                    {product.thumbnail ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img 
                                                            src={product.thumbnail} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-purple-200">
                                                            <Grid className="h-12 w-12" />
                                                        </div>
                                                    )}

                                                    {/* Discount tag */}
                                                    {discount > 0 && (
                                                        <span className="absolute top-3 left-3 bg-[#c8960c] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            {discount}% Off
                                                        </span>
                                                    )}

                                                    {/* Wishlist Button */}
                                                    <button
                                                        onClick={() => handleToggleWishlist(product._id)}
                                                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 rounded-full shadow transition-all duration-200 cursor-pointer"
                                                    >
                                                        <Heart className="h-4.5 w-4.5 fill-current" />
                                                    </button>
                                                </div>

                                                {/* Details */}
                                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                                    <div className="space-y-1.5">
                                                        <span className="text-[10px] uppercase font-bold text-[#c8960c]">
                                                            {product.category?.name || "Product"}
                                                        </span>
                                                        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug hover:text-[#2c1654] transition-colors cursor-pointer">
                                                            {product.name}
                                                        </h3>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {/* Price */}
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-base font-black text-gray-900">৳{product.price}</span>
                                                            {product.originalPrice && product.originalPrice > product.price && (
                                                                <span className="text-xs text-gray-400 line-through">৳{product.originalPrice}</span>
                                                            )}
                                                        </div>

                                                        {/* Add to Cart button */}
                                                        <button
                                                            onClick={() => handleAddToCart(product._id)}
                                                            className="w-full py-2.5 bg-[#f8f7fc] hover:bg-[#2c1654] border border-purple-100 hover:border-transparent text-gray-700 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer group/btn"
                                                        >
                                                            <ShoppingCart className="h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform" />
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* Empty Catalog */
                                <div className="min-h-[400px] bg-white rounded-3xl border border-purple-100/50 flex flex-col items-center justify-center space-y-3 p-6 text-center">
                                    <Search className="h-12 w-12 text-gray-300" />
                                    <h3 className="font-bold text-lg text-gray-800">No Products Found</h3>
                                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                                        We couldn't find any items matching your selected criteria. Try adjusting filters or search queries.
                                    </p>
                                    <button 
                                        onClick={handleClearFilters}
                                        className="px-5 py-2.5 bg-[#2c1654] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                                    >
                                        Reset Catalog
                                    </button>
                                </div>
                            )}

                            {/* Pagination */}
                            {meta && meta.totalPage > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-4">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="px-4 py-2 border border-purple-100 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                p === page
                                                    ? "bg-[#2c1654] text-white shadow"
                                                    : "bg-white border border-purple-100 text-gray-700 hover:bg-purple-50"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        disabled={page === meta.totalPage}
                                        onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
                                        className="px-4 py-2 border border-purple-100 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* Public Page Footer */}
            <Footer onLogoClick={() => router.push("/")} />

            {/* Cart Drawer */}
            <CartSidebar 
                open={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems as any}
                onUpdateQty={handleUpdateCartQty}
                onRemove={handleRemoveCartItem}
                onCheckout={() => router.push("/checkout")}
            />

            {/* Mobile Filters Drawer Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="relative flex flex-col w-full max-w-xs bg-white h-full p-6 shadow-2xl ml-auto animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                            <h2 className="font-bold text-base flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5 text-[#2c1654]" /> Filter Options
                            </h2>
                            <button 
                                onClick={() => setShowMobileFilters(false)}
                                className="p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                            {/* Search Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] bg-[#f8f7fc]"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => { setCategory(""); setShowMobileFilters(false); }}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                                            category === "" ? "bg-[#2c1654] text-white" : "hover:bg-purple-50 text-gray-700"
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat._id}
                                            onClick={() => { setCategory(cat._id); setShowMobileFilters(false); }}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex justify-between items-center ${
                                                category === cat._id ? "bg-[#2c1654] text-white" : "hover:bg-purple-50 text-gray-700"
                                            }`}
                                        >
                                            <span className="truncate">{cat.name}</span>
                                            {category === cat._id && <Check className="h-3.5 w-3.5 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm bg-[#f8f7fc]"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm bg-[#f8f7fc]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 gap-3 flex">
                            <button
                                onClick={handleClearFilters}
                                className="w-full py-2.5 border border-purple-100 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full py-2.5 bg-[#2c1654] text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
