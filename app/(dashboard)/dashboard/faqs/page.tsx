"use client";

import React, { useState } from "react";
import {
    useGetAllFaqsQuery,
    useCreateFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
    IFaq,
} from "@/redux/features/faq/faqApi";
import { Plus, HelpCircle, Trash2, Edit, X, Save, Search } from "lucide-react";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard";
import { useLazyLoad } from "@/utils/lazyLoad";

export default function FaqsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data: faqsData, isFetching, refetch } = useGetAllFaqsQuery({
        page,
        limit: 10,
        search: search.trim() || undefined,
    });

    const {
        items: allFaqs,
        totalCount,
        hasNextPage,
        loadMoreRef,
        reset,
    } = useLazyLoad<IFaq>({
        data: faqsData?.data,
        meta: faqsData?.meta,
        isFetching,
        searchQuery: search,
        page,
        onPageChange: setPage,
    });

    const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
    const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
    const [deleteFaq] = useDeleteFaqMutation();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [category, setCategory] = useState("General");
    const [message, setMessage] = useState("");

    const handleRefresh = () => {
        refetch();
    };

    const handleStartEdit = (faq: IFaq) => {
        setEditingId(faq._id);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setCategory(faq.category || "General");
        setMessage("");
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setQuestion("");
        setAnswer("");
        setCategory("General");
        setMessage("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (!question.trim() || !answer.trim()) {
            setMessage("Question and Answer are required.");
            return;
        }

        try {
            if (editingId) {
                await updateFaq({
                    id: editingId,
                    body: { question: question.trim(), answer: answer.trim(), category: category.trim() || "General" },
                }).unwrap();
                setMessage("FAQ updated successfully!");
                handleCancelEdit();
            } else {
                await createFaq({
                    question: question.trim(),
                    answer: answer.trim(),
                    category: category.trim() || "General",
                }).unwrap();
                setMessage("FAQ created successfully!");
                setQuestion("");
                setAnswer("");
                setCategory("General");
            }
            handleRefresh();
        } catch (err: any) {
            setMessage("Error: " + (err?.data?.message || err.message));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;
        try {
            await deleteFaq(id).unwrap();
            if (editingId === id) handleCancelEdit();
            handleRefresh();
        } catch (err: any) {
            alert(err?.data?.message || "Failed to delete FAQ.");
        }
    };

    return (
        <div className="space-y-8 container mx-auto font-sans pb-16">
            <DashboardPageHeader
                title="Frequently Asked Questions (FAQs)"
                subtitle="Configure Q&A help docs displayed in public user centers."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add / Edit FAQ Form */}
                <DashboardCard
                    title={editingId ? "Edit FAQ Item" : "Add New FAQ"}
                    headerRight={
                        editingId ? (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                                title="Cancel editing"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        ) : (
                            <Plus className="h-5 w-5 text-[#2c1654]" />
                        )
                    }
                    className="h-fit sticky top-6"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Question *</label>
                            <input
                                type="text"
                                placeholder="e.g. What is the shipping timeline?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Answer *</label>
                            <textarea
                                placeholder="Write the answer detail..."
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] h-28"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Shipping, Payments, Returns"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                        {message && (
                            <p className={`text-xs font-semibold ${message.startsWith("Error") ? "text-red-600" : "text-emerald-700"}`}>
                                {message}
                            </p>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="flex-1 py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {editingId ? <Save className="h-4 w-4 text-amber-400" /> : <HelpCircle className="h-4 w-4" />}
                                {editingId ? (isUpdating ? "Saving Changes..." : "Update FAQ") : (isCreating ? "Adding..." : "Save FAQ")}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-3 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </DashboardCard>

                {/* FAQ List Card with Fixed Height & Scroll Container */}
                <DashboardCard
                    title="Current Q&A Lists"
                    headerRight={
                        <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                            Showing {allFaqs.length} of {totalCount} FAQs
                        </span>
                    }
                    className="lg:col-span-2 space-y-4"
                >
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Filter questions by keyword or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[#f8f7fc] border border-purple-100 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                        />
                    </div>

                    {/* Q&A List Container (Full Height, No Scrollbar) */}
                    <div className="space-y-3.5">
                        {allFaqs.map((faq) => (
                            <div
                                key={faq._id}
                                className={`p-4 border rounded-2xl relative group transition-all ${
                                    editingId === faq._id
                                        ? "bg-purple-50/80 border-[#2c1654] shadow-sm"
                                        : "bg-[#f8f7fc] border-gray-100 hover:border-[#2c1654]/30"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] uppercase font-bold text-[#2c1654] bg-purple-100 px-2 py-0.5 rounded-md">
                                        {faq.category || "General"}
                                    </span>

                                    {/* Action Buttons: Edit & Delete */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleStartEdit(faq)}
                                            className="p-1.5 text-gray-600 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
                                            title="Edit FAQ"
                                        >
                                            <Edit className="h-4 w-4 text-[#2c1654]" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(faq._id)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            title="Delete FAQ"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-bold text-sm text-gray-950 mt-2 pr-4">{faq.question}</h3>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}

                        {!isFetching && allFaqs.length === 0 && (
                            <p className="text-sm text-gray-400 py-12 text-center">No matching FAQ records found.</p>
                        )}

                        {/* Infinite Scroll Sentinel (Listens to window scroll since card container is not scrollable) */}
                        {hasNextPage && (
                            <div ref={loadMoreRef} className="py-4 text-center">
                                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2c1654] bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 animate-pulse">
                                    <div className="w-2 h-2 rounded-full bg-[#2c1654] animate-ping" />
                                    {isFetching ? "Loading more Q&A items..." : "Scroll for more Q&A..."}
                                </div>
                            </div>
                        )}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
