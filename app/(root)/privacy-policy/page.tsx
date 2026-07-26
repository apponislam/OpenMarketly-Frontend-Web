"use client";

import React from "react";
import { PolicyPageLayout } from "@/components/PolicyPageLayout";

const defaultPrivacyPolicy = `
<h2>1. Information We Collect</h2>
<p>At OpenMarketly, we value your trust and are committed to protecting your personal information. We collect personal details such as your name, email address, phone number, shipping address, and payment preferences when you register, browse our platform, or place orders.</p>

<h2>2. How We Use Your Data</h2>
<p>We process your data strictly to facilitate marketplace transactions, fulfill orders, improve service quality, personalize your shopping experience, communicate order status updates, and detect fraudulent activities.</p>

<h2>3. Data Sharing & Third Parties</h2>
<p>We do not sell or rent your personal information to third parties. We share data only with trusted infrastructure providers, payment gateways (SSLCommerz, Bkash, Nagad), logistics delivery partners, and verified sellers fulfilling your direct orders.</p>

<h2>4. Cookies and Tracking</h2>
<p>OpenMarketly uses essential session cookies, analytical telemetry, and security tokens to keep your account safe, remember shopping cart items, and provide a continuous web app experience.</p>

<h2>5. Security Measures</h2>
<p>We implement industry-standard encryption protocols (HTTPS/SSL), salted password hashing, and token-based authentication (JWT) to safeguard your sensitive information.</p>

<h2>6. Contact Us</h2>
<p>If you have any questions or requests regarding your data rights or this privacy policy, please contact our support team at support@openmarketly.com.</p>
`;

export default function PrivacyPolicyPage() {
    return (
        <PolicyPageLayout
            type="PRIVACY_POLICY"
            title="Privacy Policy"
            description="Learn how OpenMarketly collects, uses, protects, and handles your personal data."
            defaultContent={defaultPrivacyPolicy}
        />
    );
}
