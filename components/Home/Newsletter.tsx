import React from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "linear-gradient(135deg, #2c1654, #4a2b8c)" }}>
                    <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Stay in the Loop</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">Get exclusive deals, new arrivals, and shopping inspiration delivered to your inbox.</p>
                <div className="flex gap-2.5">
                    <input type="email" placeholder="Enter your email address" className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-[#f8f7fc] placeholder-gray-400 text-gray-700 border-[#e8e5f0]" />
                    <button className="text-white font-black px-6 py-3 rounded-xl transition-opacity hover:opacity-90 text-sm whitespace-nowrap" style={{ backgroundColor: "#2c1654" }}>
                        Subscribe
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">No spam, ever. Unsubscribe at any time.</p>
            </div>
        </section>
    );
}
