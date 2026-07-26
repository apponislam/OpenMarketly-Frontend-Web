"use client";

import React, { useState } from "react";
import {
    useGetAllPoliciesQuery,
    useCreateOrUpdatePolicyMutation,
    IPolicy,
} from "@/redux/features/policy/policyApi";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard";
import { ShieldCheck, Save, AlertCircle } from "lucide-react";

const POLICY_TYPES = [
    { label: "Privacy Policy", type: "PRIVACY_POLICY" },
    { label: "Terms & Conditions", type: "TERMS_AND_CONDITIONS" },
    { label: "Return Policy", type: "RETURN_POLICY" },
    { label: "Shipping Policy", type: "SHIPPING_POLICY" },
    { label: "Other", type: "OTHER" },
];

export default function PoliciesManagementPage() {
    const { data: policiesData, refetch } = useGetAllPoliciesQuery();
    const [createOrUpdate, { isLoading: isSaving }] = useCreateOrUpdatePolicyMutation();

    const [selectedType, setSelectedType] = useState<string>("PRIVACY_POLICY");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");

    const policies = policiesData?.data || [];

    const handleSelectType = (typeStr: string) => {
        setSelectedType(typeStr);
        setMessage("");
        const found = policies.find((p) => p.type === typeStr);
        if (found) {
            setTitle(found.title);
            setContent(found.content);
        } else {
            setTitle(POLICY_TYPES.find((t) => t.type === typeStr)?.label || "");
            setContent("");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!title || !content) {
            setMessage("Title and content are required.");
            return;
        }

        try {
            await createOrUpdate({
                type: selectedType as any,
                title,
                content,
                isActive: true,
            }).unwrap();
            setMessage("Policy saved successfully!");
            refetch();
        } catch (err: any) {
            setMessage("Error saving policy: " + (err?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans">
            <DashboardPageHeader
                title="Policy Documents Management"
                subtitle="Configure and update public privacy policy, terms, shipping & return policies."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Left Selector */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
                    <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider px-3 mb-2">Select Policy</h3>
                    {POLICY_TYPES.map((t) => {
                        const isActive = t.type === selectedType;
                        const existing = policies.find((p) => p.type === t.type);
                        return (
                            <button
                                key={t.type}
                                onClick={() => handleSelectType(t.type)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                                    isActive
                                        ? "bg-[#2c1654] text-white shadow-md shadow-[#2c1654]/10"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <span>{t.label}</span>
                                {existing && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                                        Configured
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Form */}
                <DashboardCard title={`Edit ${POLICY_TYPES.find((t) => t.type === selectedType)?.label}`} headerRight={<ShieldCheck className="h-5 w-5 text-[#2c1654]" />} className="lg:col-span-3">
                    <form onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Document Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654]"
                                placeholder="e.g. Privacy Policy"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Document Content (HTML / Markdown supported) *</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2c1654] h-80 font-mono"
                                placeholder="<h2>Section 1</h2><p>Policy content here...</p>"
                            />
                        </div>

                        {message && (
                            <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-xl flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
                        >
                            <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save & Publish Policy"}
                        </button>
                    </form>
                </DashboardCard>
            </div>
        </div>
    );
}
