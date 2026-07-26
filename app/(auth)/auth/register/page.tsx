"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["CUSTOMER", "SELLER"]),
    phone: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    referralCode: z.string().optional(),
});

type RegisterFields = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const [step, setStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Custom state for file upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register: registerField,
        handleSubmit,
        trigger,
        formState: { errors },
        setValue,
        watch,
    } = useForm<RegisterFields>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "CUSTOMER",
            phone: "",
            gender: "MALE",
            referralCode: "",
        },
    });

    const activeRole = watch("role");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        
        // Trigger validation for step 1 fields
        const isValid = await trigger(["name", "email", "password"]);
        if (isValid) {
            setStep(2);
        }
    };

    const onSubmit = async (data: RegisterFields) => {
        setErrorMessage("");
        setIsUploading(true);

        let finalProfileImage = previewUrl || "";

        // Try Cloudinary upload if env vars are set, but fallback gracefully to Base64 data URL or imageUrlInput
        if (imageFile && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME) {
            try {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

                const formData = new FormData();
                formData.append("file", imageFile);
                formData.append("upload_preset", presetName);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await response.json();
                if (uploadData.secure_url) {
                    finalProfileImage = uploadData.secure_url;
                }
            } catch (err) {
                console.warn("Cloudinary upload skipped or failed, using local image data", err);
            }
        }

        setIsUploading(false);

        // Perform Backend Registration
        try {
            const res = await register({
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                phone: data.phone || undefined,
                gender: data.gender,
                profileImage: finalProfileImage || undefined,
                referralCode: data.referralCode || undefined,
            }).unwrap();

            if (res?.success) {
                dispatch(setUser({ user: res.data.user, token: res.data.accessToken }));
                router.push("/dashboard");
            } else {
                setErrorMessage(res?.message || "Registration failed");
            }
        } catch (err: any) {
            setErrorMessage(err?.data?.message || err?.message || "Something went wrong during registration");
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
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
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
                            {...registerField("name")}
                            placeholder="John Doe"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...registerField("email")}
                            placeholder="you@example.com"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="password">
                            Password
                        </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...registerField("password")}
                            placeholder="••••••••"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                        {errors.password && (
                            <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="role">
                            Register As
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setValue("role", "CUSTOMER")}
                                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition duration-200 ${
                                    activeRole === "CUSTOMER"
                                        ? "bg-[#2c1654] border-[#c8960c] text-white"
                                        : "bg-[#1e1633] border-white/10 text-gray-400"
                                }`}
                            >
                                Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("role", "SELLER")}
                                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition duration-200 ${
                                    activeRole === "SELLER"
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            {...registerField("phone")}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="gender">
                            Gender
                        </label>
                        <select
                            id="gender"
                            {...registerField("gender")}
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                        {errors.gender && (
                            <p className="text-xs text-red-400 mt-1">{errors.gender.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" htmlFor="referral">
                            Referral Code (Optional)
                        </label>
                        <input
                            id="referral"
                            type="text"
                            {...registerField("referralCode")}
                            placeholder="CODE123"
                            className="w-full bg-[#1e1633] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c8960c] transition duration-200"
                        />
                        {errors.referralCode && (
                            <p className="text-xs text-red-400 mt-1">{errors.referralCode.message}</p>
                        )}
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
