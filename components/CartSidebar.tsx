import React from "react";
import { X, ShoppingBag, ShoppingCart, Minus, Plus, Trash2, Check } from "lucide-react";
import { CartItem, IMGS } from "./types";

interface CartSidebarProps {
    open: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQty: (productId: string, color: string, size: string, qty: number) => void;
    onRemove: (productId: string, color: string, size: string) => void;
    onCheckout: (item: CartItem) => void;
}

export function CartSidebar({ open, onClose, items, onUpdateQty, onRemove, onCheckout }: CartSidebarProps) {
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const shipping = subtotal >= 5000 ? 0 : 150;
    const total = subtotal + shipping;

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#2c1654]">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-white" />
                        <h2 className="text-lg font-black text-white">Your Cart</h2>
                        <span className="bg-[#c8960c] text-white text-xs font-black px-2 py-0.5 rounded-full">{items.reduce((s, i) => s + i.quantity, 0)}</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <ShoppingCart className="w-16 h-16 text-gray-200 mb-4" />
                            <p className="text-gray-500 font-semibold">Your cart is empty</p>
                            <p className="text-gray-400 text-sm mt-1">Add some products to get started</p>
                            <button onClick={onClose} className="mt-5 bg-[#2c1654] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 bg-gray-50 rounded-2xl p-3.5">
                                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
                                    <img src={item.product.thumbnail || item.product.image || IMGS.headphones} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#2c1654] uppercase tracking-wide mb-0.5">{item.product.brand}</p>
                                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">{item.product.name}</p>
                                    <div className="flex gap-2 text-[10px] text-gray-400 mb-2">
                                        {item.color && <span>Color: {item.color}</span>}
                                        {item.size && <span>Size: {item.size}</span>}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                                            <button onClick={() => onUpdateQty(item.product._id, item.color, item.size, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors">
                                                <Minus className="w-3 h-3 text-gray-600" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-black text-gray-800">{item.quantity}</span>
                                            <button onClick={() => onUpdateQty(item.product._id, item.color, item.size, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors">
                                                <Plus className="w-3 h-3 text-gray-600" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-black text-gray-900">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                                            <button onClick={() => onRemove(item.product._id, item.color, item.size)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => onCheckout(item)} className="w-full mt-2.5 py-1.5 text-xs font-bold text-white bg-[#c8960c] rounded-lg hover:opacity-90 transition-opacity">
                                        Buy This Item
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary */}
                {items.length > 0 && (
                    <div className="px-6 py-5 border-t border-gray-100 space-y-3">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className={shipping === 0 ? "text-emerald-600 font-semibold" : "font-semibold text-gray-900"}>{shipping === 0 ? "Free" : `৳${shipping}`}</span>
                            </div>
                            {shipping === 0 && (
                                <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" /> You qualify for free shipping!
                                </p>
                            )}
                            <div className="flex justify-between pt-2 border-t border-gray-100">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-xl font-black text-[#2c1654]">৳{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button onClick={() => onCheckout(items[0])} className="w-full bg-[#2c1654] hover:opacity-90 text-white font-black py-4 rounded-2xl transition-opacity text-base shadow-xl">
                            Proceed to Checkout
                        </button>
                        <button onClick={onClose} className="w-full border-2 border-[#2c1654] text-[#2c1654] font-bold py-3 rounded-2xl text-sm hover:bg-[#f5f0ff] transition-colors">
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
