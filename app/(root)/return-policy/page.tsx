"use client";

import React from "react";
import { PolicyPageLayout } from "@/components/PolicyPageLayout";

const defaultReturnPolicy = `
<h2>1. Return Eligibility</h2>
<p>Customers may request a return or refund within 7 days of order delivery if the item is damaged, defective, wrong product, or missing components.</p>

<h2>2. Non-Returnable Items</h2>
<p>Certain items cannot be returned for hygiene and safety reasons, including perishable goods, opened innerwear, customized products, or software licenses once activated.</p>

<h2>3. Return Process</h2>
<p>To initiate a return request, navigate to your Dashboard or contact Customer Support with your Order ID, clear photos of the product, and explanation of the defect.</p>

<h2>4. Refund Approval & Timelines</h2>
<p>Once the returned product passes quality check inspection by the seller, refunds are processed within 3-7 business days back to your original payment method (Bkash, Nagad, Card, or Wallet balance).</p>
`;

export default function ReturnPolicyPage() {
    return (
        <PolicyPageLayout
            type="RETURN_POLICY"
            title="Return & Refund Policy"
            description="Clear guidelines on how returns, exchanges, and refunds are handled on OpenMarketly."
            defaultContent={defaultReturnPolicy}
        />
    );
}
