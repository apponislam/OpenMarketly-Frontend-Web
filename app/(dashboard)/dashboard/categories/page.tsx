"use client";

import React, { useState } from "react";
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    ICategory,
} from "@/redux/features/category/categoryApi";
import { DashboardPageHeader, DashboardCard, SearchInput } from "@/components/dashboard";
import { FolderTree, Edit, Trash2, Save, Image as ImageIcon, CheckCircle2, AlertCircle, CornerDownRight, Layers } from "lucide-react";

export default function CategoriesPage() {
    const { data: categoriesData, refetch } = useGetAllCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [search, setSearch] = useState("");
    const [filterParentId, setFilterParentId] = useState<string>("ALL");
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState<string>("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const categories = categoriesData?.data || [];

    // Filter potential parent categories (exclude the current editing category to prevent self-parent loops)
    const availableParents = categories.filter(
        (c) => !editingCategory || c._id !== editingCategory._id
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const res = reader.result as string;
                setImagePreview(res);
                setImage(res);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = (cat: ICategory) => {
        setEditingCategory(cat);
        setName(cat.name);
        setParentCategory(
            typeof cat.parentCategory === "object" && cat.parentCategory?._id
                ? cat.parentCategory._id
                : typeof cat.parentCategory === "string"
                ? cat.parentCategory
                : ""
        );
        setDescription(cat.description || "");
        setImage(cat.image || "");
        setImagePreview(cat.image || "");
        setStatusMsg(null);
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setName("");
        setParentCategory("");
        setDescription("");
        setImage("");
        setImagePreview("");
        setStatusMsg(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMsg(null);

        if (!name.trim()) {
            setStatusMsg({ type: "error", text: "Category name is required." });
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory({
                    id: editingCategory._id,
                    body: {
                        name: name.trim(),
                        parentCategory: parentCategory ? (parentCategory as any) : null,
                        description: description.trim() || undefined,
                        image: image || undefined,
                    },
                }).unwrap();
                setStatusMsg({ type: "success", text: "Category updated successfully!" });
            } else {
                await createCategory({
                    name: name.trim(),
                    parentCategory: parentCategory ? (parentCategory as any) : undefined,
                    description: description.trim() || undefined,
                    image: image || undefined,
                }).unwrap();
                setStatusMsg({ type: "success", text: "Category created successfully!" });
            }

            handleCancelEdit();
            refetch();
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err?.data?.message || err?.message || "Failed to save category." });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this category and all its nested subcategories?")) {
            try {
                await deleteCategory(id).unwrap();
                refetch();
            } catch (err: any) {
                alert(err?.data?.message || "Failed to delete category.");
            }
        }
    };

    // Filter categories
    const filteredCategories = categories.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

        let matchesParent = true;
        const parentId =
            typeof c.parentCategory === "object" && c.parentCategory?._id
                ? c.parentCategory._id
                : typeof c.parentCategory === "string"
                ? c.parentCategory
                : null;

        if (filterParentId === "ROOT_ONLY") {
            matchesParent = !parentId;
        } else if (filterParentId !== "ALL") {
            matchesParent = parentId === filterParentId;
        }

        return matchesSearch && matchesParent;
    });

    return (
        <div className="space-y-8 w-full font-sans">
            <DashboardPageHeader
                title="Nested Categories Management"
                subtitle="Create, edit, and organize root categories and subcategories across your marketplace."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Create / Edit Category Form */}
                <DashboardCard
                    title={editingCategory ? "Edit Category" : "Add Category"}
                    headerRight={<FolderTree className="h-5 w-5 text-[#2c1654]" />}
                    className="h-fit"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {statusMsg && (
                            <div
                                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                                    statusMsg.type === "success"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                            >
                                {statusMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                <span>{statusMsg.text}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Electronics or Headphones"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        {/* Parent Category Selection for Nested Structure */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Parent Category (Optional for Nested Subcategory)
                            </label>
                            <select
                                value={parentCategory}
                                onChange={(e) => setParentCategory(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            >
                                <option value="">-- Main Root Category (Top Level) --</option>
                                {availableParents.map((parent) => (
                                    <option key={parent._id} value={parent._id}>
                                        📁 {parent.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">
                                Leave blank to create a main root category, or choose a parent to create a nested subcategory.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Description
                            </label>
                            <textarea
                                placeholder="Short description of products in this category..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                Category Photo
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                                    {imagePreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imagePreview} alt="Category" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                <label className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#2c1654] font-bold text-xs rounded-xl cursor-pointer transition-colors">
                                    Upload Image
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="pt-2 flex items-center gap-3">
                            {editingCategory && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="w-1/3 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="w-full py-2.5 bg-[#2c1654] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Save className="h-4 w-4 text-amber-400" />
                                {editingCategory ? (isUpdating ? "Updating..." : "Update Category") : isCreating ? "Creating..." : "Save Category"}
                            </button>
                        </div>
                    </form>
                </DashboardCard>

                {/* Categories Table List */}
                <DashboardCard
                    title="Category Hierarchy List"
                    headerRight={
                        <div className="flex items-center gap-3">
                            <select
                                value={filterParentId}
                                onChange={(e) => setFilterParentId(e.target.value)}
                                className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none cursor-pointer"
                            >
                                <option value="ALL">All Categories</option>
                                <option value="ROOT_ONLY">Root Categories Only</option>
                                {categories.map((parent) => (
                                    <option key={parent._id} value={parent._id}>
                                        Subcategories of {parent.name}
                                    </option>
                                ))}
                            </select>
                            <SearchInput value={search} onChange={setSearch} placeholder="Search..." className="w-48" />
                        </div>
                    }
                    className="lg:col-span-2"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-xl">Category Name</th>
                                    <th className="px-4 py-3">Hierarchy / Parent</th>
                                    <th className="px-4 py-3">Slug</th>
                                    <th className="px-4 py-3 text-right rounded-r-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCategories.map((cat) => {
                                    const parentObj = typeof cat.parentCategory === "object" ? cat.parentCategory : null;
                                    const parentName = parentObj?.name;
                                    const isSubcategory = !!cat.parentCategory;

                                    return (
                                        <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {cat.image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-xl object-cover border border-gray-100" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#2c1654]">
                                                            <FolderTree className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1.5">
                                                        {isSubcategory && <CornerDownRight className="w-4 h-4 text-purple-400 shrink-0" />}
                                                        <span className="font-bold text-gray-900">{cat.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {isSubcategory ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#2c1654] border border-purple-100">
                                                        <Layers className="w-3 h-3 text-[#c8960c]" />
                                                        Subcategory {parentName ? `of ${parentName}` : ""}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                        Main Root Category
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-purple-900 font-mono">{cat.slug}</td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(cat)}
                                                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                                        title="Edit category"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat._id)}
                                                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Delete category"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                                            No categories match the filter criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
