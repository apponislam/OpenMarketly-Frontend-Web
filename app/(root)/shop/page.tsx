"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import {
    useAddToCartMutation,
    useGetMyCartQuery,
    useUpdateCartItemQuantityMutation,
    useRemoveFromCartMutation,
} from "@/redux/features/cart/cartApi";
import { useToggleWishlistMutation } from "@/redux/features/wishlist/wishlistApi";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

// Layout components
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";

// Shop components
import { ShopBanner } from "@/components/shop/ShopBanner";
import { ShopFilterSidebar } from "@/components/shop/ShopFilterSidebar";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import { ShopSortBar } from "@/components/shop/ShopSortBar";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { ShopPagination } from "@/components/shop/ShopPagination";

export default function ShopPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const user = useAppSelector(currentUser);

    // Filter state
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(1);
    const [limit] = useState(12);

    // UI state
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Sync URL params
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setCategory(searchParams.get("category") || "");
    }, [searchParams]);

    // Data queries
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

    // Mutations
    const [addToCart] = useAddToCartMutation();
    const [updateCartQty] = useUpdateCartItemQuantityMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [toggleWishlist] = useToggleWishlistMutation();

    // Derived data
    const categories = categoriesData?.data || [];
    const products = productsData?.data || [];
    const meta = productsData?.meta;
    const cartItems = cartData?.data?.items || [];
    const cartCount = cartData?.data?.totalQuantity || 0;

    // Handlers
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
        if (!user) { router.push("/auth/login"); return; }
        try {
            await addToCart({ productId, quantity: 1 }).unwrap();
            alert("Added to cart successfully!");
        } catch (err: any) {
            alert(err?.data?.message || "Failed to add to cart");
        }
    };

    const handleToggleWishlist = async (productId: string) => {
        if (!user) { router.push("/auth/login"); return; }
        try {
            const res = await toggleWishlist({ productId }).unwrap();
            alert(res.data.isWishlisted ? "Added to wishlist!" : "Removed from wishlist!");
        } catch (err: any) {
            alert(err?.data?.message || "Failed to update wishlist");
        }
    };

    const handleUpdateCartQty = async (productId: string, color: string, size: string, qty: number) => {
        try { await updateCartQty({ productId, color, size, quantity: qty }).unwrap(); }
        catch (err: any) { alert(err?.data?.message || "Failed to update quantity"); }
    };

    const handleRemoveCartItem = async (productId: string, color: string, size: string) => {
        try { await removeFromCart({ productId, color, size }).unwrap(); }
        catch (err: any) { alert(err?.data?.message || "Failed to remove item"); }
    };

    const handleSortChange = (by: string, order: "asc" | "desc") => {
        setSortBy(by);
        setSortOrder(order);
    };

    const handleCategoryNav = (catName: string) => {
        if (catName === "All Categories" || catName === "All") {
            setCategory("");
        } else {
            const found = categories.find((c) => c.name === catName);
            if (found) setCategory(found._id);
        }
    };

    // Shared filter props for desktop sidebar and mobile drawer
    const filterProps = {
        search,
        onSearchChange: setSearch,
        categories,
        selectedCategory: category,
        onCategoryChange: setCategory,
        minPrice,
        maxPrice,
        onMinPriceChange: setMinPrice,
        onMaxPriceChange: setMaxPrice,
        onClearAll: handleClearFilters,
    };

    return (
        <div className="min-h-screen bg-[#f8f7fc] text-[#0d0a1a] flex flex-col justify-between font-sans">
            <div>
                {/* Global navigation */}
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
                    activeCategory={category ? categories.find((c) => c._id === category)?.name || "All" : "All"}
                    onCategoryClick={handleCategoryNav}
                />

                {/* Shop banner with breadcrumbs */}
                <ShopBanner totalProducts={meta?.total || 0} onHomeClick={() => router.push("/")} />

                {/* Main content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        {/* Desktop sidebar */}
                        <ShopFilterSidebar {...filterProps} />

                        {/* Products column */}
                        <div className="lg:col-span-3 space-y-6">
                            <ShopSortBar
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSortChange={handleSortChange}
                                onOpenMobileFilters={() => setShowMobileFilters(true)}
                            />

                            <ShopProductGrid
                                products={products}
                                isLoading={isLoading || isFetching}
                                onAddToCart={handleAddToCart}
                                onToggleWishlist={handleToggleWishlist}
                                onClearFilters={handleClearFilters}
                            />

                            <ShopPagination
                                currentPage={page}
                                totalPages={meta?.totalPages || 1}
                                onPageChange={setPage}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer onLogoClick={() => router.push("/")} />

            {/* Cart drawer */}
            <CartSidebar
                open={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems as any}
                onUpdateQty={handleUpdateCartQty}
                onRemove={handleRemoveCartItem}
                onCheckout={() => router.push("/checkout")}
            />

            {/* Mobile filter drawer */}
            <MobileFilterDrawer
                open={showMobileFilters}
                onClose={() => setShowMobileFilters(false)}
                {...filterProps}
            />
        </div>
    );
}
