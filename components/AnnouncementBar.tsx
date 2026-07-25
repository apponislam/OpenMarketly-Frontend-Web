import React from "react";
import { Truck, Shield, RotateCcw } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-[#1a0e33] text-white text-sm py-2.5 text-center">
      <div className="flex items-center justify-center gap-6 flex-wrap px-4">
        <span className="flex items-center gap-1.5 font-medium text-purple-200">
          <Truck className="w-3.5 h-3.5 text-[#c8960c]" /> Free delivery on orders over ৳5,000
        </span>
        <span className="hidden sm:block text-purple-700">•</span>
        <span className="flex items-center gap-1.5 font-medium text-purple-200">
          <Shield className="w-3.5 h-3.5 text-[#c8960c]" /> Secure payments
        </span>
        <span className="hidden sm:block text-purple-700">•</span>
        <span className="flex items-center gap-1.5 font-medium text-purple-200">
          <RotateCcw className="w-3.5 h-3.5 text-[#c8960c]" /> Easy 30-day returns
        </span>
      </div>
    </div>
  );
}
