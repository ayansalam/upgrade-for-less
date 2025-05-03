import React from "react";

const Careers = () => (
  <div className="container mx-auto py-16 px-4 max-w-4xl">
    <h1 className="text-4xl font-bold mb-6">Careers at UpgradeForLess</h1>
    <p className="text-lg text-gray-700 mb-8">
      Join our mission to revolutionize SaaS pricing with AI. We are always looking for talented, passionate individuals to help us build the future of pricing optimization.
    </p>
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Open Positions</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Senior Frontend Engineer (React, TypeScript)</li>
        <li>AI/ML Engineer</li>
        <li>Technical Writer</li>
        <li>Customer Success Manager</li>
      </ul>
      <p className="mt-4 text-gray-600">Don’t see a role that fits? Email us at <a href="mailto:careers@upgradeforless.com" className="text-primary underline">careers@upgradeforless.com</a> with your resume and tell us how you can make a difference!</p>
    </section>
    <section>
      <h2 className="text-2xl font-semibold mb-2">Why Work With Us?</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Remote-first, flexible work environment</li>
        <li>Competitive salary & equity</li>
        <li>Opportunities for growth and learning</li>
        <li>Collaborative, innovative team culture</li>
      </ul>
    </section>
  </div>
);

export default Careers;