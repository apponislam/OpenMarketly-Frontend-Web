"use client";

import React, { useState } from "react";
import { useGetVisitorStatsQuery } from "@/redux/features/visitor/visitorApi";
import { Eye, Users, Laptop, Smartphone, Calendar, TrendingUp, RefreshCw } from "lucide-react";
import { DashboardPageHeader, DashboardCard, StatCard } from "@/components/dashboard";

export default function VisitorAnalyticsPage() {
    const [days, setDays] = useState(30);
    const { data: statsResponse, isLoading, refetch, isFetching } = useGetVisitorStatsQuery({ days });

    const stats = statsResponse?.data;

    // Platform icons helper
    const getPlatformIcon = (platform: string) => {
        switch (platform.toUpperCase()) {
            case "WEB":
                return <Laptop className="w-4 h-4 text-blue-500" />;
            case "APP":
            case "ANDROID":
            case "IOS":
                return <Smartphone className="w-4 h-4 text-purple-500" />;
            default:
                return <Laptop className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-8 w-full font-sans pb-16">
            <DashboardPageHeader
                title="Visitor & Platform Analytics"
                subtitle="Live insights into user traffic, unique visitors, and device platform distributions."
                action={
                    <div className="flex items-center gap-3">
                        <select
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 outline-none focus:border-[#2c1654] cursor-pointer"
                        >
                            <option value={7}>Past 7 Days</option>
                            <option value={15}>Past 15 Days</option>
                            <option value={30}>Past 30 Days</option>
                            <option value={90}>Past 90 Days</option>
                        </select>
                        <button
                            onClick={() => refetch()}
                            disabled={isLoading || isFetching}
                            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-750 transition-colors disabled:opacity-50 cursor-pointer"
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                }
            />

            {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#c8960c] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : !stats ? (
                <div className="p-8 text-center bg-white border border-gray-100 rounded-2xl">
                    <p className="text-sm text-gray-500">Failed to load visitor analytics.</p>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            name="Today's Hits"
                            value={stats.todayTotalVisits.toLocaleString()}
                            change={`Web: ${stats.todayWebVisits} • App: ${stats.todayAppVisits}`}
                            icon={Eye}
                            color="bg-blue-500/10 text-blue-600"
                        />
                        <StatCard
                            name="Today's Unique Visitors"
                            value={stats.todayUniqueVisitors.toLocaleString()}
                            change={`Web: ${stats.todayWebUnique} • App: ${stats.todayAppUnique}`}
                            icon={Users}
                            color="bg-purple-500/10 text-purple-600"
                        />
                        <StatCard
                            name="All-Time Platform Hits"
                            value={stats.totalVisits.toLocaleString()}
                            change="Cumulative marketplace hits"
                            icon={TrendingUp}
                            color="bg-emerald-500/10 text-emerald-600"
                        />
                        <StatCard
                            name="All-Time Unique IP Records"
                            value={stats.totalUniqueVisitors.toLocaleString()}
                            change="Unique visitor profiles"
                            icon={Calendar}
                            color="bg-amber-500/10 text-amber-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Device Platform Breakdown Card */}
                        <DashboardCard title="Today vs All-Time Platform Distribution" className="lg:col-span-1 h-full">
                            <div className="space-y-6">
                                {Object.entries(stats.todayPlatformBreakdown).map(([platform, todayVal]) => {
                                    const allTimeVal = stats.allTimePlatformBreakdown[platform] || { visits: 0, unique: 0 };
                                    const totalHits = stats.todayTotalVisits || 1;
                                    const percentage = Math.round((todayVal.visits / totalHits) * 100);

                                    return (
                                        <div key={platform} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                                                    {getPlatformIcon(platform)}
                                                    {platform}
                                                </div>
                                                <span className="text-xs font-semibold text-[#2c1654]">{percentage}% of today</span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-[#2c1654] h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>

                                            <div className="flex justify-between text-[11px] text-gray-500 pt-0.5">
                                                <span>Today: {todayVal.visits} hits ({todayVal.unique} unique)</span>
                                                <span>All-Time: {allTimeVal.visits} hits</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </DashboardCard>

                        {/* Daily Visitor Trend Card */}
                        <DashboardCard title={`Visitor Traffic Trend (Past ${days} Days)`} className="lg:col-span-2">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-500">
                                    <thead className="bg-[#f8f7fc] text-gray-700 text-xs uppercase font-medium">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-xl">Date</th>
                                            <th className="px-4 py-3">Total Hits</th>
                                            <th className="px-4 py-3">Unique Visitors</th>
                                            <th className="px-4 py-3">Web Traffic</th>
                                            <th className="px-4 py-3 rounded-r-xl">App Traffic</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[...stats.dailyTrend].reverse().map((day) => (
                                            <tr key={day.date} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-4 py-3 font-semibold text-gray-900">
                                                    {new Date(day.date).toLocaleDateString("en-US", {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 font-bold text-gray-950">
                                                    {day.totalVisits.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    {day.uniqueVisitors.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500">
                                                    {day.webVisits} ({day.webUnique} unique)
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500">
                                                    {day.appVisits} ({day.appUnique} unique)
                                                </td>
                                            </tr>
                                        ))}
                                        {stats.dailyTrend.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                                                    No visitor records found for this period.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </DashboardCard>
                    </div>
                </>
            )}
        </div>
    );
}
