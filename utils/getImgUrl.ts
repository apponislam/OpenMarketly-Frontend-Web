export const getImgUrl = (url?: string): string => {
    if (!url) return "";

    // If it's already an absolute URL or data URI, return as-is
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
        return url;
    }

    const apiHost = process.env.NEXT_PUBLIC_API_URL;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${apiHost}${cleanUrl}`;
};
