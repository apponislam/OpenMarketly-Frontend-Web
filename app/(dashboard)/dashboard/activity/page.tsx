"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
    useGetAllActivityLogsQuery,
    IActivityLog,
} from "@/redux/features/activity/activityApi";
import {
    History,
    Clock,
    Globe,
    Shield,
    Search,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Activity as ActivityIcon,
    User,
    SlidersHorizontal,
    Loader2,
} from "lucide-react";
import { DashboardPageHeader, DashboardCard } from "@/components/dashboard";

export default function ActivityPage() {
    const user = useAppSelector(currentUser);
    const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

    // View Mode: "pagination" vs "infiniteScroll"
    const [viewMode, setViewMode] = useState<"pagination" | "infiniteScroll">("pagination");

    // Filter & Pagination States
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Accumulated logs for infinite scroll mode
    const [accumulatedLogs, setAccumulatedLogs] = useState<IActivityLog[]>([]);

    // Query Params
    const queryParams: Record<string, any> = {
        page,
        limit,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(actionFilter ? { action: actionFilter } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
    };

    // RTK Query call
    const { data: activityRes, isLoading, isFetching } = useGetAllActivityLogsQuery(queryParams);

    const newLogs: IActivityLog[] = activityRes?.data || [];
    const meta = activityRes?.meta;
    const totalPages = meta?.totalPages ?? 1;
    const hasNext = meta?.hasNext ?? (page < totalPages);
    const hasPrev = meta?.hasPrev ?? (page > 1);

    // Accumulate logs when in infiniteScroll mode
    useEffect(() => {
        if (viewMode === "infiniteScroll" && newLogs.length > 0) {
            if (page === 1) {
                setAccumulatedLogs(newLogs);
            } else {
                setAccumulatedLogs((prev) => {
                    const existingIds = new Set(prev.map((item) => item._id));
                    const freshItems = newLogs.filter((item) => !existingIds.has(item._id));
                    return [...prev, ...freshItems];
                });
            }
        }
    }, [newLogs, page, viewMode]);

    // Scroll Listener on Dashboard `<main>` Container for Infinite Scroll
    useEffect(() => {
        if (viewMode !== "infiniteScroll") return;

        const mainContainer = document.querySelector("main");
        if (!mainContainer) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = mainContainer;
            if (scrollTop + clientHeight >= scrollHeight - 300) {
                if (!isFetching && hasNext) {
                    setPage((prev) => prev + 1);
                }
            }
        };

        mainContainer.addEventListener("scroll", handleScroll);
        return () => mainContainer.removeEventListener("scroll", handleScroll);
    }, [isFetching, hasNext, viewMode]);

    const handleFilterChange = (setter: (val: string) => void, val: string) => {
        setter(val);
        setPage(1);
        setAccumulatedLogs([]);
    };

    const handleClearFilters = () => {
        setSearch("");
        setActionFilter("");
        setStartDate("");
        setEndDate("");
        setPage(1);
        setAccumulatedLogs([]);
    };

    const logsToDisplay = viewMode === "infiniteScroll" ? accumulatedLogs : newLogs;

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
            <DashboardPageHeader
                title="Activity Audit Logs"
                subtitle={
                    isAdmin
                        ? "Real-time security audit trail of administrative, vendor, and user actions."
                        : "Security audit log of your account activity, logins, and order events."
                }
            />

            {/* Filter & View Mode Controls Toolbar */}
            <div className="bg-white p-5 rounded-3xl border border-purple-100/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-purple-50 pb-3">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-[#2c1654]" />
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Log Display Mode</span>
                    </div>

                    {/* Mode Selector Tabs */}
                    <div className="flex items-center gap-2 bg-[#f8f7fc] p-1 rounded-2xl border border-purple-100">
                        <button
                            type="button"
                            onClick={() => {
                                setViewMode("pagination");
                                setPage(1);
                            }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                viewMode === "pagination"
                                    ? "bg-[#2c1654] text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Numbered Pages
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setViewMode("infiniteScroll");
                                setPage(1);
                                setAccumulatedLogs([]);
                            }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                viewMode === "infiniteScroll"
                                    ? "bg-[#2c1654] text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Infinite Scroll (Lazy)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by action, details or keywords..."
                            value={search}
                            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                        />
                    </div>

                    {/* Action Filter */}
                    <div className="relative">
                        <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                            value={actionFilter}
                            onChange={(e) => handleFilterChange(setActionFilter, e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#2c1654] cursor-pointer"
                        >
                            <option value="">All Action Types</option>
                            <optgroup label="Auth & Account">
                                <option value="REGISTER">Register Account</option>
                                <option value="LOGIN">User Login</option>
                                <option value="LOGOUT">User Logout</option>
                                <option value="PASSWORD_CHANGE">Password Change</option>
                                <option value="PROFILE_UPDATE">Profile Update</option>
                            </optgroup>
                            <optgroup label="Products & Categories">
                                <option value="PRODUCT_CREATE">Product Created</option>
                                <option value="PRODUCT_UPDATE">Product Updated</option>
                                <option value="PRODUCT_DELETE">Product Deleted</option>
                                <option value="CATEGORY_CREATE">Category Created</option>
                                <option value="CATEGORY_UPDATE">Category Updated</option>
                                <option value="CATEGORY_DELETE">Category Deleted</option>
                            </optgroup>
                            <optgroup label="Orders & Payments">
                                <option value="ORDER_PLACE">Order Placed</option>
                                <option value="ORDER_STATUS_UPDATE">Order Status Update</option>
                                <option value="PAYMENT_SUCCESS">Payment Success</option>
                                <option value="PAYMENT_FAIL">Payment Failed</option>
                            </optgroup>
                            <optgroup label="Wishlist & Cart">
                                <option value="WISHLIST_ADD">Wishlist Add</option>
                                <option value="WISHLIST_REMOVE">Wishlist Remove</option>
                                <option value="CART_SYNC">Cart Sync</option>
                                <option value="CART_CLEAR">Cart Clear</option>
                            </optgroup>
                            <optgroup label="Coupons & Disputes">
                                <option value="COUPON_CREATE">Coupon Created</option>
                                <option value="COUPON_UPDATE">Coupon Updated</option>
                                <option value="COUPON_DELETE">Coupon Deleted</option>
                                <option value="DISPUTE_CREATE">Dispute Created</option>
                                <option value="DISPUTE_RESOLVE">Dispute Resolved</option>
                                <option value="REPORT_CREATE">Report Created</option>
                                <option value="REPORT_ACTION">Report Action</option>
                            </optgroup>
                            <optgroup label="System & FAQ">
                                <option value="FAQ_CREATE">FAQ Created</option>
                                <option value="FAQ_UPDATE">FAQ Updated</option>
                                <option value="FAQ_DELETE">FAQ Deleted</option>
                                <option value="POLICY_UPDATE">Policy Updated</option>
                                <option value="SETTINGS_UPDATE">Settings Updated</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => handleFilterChange(setStartDate, e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                        />
                    </div>

                    {/* End Date */}
                    <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => handleFilterChange(setEndDate, e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#f8f7fc] border border-purple-100 rounded-2xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#2c1654]"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-purple-50">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                        <span>Items Per Fetch:</span>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                                setAccumulatedLogs([]);
                            }}
                            className="bg-[#f8f7fc] border border-purple-100 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-900 focus:outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    {(search || actionFilter || startDate || endDate) && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1.5 cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Log Trail Card */}
            <DashboardCard
                title="Activity Log Trail"
                headerRight={<History className="h-5 w-5 text-[#2c1654]" />}
            >
                {isLoading && page === 1 ? (
                    <div className="py-16 text-center text-xs font-bold text-purple-700 flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-purple-600" /> Fetching activity audit logs...
                    </div>
                ) : logsToDisplay.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {logsToDisplay.map((log) => {
                            const userInfo = typeof log.user === "object" ? log.user : null;
                            return (
                                <div
                                    key={log._id}
                                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-purple-50/30 px-3 rounded-2xl transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-[#2c1654] text-amber-400 rounded-2xl mt-0.5 shrink-0 shadow-sm">
                                            <Shield className="h-4.5 w-4.5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-bold bg-purple-100 text-[#2c1654] px-2.5 py-0.5 rounded-lg border border-purple-200">
                                                    {log.action}
                                                </span>
                                                {userInfo && (
                                                    <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md">
                                                        <User className="w-3 h-3 text-purple-600" />
                                                        {userInfo.name || userInfo.email} ({userInfo.role})
                                                    </span>
                                                )}
                                                {log.module && (
                                                    <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                                                        {log.module}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 font-medium">
                                                {log.details || "No additional metadata recorded."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold shrink-0">
                                        {log.ipAddress && (
                                            <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100">
                                                <Globe className="h-3.5 w-3.5 text-purple-500" />
                                                {log.ipAddress}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100">
                                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                                            {log.createdAt ? new Date(log.createdAt).toLocaleString() : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Infinite Scroll Loader at bottom */}
                        {viewMode === "infiniteScroll" && isFetching && (
                            <div className="py-6 text-center flex items-center justify-center">
                                <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
                                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                    Loading next page...
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-16 text-center space-y-2">
                        <History className="w-10 h-10 text-purple-200 mx-auto" />
                        <p className="text-sm text-gray-500 font-bold">No activity records found.</p>
                        <p className="text-xs text-gray-400">Try adjusting your date range or search filter.</p>
                    </div>
                )}

                {/* Numbered Pagination Controls */}
                {viewMode === "pagination" && totalPages > 1 && (
                    <div className="mt-6 border-t border-purple-50 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-gray-500 font-semibold">
                            Showing page <span className="font-bold text-[#2c1654]">{meta?.page || page}</span> of{" "}
                            <span className="font-bold text-[#2c1654]">{totalPages}</span> ({meta?.total || newLogs.length} total logs)
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={!hasPrev && page <= 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                className="p-2 rounded-xl border border-purple-100 hover:bg-purple-50 disabled:opacity-40 transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4 text-[#2c1654]" />
                            </button>

                            <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-[#2c1654] rounded-lg border border-purple-200">
                                Page {meta?.page || page} / {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={!hasNext && page >= totalPages}
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                className="p-2 rounded-xl border border-purple-100 hover:bg-purple-50 disabled:opacity-40 transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4 text-[#2c1654]" />
                            </button>
                        </div>
                    </div>
                )}
            </DashboardCard>
        </div>
    );
}
