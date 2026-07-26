"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
    useGetAllProductsQuery,
    useGetMyProductsQuery,
    useDeleteProductMutation,
    IProduct,
} from "@/redux/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Plus, Edit, Trash2, Filter, Image as ImageIcon } from "lucide-react";
import { DashboardPageHeader, DashboardTable, SearchInput, StatusBadge } from "@/components/dashboard";

export default function ProductsManagement() {
    const router = useRouter();
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    const { data: adminData } = useGetAllProductsQuery(undefined, { skip: !isAdmin });
    const { data: sellerData, refetch: refetchSeller } = useGetMyProductsQuery(undefined, { skip: isAdmin });
    const { data: categoriesData } = useGetAllCategoriesQuery();
    const [deleteProduct] = useDeleteProductMutation();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = categoriesData?.data || [];
    const products: IProduct[] = isAdmin ? adminData?.data || [] : sellerData?.data || [];

    const handleDeleteProduct = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id).unwrap();
                if (!isAdmin) refetchSeller();
            } catch (err: any) {
                alert(err?.data?.message || "Failed to delete product.");
            }
        }
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
        const catName = typeof p.category === "string" ? p.category : p.category?.name || "";
        const matchesCategory =
            selectedCategory === "All" || catName.toLowerCase() === selectedCategory.toLowerCase() || (typeof p.category === "object" && p.category?._id === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Products Management"
                subtitle="View, add, edit, or delete items from your store."
                action={
                    user?.role === "SELLER" ? (
                        <button
                            onClick={() => router.push("/dashboard/products/create")}
                            className="flex items-center justify-center gap-2 bg-[#2c1654] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#2c1654]/90 transition-all duration-200 shadow-md shadow-[#2c1654]/10 cursor-pointer text-sm"
                        >
                            <Plus className="h-4.5 w-4.5 text-amber-400" /> Create New Product
                        </button>
                    ) : undefined
                }
            />

            {/* Filter Panel */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <SearchInput value={search} onChange={setSearch} placeholder="Search by name or brand..." className="w-full md:w-80" />
                <div className="flex gap-3 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-sm bg-transparent outline-none cursor-pointer">
                            <option value="All">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DashboardTable
                headers={["Product", "Category", "Selling Price", "Original Price", "Stock", "Status", "Actions"]}
                headerAligns={["left", "left", "right", "right", "center", "center", "right"]}
                isEmpty={filteredProducts.length === 0}
                emptyMessage="No products match your search query."
            >
                {filteredProducts.map((product) => {
                    const catName = typeof product.category === "string" ? product.category : product.category?.name || "General";
                    return (
                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {product.thumbnail ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={product.thumbnail} alt={product.name} className="h-12 w-12 rounded-xl object-cover border border-gray-100" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center border border-gray-100">
                                            <ImageIcon className="h-5 w-5 text-[#2c1654]" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                                        <div className="text-xs text-gray-400">{product.brand || "Generic"} {product.sku && `• SKU: ${product.sku}`}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f5f0ff] text-[#2c1654]">{catName}</span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-gray-900">৳ {product.price?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-gray-400 line-through">
                                {product.originalPrice ? `৳ ${product.originalPrice.toLocaleString()}` : "-"}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-gray-800">{product.stockQuantity ?? 0}</td>
                            <td className="px-6 py-4 text-center">
                                <StatusBadge status={product.approvalStatus || "APPROVED"} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => router.push(`/dashboard/products/edit/${product._id}`)}
                                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                        title="Edit product"
                                    >
                                        <Edit className="h-4.5 w-4.5 text-[#2c1654]" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                        title="Delete product"
                                    >
                                        <Trash2 className="h-4.5 w-4.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </DashboardTable>
        </div>
    );
}
