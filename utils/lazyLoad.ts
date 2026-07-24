import { useState, useEffect, useRef, useCallback } from "react";

export interface LazyLoadOptions<T> {
    data?: T[];
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
    };
    isFetching?: boolean;
    searchQuery?: string;
    page?: number;
    onPageChange?: (newPage: number) => void;
    getItemKey?: (item: T) => string;
}

export function useLazyLoad<T extends { _id?: string; id?: string }>({
    data,
    meta,
    isFetching,
    searchQuery = "",
    page: controlledPage,
    onPageChange,
    getItemKey,
}: LazyLoadOptions<T>) {
    const [internalPage, setInternalPage] = useState(1);
    const page = controlledPage ?? internalPage;

    const changePage = useCallback(
        (nextPage: number | ((prev: number) => number)) => {
            const resolved = typeof nextPage === "function" ? nextPage(page) : nextPage;
            if (onPageChange) {
                onPageChange(resolved);
            }
            setInternalPage(resolved);
        },
        [onPageChange, page]
    );

    const [items, setItems] = useState<T[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const getKey = useCallback(
        (item: T): string => {
            if (getItemKey) return getItemKey(item);
            return item._id || item.id || JSON.stringify(item);
        },
        [getItemKey]
    );

    // Sync incoming page data into accumulated list
    useEffect(() => {
        if (data && Array.isArray(data)) {
            if (page === 1) {
                setItems(data);
            } else {
                setItems((prev) => {
                    const existingKeys = new Set(prev.map(getKey));
                    const newItems = data.filter((item) => !existingKeys.has(getKey(item)));
                    return [...prev, ...newItems];
                });
            }
        } else if (page === 1 && !isFetching) {
            setItems([]);
        }
    }, [data, page, searchQuery, getKey, isFetching]);

    // Reset pagination when search query changes
    useEffect(() => {
        changePage(1);
    }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

    const totalCount = meta?.total ?? items.length;
    const computedTotalPages = meta?.totalPages ?? 1;
    const hasNextPage = meta?.hasNext ?? (meta ? page < computedTotalPages : false);

    // Setup scroll listener for loading next page on scroll
    useEffect(() => {
        if (!hasNextPage || isFetching) return;

        // If no scroll container is set, detect parent <main> element which holds the dashboard scroll
        const scrollElement = scrollContainerRef.current || document.querySelector("main");

        if (scrollElement) {
            const handleScroll = () => {
                if (isFetching || !hasNextPage) return;

                // Threshold of 150px from the bottom
                const threshold = 150;
                
                // Calculate if user is near the bottom of the scroll container
                const isNearBottom =
                    scrollElement.scrollTop + scrollElement.clientHeight >=
                    scrollElement.scrollHeight - threshold;

                if (isNearBottom && scrollElement.scrollTop > 0) {
                    changePage((prev) => prev + 1);
                }
            };

            scrollElement.addEventListener("scroll", handleScroll, { passive: true });
            return () => {
                scrollElement.removeEventListener("scroll", handleScroll);
            };
        } else {
            // Fallback to window scroll if no scrollElement exists
            const handleWindowScroll = () => {
                if (isFetching || !hasNextPage) return;
                const threshold = 150;
                const isNearBottom =
                    window.innerHeight + window.scrollY >=
                    document.documentElement.scrollHeight - threshold;

                if (isNearBottom && window.scrollY > 0) {
                    changePage((prev) => prev + 1);
                }
            };

            window.addEventListener("scroll", handleWindowScroll, { passive: true });
            return () => {
                window.removeEventListener("scroll", handleWindowScroll);
            };
        }
    }, [hasNextPage, isFetching, changePage]);

    const reset = useCallback(() => {
        changePage(1);
        setItems([]);
    }, [changePage]);

    return {
        page,
        setPage: changePage,
        items,
        setItems,
        totalCount,
        hasNextPage,
        isFetching,
        scrollContainerRef,
        loadMoreRef,
        reset,
    };
}
