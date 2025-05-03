import React from "react";

const Documentation = () => (
  <div className="container mx-auto py-16 px-4 max-w-4xl">
    <h1 className="text-4xl font-bold mb-6">Documentation</h1>
    <p className="text-lg text-gray-700 mb-8">
      Welcome to the UpgradeForLess Documentation. Here you will find guides, API references, and integration instructions to help you get the most out of our platform.
    </p>
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>How to sign up and onboard your SaaS product</li>
        <li>Connecting your payment provider</li>
        <li>Configuring your pricing strategies</li>
      </ul>
    </section>
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">API Reference</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Authentication & API keys</li>
        <li>Endpoints for pricing suggestions</li>
        <li>Error codes & troubleshooting</li>
      </ul>
    </section>
    <section>
      <h2 className="text-2xl font-semibold mb-2">Integration Guides</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Integrating with Stripe, Paddle, and more</li>
        <li>Webhooks & event handling</li>
        <li>Best practices for SaaS pricing optimization</li>
      </ul>
    </section>
  </div>
);

export default Documentation;