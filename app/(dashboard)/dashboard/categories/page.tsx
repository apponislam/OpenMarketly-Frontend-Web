"use client";

import React, { useState } from "react";
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    ICategory,
    getParentId,
} from "@/redux/features/category/categoryApi";
import { DashboardPageHeader, SearchInput } from "@/components/dashboard";
import {
    FolderTree,
    Folder,
    Plus,
    Edit,
    Trash2,
    Save,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    ChevronRight,
    CornerDownRight,
    Tag,
    X,
} from "lucide-react";

export default function CategoriesPage() {
    const { data: categoriesData, refetch } = useGetAllCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [search, setSearch] = useState("");
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [parentCategory, setParentCategory] = useState<string>("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const categories = categoriesData?.data || [];

    // Root categories (level 0 - where parentCategory is null or undefined)
    const rootCategories = categories.filter((c) => getParentId(c) === null);

    // Get direct children of a given parentId
    const getChildrenOf = (parentId: string) =>
        categories.filter((c) => getParentId(c) === parentId);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOpenCreateModal = (presetParentId?: string) => {
        setEditingCategory(null);
        setName("");
        setParentCategory(presetParentId || "");
        setDescription("");
        setImage("");
        setImagePreview("");
        setStatusMsg(null);
        setShowModal(true);
    };

    const handleEditClick = (cat: ICategory) => {
        setEditingCategory(cat);
        setName(cat.name);
        setParentCategory(getParentId(cat) || "");
        setDescription(cat.description || "");
        setImage(cat.image || "");
        setImagePreview(cat.image || "");
        setStatusMsg(null);
        setShowModal(true);
    };

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

            setTimeout(() => {
                setShowModal(false);
                refetch();
            }, 1000);
        } catch (err: any) {
            setStatusMsg({ type: "error", text: err?.data?.message || err?.message || "Failed to save category." });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}" and all its nested subcategories?`)) {
            try {
                await deleteCategory(id).unwrap();
                refetch();
            } catch (err: any) {
                alert(err?.data?.message || "Failed to delete category.");
            }
        }
    };

    // Recursive helper to render options for parent category dropdown in modal
    const renderCategorySelectOptions = (parentId: string | null = null, depth: number = 0): React.ReactNode[] => {
        const children = categories.filter((c) => getParentId(c) === parentId);
        let options: React.ReactNode[] = [];

        children.forEach((cat) => {
            if (editingCategory && cat._id === editingCategory._id) return;

            const prefix = "— ".repeat(depth);
            options.push(
                <option key={cat._id} value={cat._id}>
                    {prefix} {depth === 0 ? "📁 " : "📂 "} {cat.name}
                </option>
            );

            const subOptions = renderCategorySelectOptions(cat._id, depth + 1);
            options = options.concat(subOptions);
        });

        return options;
    };

    // Filter categories for search
    const filteredRoots = rootCategories.filter((root) => {
        if (!search.trim()) return true;

        const isMatchRecursive = (cat: ICategory): boolean => {
            if (cat.name.toLowerCase().includes(search.toLowerCase())) return true;
            const children = getChildrenOf(cat._id);
            return children.some(isMatchRecursive);
        };

        return isMatchRecursive(root);
    });

    return (
        <div className="space-y-8 w-full font-sans pb-12">
            <DashboardPageHeader
                title="Multi-Level Nested Categories"
                subtitle="Manage infinite-level parent & subcategory hierarchies across your marketplace."
                action={
                    <button
                        onClick={() => handleOpenCreateModal()}
                        className="flex items-center justify-center gap-2 bg-[#2c1654] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#3d2073] transition-all cursor-pointer text-xs shadow-md shadow-[#2c1654]/10"
                    >
                        <Plus className="h-4 w-4 text-amber-400" /> Create Root Category
                    </button>
                }
            />

            {/* Search Bar & Summary Pills */}
            <div className="bg-white p-5 rounded-3xl border border-purple-100/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Search any category level..." className="w-full sm:w-80" />
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <span className="bg-purple-50 text-[#2c1654] px-3.5 py-1.5 rounded-xl border border-purple-100">
                        📁 {rootCategories.length} Main Root Categories
                    </span>
                    <span className="bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-xl border border-amber-200">
                        📂 {categories.length - rootCategories.length} Multi-Level Subcategories
                    </span>
                </div>
            </div>

            {/* Recursive Multi-Level Category Tree List */}
            <div className="space-y-4">
                {filteredRoots.map((root) => (
                    <CategoryTreeNode
                        key={root._id}
                        category={root}
                        allCategories={categories}
                        depth={0}
                        expandedIds={expandedIds}
                        onToggleExpand={toggleExpand}
                        onAddSubcategory={handleOpenCreateModal}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                    />
                ))}

                {filteredRoots.length === 0 && (
                    <div className="bg-white rounded-3xl p-12 text-center border border-purple-100/80 shadow-sm space-y-3">
                        <FolderTree className="w-10 h-10 text-gray-300 mx-auto" />
                        <h4 className="font-bold text-gray-800 text-base">No Categories Found</h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                            Get started by clicking &quot;Create Root Category&quot; above to add your first top-level product category.
                        </p>
                    </div>
                )}
            </div>

            {/* Create & Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-purple-50 flex justify-between items-center bg-[#2c1654] text-white">
                            <div className="flex items-center gap-2">
                                <FolderTree className="w-5 h-5 text-amber-400" />
                                <h3 className="font-bold text-base">
                                    {editingCategory ? "Edit Category Details" : "Create New Category"}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                    placeholder="e.g. Wireless Headphones"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Parent Category (Multi-Level Hierarchy)
                                </label>
                                <select
                                    value={parentCategory}
                                    onChange={(e) => setParentCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                                >
                                    <option value="">-- Top-Level Root Category --</option>
                                    {renderCategorySelectOptions()}
                                </select>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Select any category level to nest under it infinitely.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Describe the items listed in this category..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2c1654]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Category Icon / Photo
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl border border-purple-100 overflow-hidden bg-purple-50 flex items-center justify-center shrink-0">
                                        {imagePreview ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-purple-400" />
                                        )}
                                    </div>
                                    <label className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#2c1654] font-bold text-xs rounded-xl cursor-pointer transition-colors">
                                        Choose File
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-purple-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="px-5 py-2.5 bg-[#2c1654] hover:bg-[#3d2073] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 text-amber-400" />
                                    {editingCategory ? (isUpdating ? "Saving..." : "Save Changes") : isCreating ? "Creating..." : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// === Recursive Category Tree Node Component ===
interface CategoryTreeNodeProps {
    category: ICategory;
    allCategories: ICategory[];
    depth: number;
    expandedIds: Record<string, boolean>;
    onToggleExpand: (id: string) => void;
    onAddSubcategory: (parentId: string) => void;
    onEdit: (cat: ICategory) => void;
    onDelete: (id: string, name: string) => void;
}

function CategoryTreeNode({
    category,
    allCategories,
    depth,
    expandedIds,
    onToggleExpand,
    onAddSubcategory,
    onEdit,
    onDelete,
}: CategoryTreeNodeProps) {
    const children = allCategories.filter((c) => getParentId(c) === category._id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds[category._id] ?? false;
    const isRoot = depth === 0;

    return (
        <div
            className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                isRoot
                    ? "bg-white border-purple-100/80 shadow-sm"
                    : "bg-[#faf9fc] border-purple-100/50 mt-2"
            }`}
            style={{ marginLeft: depth > 0 ? `${Math.min(depth * 20, 80)}px` : "0px" }}
        >
            {/* Category Row Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4 border-b border-purple-50/50">
                <div className="flex items-center gap-3">
                    {depth > 0 && <CornerDownRight className="w-4 h-4 text-purple-400 shrink-0" />}

                    {hasChildren ? (
                        <button
                            onClick={() => onToggleExpand(category._id)}
                            className="p-1.5 rounded-xl hover:bg-purple-100/60 text-[#2c1654] transition-colors cursor-pointer"
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    ) : (
                        <div className="w-4 h-4" />
                    )}

                    {category.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={category.image} alt={category.name} className="w-10 h-10 rounded-xl object-cover border border-purple-100 shrink-0" />
                    ) : (
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                                isRoot ? "bg-[#2c1654] text-amber-400" : "bg-purple-100 text-[#2c1654]"
                            }`}
                        >
                            {isRoot ? <Folder className="w-5 h-5" /> : <Tag className="w-4 h-4" />}
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base text-gray-900">{category.name}</h3>
                            <span
                                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                    isRoot
                                        ? "bg-amber-100 text-amber-800 border-amber-200"
                                        : "bg-purple-100 text-[#2c1654] border-purple-200"
                                }`}
                            >
                                Level {depth} {isRoot ? "(Root)" : "Subcategory"}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Slug: <span className="font-mono text-purple-900">{category.slug}</span>
                            {hasChildren && ` • ${children.length} direct subcategories`}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => onAddSubcategory(category._id)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#2c1654] font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        title="Add Subcategory under this category"
                    >
                        <Plus className="w-3.5 h-3.5 text-amber-500" />
                        <span className="hidden sm:inline">Add Child</span>
                    </button>
                    <button
                        onClick={() => onEdit(category)}
                        className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Edit Category"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(category._id, category.name)}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Category"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Recursive Children Render */}
            {hasChildren && isExpanded && (
                <div className="p-3 bg-[#f8f7fc] space-y-2 border-t border-purple-50">
                    {children.map((child) => (
                        <CategoryTreeNode
                            key={child._id}
                            category={child}
                            allCategories={allCategories}
                            depth={depth + 1}
                            expandedIds={expandedIds}
                            onToggleExpand={onToggleExpand}
                            onAddSubcategory={onAddSubcategory}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
