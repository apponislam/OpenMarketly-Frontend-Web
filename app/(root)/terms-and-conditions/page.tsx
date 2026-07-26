"use client";

import React from "react";
import { PolicyPageLayout } from "@/components/PolicyPageLayout";

const defaultTerms = `
<h2>1. Acceptance of Terms</h2>
<p>By accessing or using OpenMarketly, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our marketplace services.</p>

<h2>2. Account Responsibilities</h2>
<p>You are responsible for maintaining the confidentiality of your account credentials, password, and for restricting access to your computer or mobile device. Users must provide accurate, current, and truthful profile information.</p>

<h2>3. Buying & Selling Rules</h2>
<p>OpenMarketly connects independent sellers with customers. Sellers guarantee that all listed goods are genuine, legal, and correctly described. Buyers agree to fulfill payment obligations upon placing confirmed orders.</p>

<h2>4. Pricing & Payments</h2>
<p>All prices listed on OpenMarketly are in BDT (Bangladeshi Taka) unless otherwise specified. We reserve the right to correct pricing errors, modify promotions, or cancel orders arising from inaccurate pricing listings.</p>

<h2>5. Intellectual Property</h2>
<p>All trademarks, site logos, product photography, UI code, and content published on OpenMarketly remain the exclusive property of OpenMarketly Inc. or its vendor content licensors.</p>

<h2>6. Governing Law</h2>
<p>These Terms & Conditions are governed by and construed in accordance with the laws of Bangladesh. Any dispute arising from marketplace operations shall be resolved through our dispute ticket center or local jurisdiction.</p>
`;

export default function TermsAndConditionsPage() {
    return (
        <PolicyPageLayout
            type="TERMS_AND_CONDITIONS"
            title="Terms & Conditions"
            description="Understand the rules, guidelines, rights, and responsibilities when using OpenMarketly."
            defaultContent={defaultTerms}
        />
    );
}
