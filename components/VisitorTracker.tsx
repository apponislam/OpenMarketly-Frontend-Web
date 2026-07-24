"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTrackVisitMutation } from "@/redux/features/visitor/visitorApi";

export function VisitorTracker() {
    const pathname = usePathname();
    const [trackVisit] = useTrackVisitMutation();

    useEffect(() => {
        if (!pathname) return;

        // Optionally skip tracking specific internal / asset paths
        if (
            pathname.startsWith("/_next") || 
            pathname.startsWith("/api") || 
            pathname.includes(".")
        ) {
            return;
        }

        // Fire visitor tracking hit to backend
        trackVisit({
            path: pathname,
            platform: "WEB",
        }).unwrap().catch((err) => {
            // Silently catch tracking errors to avoid disrupting user experience
            console.debug("Failed to record page visit:", err);
        });
    }, [pathname, trackVisit]);

    return null;
}
