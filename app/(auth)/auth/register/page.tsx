"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    // Step 1 fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");

    // Step 2 fields
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
    const [referralCode, setReferralCode] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        if (!name || !email || !password) {
            setErrorMessage("Please fill in all credentials");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setIsUploading(true);

        let uploadedImageUrl = "";

        // 1. Upload to Cloudinary if image is selected
        if (imageFile) {
            try {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

                if (!cloudName || !presetName) {
                    throw new Error("Cloudinary environment variables are missing");
                }

                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("upload_preset", presetName);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.secure_url) {
                    uploadedImageUrl = data.secure_url;
                } else {
                    throw new Error(data.error?.message || "Failed to upload image to Cloudinary");
                }
            } catch (err: any) {
                setErrorMessage(err.message || "Failed to upload profile image");
                setIsUploading(false);
                return;
            }
        }

        setIsUploading(false);

        // 2. Perform Backend Registration
        try {
            const res = await register({
                name,
                email,
                password,
                role,
                phone: phone || undefined,
                gender,
                profileImage: uploadedImageUrl || undefined,
                referralCode: referralCode || undefined,
            }).unwrap();

            if (res?.success) {
                dispatch(setUser({ user: res.data.user, token: res.data.accessToken }));
                router.push("/dashboard");
            } else {
                setErrorMessage(res?.message || "Registration failed");
            }
        } catch (err: any) {
            setErrorMessage(err?.data?.message || "Something went wrong during registration");
        }
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white tracking-wide">Create Account</h1>
                <p className="text-sm text-gray-400 mt-1">
                    {step === 1 ? "Step 1 of 2: Account Details" : "Step 2 of 2: Profile Details"}
                </p>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-200 text-sm rounded-lg">
                    {errorMessage}
                </div>
            )}

            {step === 1 ? (
                <form onSubmit={handleNextStep} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="role">
                            Register As
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("CUSTOMER")}
                                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition duration-200 ${
                                    role === "CUSTOMER"
                                        ? "bg-[#2c1654] border-[#c8960c] text-white"
                                        : "bg-[#1e1633] border-white/10 text-gray-400"
                                }`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("SELLER")}
                                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition duration-200 ${
                                    role === "SELLER"
                                        ? "bg-[#2c1654] border-[#c8960c] text-white"
                                        : "bg-[#1e1633] border-white/10 text-gray-400"
                                }`}
                            >
                                Seller
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-[#2c1654] hover:bg-[#3d2073] border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center"
                    >
                        Next Step
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Profile Picture
                        </label>
                        <div className="relative w-24 h-24 rounded-full bg-[#1e1633] border-2 border-white/10 overflow-hidden flex items-center justify-center group cursor-pointer">
                            {previewUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-gray-400 text-center px-2">Select Image</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="phone">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="gender">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e: any) => setGender(e.target.value)}
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="referral">
                            Referral Code (Optional)
                        </label>
                        <input
                            id="referral"
                            type="text"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                            placeholder="CODE123"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="py-3 px-4 bg-transparent hover:bg-white/5 border border-white/10 text-white font-semibold rounded-xl transition duration-200"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading || isRegistering}
                            className="bg-[#2c1654] hover:bg-[#3d2073] active:bg-[#1a0e33] border border-white/10 hover:border-[#c8960c]/30 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? "Uploading..." : isRegistering ? "Signing Up..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-[#c8960c] hover:underline">
                    Sign In
                </Link>
            </div>
        </div>
    );
}
