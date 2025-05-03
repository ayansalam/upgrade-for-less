import React from "react";

const Privacy = () => (
  <div className="container mx-auto py-16 px-4 max-w-4xl">
    <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
    <p className="text-lg text-gray-700 mb-8">
      Your privacy is important to us. This Privacy Policy explains how UpgradeForLess collects, uses, and protects your information when you use our platform.
    </p>
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Account registration details</li>
        <li>Usage data and analytics</li>
        <li>Payment and billing information</li>
      </ul>
    </section>
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>To provide and improve our services</li>
        <li>To communicate with you about your account</li>
        <li>To comply with legal obligations</li>
      </ul>
    </section>
    <section>
      <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Access, update, or delete your personal information</li>
        <li>Opt out of marketing communications</li>
        <li>Contact us at privacy@upgradeforless.com for any privacy concerns</li>
      </ul>
    </section>
  </div>
);

export default Privacy;