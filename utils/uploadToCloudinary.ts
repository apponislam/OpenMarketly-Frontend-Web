/**
 * Uploads a file directly to Cloudinary using unsigned upload preset
 * Returns the secure Cloudinary image URL
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "j5va5yg1";
    const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME || "Mybazarhisab-App";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetName);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
        return data.secure_url;
    }

    if (data.url) {
        return data.url;
    }

    throw new Error(data.error?.message || "Failed to upload image to Cloudinary.");
};
