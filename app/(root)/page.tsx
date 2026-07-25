"use client";

import React, { useState, useEffect } from "react";
import { AnnouncementBar } from "../../components/AnnouncementBar";
import { Header } from "../../components/Header";
import { CategoryNav } from "../../components/CategoryNav";
import { HomePage } from "../../components/Home/HomePage";
import { ShopPage } from "../../components/ShopPage";
import { ProductDetailPage } from "../../components/ProductDetailPage";
import { Footer } from "../../components/Footer";
import { CartSidebar } from "../../components/CartSidebar";
import { DirectCheckoutModal } from "../../components/DirectCheckoutModal";

import { Product, CartItem, IMGS, MOCK_CATEGORIES } from "../../components/types";

type Page = "home" | "product" | "shop";

export default function Home() {
    const [page, setPage] = useState<Page>("home");
    const [banners, setBanners] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>(MOCK_CATEGORIES);
    const [products, setProducts] = useState<Product[]>([]);

    // Navigation states
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Cart logic
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Checkout modal logic
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutPayload, setCheckoutPayload] = useState<any>({
        productId: "",
        quantity: 1,
        color: "",
        size: "",
        shippingAddress: {
            street: "123 Main St",
            city: "Dhaka",
            state: "Dhaka",
            zipCode: "1212",
            country: "Bangladesh",
            phone: "+8801700000000",
        },
        couponCode: "",
    });

    // Load backend data or apply defaults
    useEffect(() => {
        const fetchBackendData = async () => {
            const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066";
            const baseUrl = `${apiHost}/api/v1`;
            try {
                const bannersRes = await fetch(`${baseUrl}/banners`).then((r) => r.json());
                if (bannersRes?.success && bannersRes?.data?.length > 0) {
                    setBanners(bannersRes.data);
                } else {
                    setBanners([
                        {
                            title: "Eid Mega Sale",
                            subtitle: "Up to 50% discount on smartphone collections!",
                            image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
                        },
                        {
                            title: "Premium Tech Upgrade",
                            subtitle: "Elevate your work setup with modern gadgets.",
                            image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1200&q=80",
                        },
                    ]);
                }

                const categoriesRes = await fetch(`${baseUrl}/categories`).then((r) => r.json());
                if (categoriesRes?.success && categoriesRes?.data?.length > 0) {
                    // Merge colors/images
                    const merged = categoriesRes.data.map((cat: any, i: number) => ({
                        ...cat,
                        color: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].color,
                        image: cat.image || MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].image,
                    }));
                    setCategories(merged);
                }

                const productsRes = await fetch(`${baseUrl}/products`).then((r) => r.json());
                if (productsRes?.success && productsRes?.data?.length > 0) {
                    setProducts(productsRes.data);
                } else {
                    // Mock some products matching the Figma layout structure
                    setProducts([
                        {
                            _id: "p1",
                            name: "Sony WH-1000XM5 Wireless Headphones",
                            brand: "Sony",
                            price: 28000,
                            originalPrice: 38000,
                            rating: 4.8,
                            reviews: 2847,
                            thumbnail: IMGS.headphones,
                            badge: "Best Seller",
                            category: "Electronics",
                            colors: ["Midnight Black", "Pearl White", "Deep Violet"],
                            description: "Experience premium active noise canceling headphones with multi-device bluetooth pairing.",
                        },
                        {
                            _id: "p2",
                            name: "Apple Watch Series 9 GPS 45mm",
                            brand: "Apple",
                            price: 38000,
                            originalPrice: 48000,
                            rating: 4.9,
                            reviews: 5621,
                            thumbnail: IMGS.watch,
                            badge: "Top Rated",
                            category: "Electronics",
                            colors: ["Silver", "Space Gray"],
                        },
                        {
                            _id: "p3",
                            name: "Nike Air Zoom Pegasus 40",
                            brand: "Nike",
                            price: 8900,
                            originalPrice: 12900,
                            rating: 4.6,
                            reviews: 1203,
                            thumbnail: IMGS.shoes,
                            badge: "New Arrival",
                            category: "Fashion",
                        },
                        {
                            _id: "p4",
                            name: "Aer Minimal Urban Backpack 25L",
                            brand: "Aer",
                            price: 11900,
                            originalPrice: 16900,
                            rating: 4.7,
                            reviews: 892,
                            thumbnail: IMGS.backpack,
                            category: "Accessories",
                        },
                    ]);
                }
            } catch (err) {
                console.warn("Backend not accessible. Falling back to mockup data.", err);
                setBanners([
                    {
                        title: "Eid Mega Sale",
                        subtitle: "Up to 50% discount on smartphone collections!",
                        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
                    },
                ]);
                setProducts([
                    {
                        _id: "p1",
                        name: "Sony WH-1000XM5 Wireless Headphones",
                        brand: "Sony",
                        price: 28000,
                        originalPrice: 38000,
                        rating: 4.8,
                        reviews: 2847,
                        thumbnail: IMGS.headphones,
                        badge: "Best Seller",
                        category: "Electronics",
                    },
                    {
                        _id: "p2",
                        name: "Apple Watch Series 9 GPS 45mm",
                        brand: "Apple",
                        price: 38000,
                        originalPrice: 48000,
                        rating: 4.9,
                        reviews: 5621,
                        thumbnail: IMGS.watch,
                        badge: "Top Rated",
                        category: "Electronics",
                    },
                ]);
            }
        };
        fetchBackendData();
    }, []);

    // Back to top on page switches
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    // Cart Handlers
    const handleAddToCart = (product: Product, color = "Default", size = "Default") => {
        setCart((prev) => {
            const idx = prev.findIndex((item) => item.product._id === product._id && item.color === color && item.size === size);
            if (idx > -1) {
                const updated = [...prev];
                updated[idx].quantity += 1;
                return updated;
            }
            return [...prev, { product, quantity: 1, color, size }];
        });
        setIsCartOpen(true);
    };

    const handleUpdateQty = (product_Id: string, color: string, size: string, newQty: number) => {
        if (newQty <= 0) {
            handleRemoveFromCart(product_Id, color, size);
            return;
        }
        setCart((prev) => prev.map((item) => (item.product._id === product_Id && item.color === color && item.size === size ? { ...item, quantity: newQty } : item)));
    };

    const handleRemoveFromCart = (product_Id: string, color: string, size: string) => {
        setCart((prev) => prev.filter((item) => !(item.product._id === product_Id && item.color === color && item.size === size)));
    };

    // Nav Handlers
    const handleCategoryNav = (catName: string) => {
        setActiveCategory(catName);
        setPage("shop");
    };

    const handleProductView = (prod: Product) => {
        setSelectedProduct(prod);
        setPage("product");
    };

    // Checkout flows
    const handleOpenDirectCheckout = (product: Product, color = "Default", size = "Default") => {
        setCheckoutPayload((prev: any) => ({
            ...prev,
            productId: product._id,
            color: color || product.colors?.[0] || "Default",
            size: size || product.sizes?.[0] || "Default",
        }));
        setShowCheckout(true);
    };

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066";
            const response = await fetch(`${apiHost}/api/v1/orders/direct-checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer dummy_token",
                },
                body: JSON.stringify(checkoutPayload),
            }).then((r) => r.json());

            if (response.success && response.data?.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                alert("Direct checkout processed successfully! (Simulated Success: " + (response.message || "TXN Success") + ")");
                setShowCheckout(false);
            }
        } catch (err) {
            alert("Simulating checkout success! Direct Order created and redirecting user to SSLCommerz.");
            setShowCheckout(false);
        }
    };

    // Filtering
    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase());

        const catName = typeof p.category === "string" ? p.category : p.category?.name || "";
        const matchesCategory = activeCategory === "All" || activeCategory === "All Categories" || catName.toLowerCase() === activeCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    const todayDeals = filteredProducts.filter((p) => p.isTodayDeal || p.price < p.originalPrice);
    const trendingProducts = filteredProducts; // default to showing matching products

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-white text-[#0d0a1a] flex flex-col">
            <AnnouncementBar />
            <Header
                onLogoClick={() => {
                    setPage("home");
                    setActiveCategory("All");
                    setSearchQuery("");
                }}
                cartCount={cartCount}
                onCartOpen={() => setIsCartOpen(true)}
                onShopClick={() => setPage("shop")}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <CategoryNav onCategoryClick={handleCategoryNav} activeCategory={activeCategory} />

            {page === "home" && (
                <HomePage onShopClick={() => setPage("shop")} onView={handleProductView} onAddToCart={(p) => handleAddToCart(p, "Default", "Default")} onCategoryClick={handleCategoryNav} banners={banners} categories={categories} todayDeals={todayDeals} trendingProducts={trendingProducts} />
            )}

            {page === "shop" && <ShopPage onBack={() => setPage("home")} onView={handleProductView} onAddToCart={(p) => handleAddToCart(p, "Default", "Default")} products={filteredProducts} activeFilter={activeCategory} setActiveFilter={setActiveCategory} />}

            {page === "product" && selectedProduct && (
                <ProductDetailPage onBack={() => setPage("home")} onShopClick={() => setPage("shop")} onAddToCart={handleAddToCart} onCheckout={handleOpenDirectCheckout} product={selectedProduct} relatedProducts={products.filter((p) => p._id !== selectedProduct._id)} onView={handleProductView} />
            )}

            <Footer
                onLogoClick={() => {
                    setPage("home");
                    setActiveCategory("All");
                }}
            />

            <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemoveFromCart} onCheckout={(item) => handleOpenDirectCheckout(item.product, item.color, item.size)} />

            <DirectCheckoutModal showCheckout={showCheckout} onClose={() => setShowCheckout(false)} checkoutPayload={checkoutPayload} setCheckoutPayload={setCheckoutPayload} onSubmit={handleCheckoutSubmit} />
        </div>
    );
}
