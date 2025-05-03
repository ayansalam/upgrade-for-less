import React from "react";

const Terms = () => (
  <div className="container mx-auto py-16 px-4 max-w-4xl">
    <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
    <p className="text-lg text-gray-700 mb-8">
      Please read these Terms of Service ("Terms") carefully before using UpgradeForLess. By accessing or using our platform, you agree to be bound by these Terms.
    </p>
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Use of Service</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>You must be at least 18 years old to use UpgradeForLess</li>
        <li>You agree not to misuse the platform or attempt unauthorized access</li>
        <li>All content and data remain the property of UpgradeForLess</li>
      </ul>
    </section>
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Limitation of Liability</h2>
      <ul className="list-disc ml-6 text-gray-600">
        <li>UpgradeForLess is provided "as is" without warranties of any kind</li>
        <li>We are not liable for any damages resulting from the use of our platform</li>
      </ul>
    </section>
    <section>
      <h2 className="text-2xl font-semibold mb-2">Contact</h2>
      <p className="text-gray-600">If you have any questions about these Terms, please contact us at <a href="mailto:support@upgradeforless.com" className="text-primary underline">support@upgradeforless.com</a>.</p>
    </section>
  </div>
);

export default Terms;