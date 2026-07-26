"use client";

import React, { useState, useEffect } from "react";
import { useGetAllPoliciesQuery, useCreateOrUpdatePolicyMutation } from "@/redux/features/policy/policyApi";
import { DashboardPageHeader, DashboardCard, JoditEditorWrapper } from "@/components/dashboard";
import { ShieldCheck, Save, AlertCircle, Eye, Edit3 } from "lucide-react";

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
    const [title, setTitle] = useState("Privacy Policy");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

    const policies = policiesData?.data || [];

    // Sync content when policies load or selected type changes
    useEffect(() => {
        const found = policies.find((p) => p.type === selectedType);
        if (found) {
            setTitle(found.title);
            setContent(found.content);
        } else {
            setTitle(POLICY_TYPES.find((t) => t.type === selectedType)?.label || "");
            setContent("");
        }
    }, [selectedType, policiesData]);

    const handleSelectType = (typeStr: string) => {
        setSelectedType(typeStr);
        setMessage("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!title.trim() || !content.trim()) {
            setMessage("Error: Title and document content are required.");
            return;
        }

        try {
            await createOrUpdate({
                type: selectedType as any,
                title: title.trim(),
                content,
                isActive: true,
            }).unwrap();
            setMessage("Policy document saved & published successfully!");
            refetch();
        } catch (err: any) {
            setMessage("Error saving policy: " + (err?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-8 container mx-auto font-sans pb-16">
            <DashboardPageHeader
                title="Policy Documents Management"
                subtitle="Configure and update public privacy policy, terms, shipping & return policies."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Left Policy Type Selector Sidebar */}
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
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                            isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                                        }`}
                                    >
                                        Configured
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Policy Form Card */}
                <DashboardCard
                    title={`Edit ${POLICY_TYPES.find((t) => t.type === selectedType)?.label}`}
                    headerRight={
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTab("edit")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "edit" ? "bg-[#2c1654] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("preview")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeTab === "preview" ? "bg-[#2c1654] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <Eye className="w-3.5 h-3.5" /> Preview
                            </button>
                        </div>
                    }
                    className="lg:col-span-3 space-y-5"
                >
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

                        {activeTab === "edit" ? (
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Document Content (WYSIWYG Editor) *
                                </label>
                                <JoditEditorWrapper
                                    key={selectedType}
                                    value={content}
                                    onBlur={(newContent) => setContent(newContent)}
                                    placeholder="Type policy document content here..."
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-gray-600">Document Live Preview</label>
                                <div className="p-6 border border-gray-200 rounded-2xl bg-[#f8f7fc] min-h-[380px] jodit-wysiwyg-content">
                                    {content ? (
                                        <div dangerouslySetInnerHTML={{ __html: content }} />
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No content written yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {message && (
                            <p
                                className={`text-sm font-semibold p-3 rounded-xl flex items-center gap-2 ${
                                    message.startsWith("Error")
                                        ? "text-red-600 bg-red-50"
                                        : "text-emerald-600 bg-emerald-50"
                                }`}
                            >
                                <AlertCircle className="h-4 w-4" /> {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-3 bg-[#2c1654] text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save & Publish Policy"}
                        </button>
                    </form>
                </DashboardCard>
            </div>
        </div>
    );
}
