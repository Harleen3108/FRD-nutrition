import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-6">
        At <strong>FRD Nutrition</strong>, we respect your privacy and are
        committed to protecting your personal information. This Privacy Policy
        explains how we collect, use, and safeguard your data when you use our
        website.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Name, phone number, email address</li>
          <li>Shipping and billing address</li>
          <li>Order and transaction details</li>
          <li>Login details (including Google login if used)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>To process and deliver orders</li>
          <li>To send order, shipping, and transactional emails</li>
          <li>To provide customer support</li>
          <li>To improve our website and services</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Data Protection</h2>
        <p>
          We implement appropriate security measures to protect your personal
          data against unauthorized access, alteration, or disclosure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Payment Security</h2>
        <p>
          All payments are processed through secure third-party payment gateways.
          We do not store your card or banking details on our servers.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
        <p>
          We may use third-party services such as courier partners, analytics
          tools, and payment providers strictly for order fulfillment and
          website functionality.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Policy Updates</h2>
        <p className="text-sm text-gray-600">
          FRD Nutrition reserves the right to update this Privacy Policy at any
          time. Changes will be effective immediately upon posting on the
          website.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">7. Contact Information</h2>
        <p><strong>Email:</strong> support@frdnutritionpremium.com</p>
        <p><strong>Phone:</strong> +919088032004 / 01262660027</p>
        
      </section>

    </div>
  );
};

export default PrivacyPolicy;
