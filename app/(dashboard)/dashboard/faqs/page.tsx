"use client";

import React, { useState } from "react";
import { useGetAllFaqsQuery, useCreateFaqMutation, useDeleteFaqMutation } from "@/redux/features/faq/faqApi";
import { Plus, HelpCircle, Trash2 } from "lucide-react";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard";

export default function FaqsPage() {
    const { data: faqsData, refetch } = useGetAllFaqsQuery();
    const [createFaq] = useCreateFaqMutation();
    const [deleteFaq] = useDeleteFaqMutation();

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [category, setCategory] = useState("General");
    const [message, setMessage] = useState("");

    const faqs = faqsData?.data || [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (!question || !answer) { setMessage("Question and Answer are required."); return; }
        try {
            await createFaq({ question, answer, category }).unwrap();
            setMessage("FAQ created successfully!");
            setQuestion(""); setAnswer(""); refetch();
        } catch (err: any) { setMessage("Error: " + (err?.data?.message || err.message)); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;
        try { await deleteFaq(id).unwrap(); refetch(); }
        catch (err: any) { alert(err?.data?.message || "Failed to delete FAQ."); }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans">
            <DashboardPageHeader title="Frequently Asked Questions (FAQs)" subtitle="Configure Q&A help docs displayed in public user centers." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create FAQ Form */}
                <DashboardCard title="Add New FAQ" headerRight={<Plus className="h-5 w-5 text-[#2c1654]" />} className="h-fit">
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Question *</label>
                            <input type="text" placeholder="e.g. What is the shipping timeline?" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Answer *</label>
                            <textarea placeholder="Write the answer detail..." value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] h-24" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
                            <input type="text" placeholder="e.g. Shipping, Payments, Returns" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]" />
                        </div>
                        {message && <p className="text-xs text-[#c8960c] font-semibold">{message}</p>}
                        <button type="submit" className="w-full py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
                            <HelpCircle className="h-4 w-4" /> Save FAQ
                        </button>
                    </form>
                </DashboardCard>

                {/* FAQ List */}
                <DashboardCard title="Current Q&A Lists" className="lg:col-span-2">
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq._id} className="p-4 border border-gray-100 rounded-2xl bg-[#f8f7fc] relative group hover:border-[#2c1654]/30 transition-colors">
                                <span className="text-[10px] uppercase font-bold text-gray-400">{faq.category}</span>
                                <h3 className="font-bold text-sm text-gray-950 mt-1 pr-8">{faq.question}</h3>
                                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{faq.answer}</p>
                                <button onClick={() => handleDelete(faq._id)} className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {faqs.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No FAQ records added yet.</p>}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
