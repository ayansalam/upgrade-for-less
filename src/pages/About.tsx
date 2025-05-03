import React from "react";

const About = () => (
  <div className="container mx-auto py-16 px-4 max-w-4xl">
    <h1 className="text-4xl font-bold mb-6">About UpgradeForLess</h1>
    <p className="text-lg text-gray-700 mb-8">
      UpgradeForLess is dedicated to transforming SaaS pricing strategies with AI-driven insights. Our mission is to help SaaS businesses boost conversions, maximize revenue, and improve customer satisfaction through intelligent pricing recommendations.
    </p>
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
      <p className="text-gray-600">Founded by a team of SaaS veterans and AI experts, UpgradeForLess was born out of the need for smarter, more adaptive pricing solutions. We believe that every SaaS company deserves access to cutting-edge tools that drive growth and customer value.</p>
    </section>
    <section>
      <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Innovation in SaaS pricing</li>
        <li>Customer-centric solutions</li>
        <li>Transparency and trust</li>
        <li>Continuous improvement</li>
      </ul>
    </section>
  </div>
);

export default About;