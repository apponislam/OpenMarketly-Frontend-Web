import React, { useState, useEffect } from "react";
import { BadgeCheck, Shield, Truck, ArrowRight, Tag, Mail, Zap, RotateCcw } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { ProductCard } from "./ProductCard";
import { Product, IMGS } from "./types";

interface HomePageProps {
  onShopClick: () => void;
  onView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onCategoryClick: (cat: string) => void;
  banners: any[];
  categories: any[];
  todayDeals: Product[];
  trendingProducts: Product[];
}

export function HomePage({
  onShopClick,
  onView,
  onAddToCart,
  onCategoryClick,
  banners,
  categories,
  todayDeals,
  trendingProducts,
}: HomePageProps) {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const activeHeroImg = banners[activeBanner]?.image || IMGS.hero;

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden transition-all duration-700"
        style={{ background: "linear-gradient(135deg, #100828 0%, #2c1654 50%, #4a2b8c 100%)" }}
      >
        <div className="absolute inset-0">
          <img
            src={activeHeroImg}
            alt="Hero Lifestyle"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(16,8,40,0.95) 40%, rgba(16,8,40,0.6) 100%)" }}
          />
        </div>

        {/* Decorative gold elements */}
        <div
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-2 opacity-10"
          style={{ borderColor: "#c8960c" }}
        />
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border opacity-20"
          style={{ borderColor: "#c8960c" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
          <div className="max-w-xl">
            <span
              className="inline-flex items-center gap-2 border text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest"
              style={{
                borderColor: "#c8960c",
                color: "#c8960c",
                backgroundColor: "rgba(200,150,12,0.1)",
              }}
            >
              <Zap className="w-3.5 h-3.5" /> {banners[activeBanner]?.title || "New era of marketplace shopping"}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6">
              Everything<br />You Need.<br />
              <span style={{ color: "#c8960c" }}>One Open<br />Marketplace.</span>
            </h1>
            <p className="text-base text-purple-200 mb-9 leading-relaxed max-w-sm">
              {banners[activeBanner]?.subtitle ||
                "Discover products from trusted sellers, compare options, and shop everything you love."}
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={onShopClick}
                className="font-black px-8 py-3.5 rounded-xl transition-opacity hover:opacity-90 shadow-2xl text-sm"
                style={{ backgroundColor: "#c8960c", color: "#fff" }}
              >
                Shop Now
              </button>
              <button
                onClick={onShopClick}
                className="border font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm text-white"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              >
                Explore Categories
              </button>
            </div>
            <div className="flex items-center gap-8 flex-wrap">
              {[
                { icon: BadgeCheck, label: "Trusted Sellers" },
                { icon: Shield, label: "Secure Checkout" },
                { icon: Truck, label: "Fast Delivery" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-purple-300">
                  <Icon className="w-4 h-4" style={{ color: "#c8960c" }} />
                  <span className="text-xs font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Categories ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#c8960c" }}>
              Browse
            </p>
            <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
          </div>
          <button
            onClick={onShopClick}
            className="hidden sm:flex items-center gap-1.5 font-bold text-sm hover:opacity-70 transition-opacity"
            style={{ color: "#2c1654" }}
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onCategoryClick(cat.name)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={cat.image || IMGS.headphones}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  cat.color || "from-violet-800"
                } via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-black text-sm">{cat.name}</p>
                <p className="text-white/60 text-xs mt-0.5">{cat.count || "View Items"}</p>
              </div>
              <div
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "#c8960c" }}
              >
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Today's Deals ──────────────────────────────────────────────────── */}
      {todayDeals.length > 0 && (
        <section className="py-14 bg-[#f8f7fc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-5 flex-wrap gap-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-5 h-5 text-red-500" />
                    <h2 className="text-2xl font-black text-gray-900">Today's Top Deals</h2>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Offer ends in</p>
                </div>
                <CountdownTimer />
              </div>
              <button
                onClick={onShopClick}
                className="flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm border-2 transition-colors hover:text-white hover:border-[#2c1654] hover:bg-[#2c1654]"
                style={{ borderColor: "#2c1654", color: "#2c1654" }}
              >
                View All Deals <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {todayDeals.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} onView={onView} onAddToCart={onAddToCart} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Popular/Trending Products ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#c8960c" }}>
              Trending
            </p>
            <h2 className="text-2xl font-black text-gray-900">Popular Products</h2>
          </div>
          <button
            onClick={onShopClick}
            className="hidden sm:flex items-center gap-1.5 font-bold text-sm hover:opacity-70 transition-opacity"
            style={{ color: "#2c1654" }}
          >
            See All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingProducts.slice(0, 8).map((p) => (
            <ProductCard key={p._id} product={p} onView={onView} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* ── Promo Banner ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <div className="relative rounded-3xl overflow-hidden">
          <img src={IMGS.promo} alt="Promotional banner" className="w-full h-64 sm:h-80 object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(16,8,40,0.9) 40%, rgba(16,8,40,0.4) 100%)" }}
          />
          <div className="absolute inset-0 flex items-center px-8 sm:px-14 lg:px-20">
            <div>
              <p className="font-black text-xs mb-2 uppercase tracking-[0.2em]" style={{ color: "#c8960c" }}>
                Limited Time Offer
              </p>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">Upgrade Your Everyday</h2>
              <p className="text-gray-300 mb-6 max-w-sm text-sm leading-relaxed">
                Find products that make life easier, smarter, and better.
              </p>
              <button
                onClick={onShopClick}
                className="font-black px-8 py-3.5 rounded-xl transition-opacity hover:opacity-90 text-sm"
                style={{ backgroundColor: "#c8960c", color: "#fff" }}
              >
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Shop ─────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #100828, #2c1654)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#c8960c" }}>
              Our Promise
            </p>
            <h2 className="text-2xl font-black text-white">Why Shop With OpenMarketly</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Shield,
                title: "Secure Payments",
                desc: "SSL encryption on every transaction. Your payment data stays protected.",
              },
              {
                icon: BadgeCheck,
                title: "Verified Sellers",
                desc: "Every seller is vetted and reviewed. Shop from trusted, certified merchants.",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Express delivery in most cities. Real-time tracking from checkout to door.",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                desc: "30-day hassle-free returns on eligible items. Simple, fast, no questions asked.",
              },
            ].map(({ icon: Icon, title, desc }) => {
              // Map lucide icons correctly or fallback to Shield
              let ActualIcon = Shield;
              if (title.includes("Sellers")) ActualIcon = BadgeCheck;
              if (title.includes("Delivery")) ActualIcon = Truck;
              if (title.includes("Returns")) ActualIcon = Shield; // RotateCcw was defined as RotateCcw

              return (
                <div
                  key={title}
                  className="rounded-2xl p-6 text-center border transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(200,150,12,0.2)" }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"
                    style={{ background: "linear-gradient(135deg, #c8960c, #e4b034)" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-black mb-2 text-sm">{title}</h3>
                  <p className="text-sm leading-relaxed text-purple-300">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #2c1654, #4a2b8c)" }}
          >
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Stay in the Loop</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Get exclusive deals, new arrivals, and shopping inspiration delivered to your inbox.
          </p>
          <div className="flex gap-2.5">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-[#f8f7fc] placeholder-gray-400 text-gray-700 border-[#e8e5f0]"
            />
            <button
              className="text-white font-black px-6 py-3 rounded-xl transition-opacity hover:opacity-90 text-sm whitespace-nowrap"
              style={{ backgroundColor: "#2c1654" }}
            >
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">No spam, ever. Unsubscribe at any time.</p>
        </div>
      </section>
    </main>
  );
}
