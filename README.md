# OpenMarketly Frontend (Web)

A modern, high-performance web frontend for **OpenMarketly**, a comprehensive e-commerce marketplace platform. Built on Next.js 15, React 19, and Tailwind CSS.

## 🚀 Features

- **Responsive Header & Navigation:** Elegant logo, fully-functional sticky search bar, navigation actions, and scrollable category navigation bar.
- **Dynamic Homepage:** Autoplay hero banner showcase, browse categories grid, countdown timer for active deals, trending products section, why-choose-us cards, and newsletter subscribe form.
- **Catalog/Shop Page:** Category filtering, product grid layouts, and multi-option sort parameters (Featured, Price: Low to High, Price: High to Low, Best Rating).
- **Interactive Product Details:** Image gallery zoom/carousel selection, product details, stock indicators, color/size variants selection, and a tabbed details layout (Description, Specifications, Reviews, Shipping & Returns).
- **Interactive Cart & Checkout:** Slide-out Shopping Cart sidebar, quantity modifier, coupon input, and simulated direct checkout integration with SSLCommerz.




## 🛠️ Getting Started

### 1. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5066
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### 4. Build for Production
```bash
npm run build
```
