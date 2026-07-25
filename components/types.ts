export interface Product {
  _id: string;
  id?: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  discount?: number; // fallback
  rating: number;
  reviews?: number; // fallback
  thumbnail?: string;
  image?: string; // fallback
  images?: string[];
  badge?: string;
  category: { _id?: string; name: string } | string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  isTodayDeal?: boolean;
  isTrending?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

export const IMGS = {
  hero: "https://images.unsplash.com/photo-1771768477964-fd70c615ceab?w=1400&h=800&fit=crop&auto=format",
  headphones: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop&auto=format",
  headphones2: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&auto=format",
  headphones3: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop&auto=format",
  watch: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&auto=format",
  watch2: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop&auto=format",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&auto=format",
  shoes2: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop&auto=format",
  backpack: "https://images.unsplash.com/photo-1603920347917-d16487c88db4?w=600&h=600&fit=crop&auto=format",
  coffee: "https://images.unsplash.com/photo-1707241358597-bafcc8a8e73d?w=600&h=600&fit=crop&auto=format",
  skincare: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&h=600&fit=crop&auto=format",
  lamp: "https://images.unsplash.com/photo-1766411503489-c6fe7b008bd6?w=600&h=600&fit=crop&auto=format",
  promo: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=1400&h=500&fit=crop&auto=format",
  flatlay: "https://images.unsplash.com/photo-1604632254231-004e0f122067?w=600&h=600&fit=crop&auto=format",
};

export const MOCK_CATEGORIES = [
  { name: "Electronics", count: "12,400+", image: IMGS.headphones, color: "from-violet-800" },
  { name: "Fashion", count: "28,000+", image: IMGS.shoes, color: "from-rose-700" },
  { name: "Home & Living", count: "9,200+", image: IMGS.lamp, color: "from-amber-700" },
  { name: "Beauty", count: "7,800+", image: IMGS.skincare, color: "from-pink-700" },
  { name: "Sports", count: "6,100+", image: IMGS.shoes2, color: "from-emerald-800" },
  { name: "Grocery", count: "15,000+", image: IMGS.coffee, color: "from-orange-700" },
  { name: "Accessories", count: "11,300+", image: IMGS.flatlay, color: "from-purple-800" },
  { name: "Travel & Bags", count: "4,200+", image: IMGS.backpack, color: "from-slate-700" },
];

export const NAV_CATS = ["All Categories", "Electronics", "Fashion", "Beauty", "Home & Living", "Grocery", "Sports", "Accessories", "Deals"];
