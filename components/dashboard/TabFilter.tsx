"use client";

import React from "react";

interface TabFilterProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function TabFilter({ tabs, activeTab, onTabChange }: TabFilterProps) {
    return (
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        activeTab === tab
                            ? "bg-[#2c1654] text-white shadow-md shadow-[#2c1654]/10"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
