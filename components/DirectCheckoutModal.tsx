import React from "react";

interface DirectCheckoutModalProps {
    showCheckout: boolean;
    onClose: () => void;
    checkoutPayload: any;
    setCheckoutPayload: (payload: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function DirectCheckoutModal({ showCheckout, onClose, checkoutPayload, setCheckoutPayload, onSubmit }: DirectCheckoutModalProps) {
    if (!showCheckout) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <form onSubmit={onSubmit} className="bg-white rounded-3xl w-full max-w-md p-6 border border-gray-100 shadow-2xl relative">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-black text-[#2c1654]">Checkout Details</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-900 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center font-bold">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Street Address</label>
                        <input
                            type="text"
                            required
                            value={checkoutPayload.shippingAddress?.street || ""}
                            onChange={(e) =>
                                setCheckoutPayload({
                                    ...checkoutPayload,
                                    shippingAddress: { ...(checkoutPayload.shippingAddress || {}), street: e.target.value },
                                })
                            }
                            className="w-full bg-[#f8f7fc] border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm text-gray-800 focus:outline-none focus:border-[#2c1654]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">City</label>
                            <input
                                type="text"
                                required
                                value={checkoutPayload.shippingAddress?.city || ""}
                                onChange={(e) =>
                                    setCheckoutPayload({
                                        ...checkoutPayload,
                                        shippingAddress: { ...(checkoutPayload.shippingAddress || {}), city: e.target.value },
                                    })
                                }
                                className="w-full bg-[#f8f7fc] border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm text-gray-800 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">State</label>
                            <input
                                type="text"
                                required
                                value={checkoutPayload.shippingAddress?.state || ""}
                                onChange={(e) =>
                                    setCheckoutPayload({
                                        ...checkoutPayload,
                                        shippingAddress: { ...(checkoutPayload.shippingAddress || {}), state: e.target.value },
                                    })
                                }
                                className="w-full bg-[#f8f7fc] border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm text-gray-800 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Zip Code</label>
                            <input
                                type="text"
                                required
                                value={checkoutPayload.shippingAddress?.zipCode || ""}
                                onChange={(e) =>
                                    setCheckoutPayload({
                                        ...checkoutPayload,
                                        shippingAddress: { ...(checkoutPayload.shippingAddress || {}), zipCode: e.target.value },
                                    })
                                }
                                className="w-full bg-[#f8f7fc] border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm text-gray-800 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Phone</label>
                            <input
                                type="text"
                                required
                                value={checkoutPayload.shippingAddress?.phone || ""}
                                onChange={(e) =>
                                    setCheckoutPayload({
                                        ...checkoutPayload,
                                        shippingAddress: { ...(checkoutPayload.shippingAddress || {}), phone: e.target.value },
                                    })
                                }
                                className="w-full bg-[#f8f7fc] border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm text-gray-800 focus:outline-none focus:border-[#2c1654]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Coupon Code</label>
                        <input
                            type="text"
                            placeholder="e.g. SAVE10"
                            value={checkoutPayload.couponCode || ""}
                            onChange={(e) => setCheckoutPayload({ ...checkoutPayload, couponCode: e.target.value })}
                            className="w-full bg-[#f8f7fc] border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-sm text-gray-800 focus:outline-none focus:border-[#2c1654]"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full py-4 mt-6 bg-[#2c1654] hover:opacity-90 text-white font-black text-sm rounded-xl transition-all shadow-xl">
                    Pay via SSLCommerz
                </button>
            </form>
        </div>
    );
}
