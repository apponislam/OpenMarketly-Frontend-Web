"use client";

import React from "react";
import { PolicyPageLayout } from "@/components/PolicyPageLayout";

const defaultShippingPolicy = `
<h2>1. Shipping Destinations</h2>
<p>OpenMarketly delivers nationwide across all 64 districts in Bangladesh through trusted courier logistics partners.</p>

<h2>2. Delivery Timelines</h2>
<p>Standard delivery times:</p>
<ul>
  <li><strong>Inside Dhaka:</strong> 24 to 48 hours</li>
  <li><strong>Outside Dhaka (Division & District Hubs):</strong> 3 to 5 business days</li>
</ul>

<h2>3. Shipping Charges</h2>
<p>Shipping fees are calculated based on parcel weight, volume, and destination address. Standard shipping rates start at ৳ 60 for inside Dhaka and ৳ 120 for outside Dhaka.</p>

<h2>4. Order Tracking</h2>
<p>Once your parcel is dispatched, a tracking ID and courier SMS update link will be generated in your account dashboard under My Orders.</p>
`;

export default function ShippingPolicyPage() {
    return (
        <PolicyPageLayout
            type="SHIPPING_POLICY"
            title="Shipping & Delivery Policy"
            description="Details about shipping coverage, delivery timelines, tracking, and courier rates."
            defaultContent={defaultShippingPolicy}
        />
    );
}
