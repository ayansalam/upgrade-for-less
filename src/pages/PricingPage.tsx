import { useEffect, useState } from "react";

export default function PricingPage() {
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successPlan = params.get("plan");
    if (successPlan) {
      localStorage.setItem("plan", successPlan);
      if (successPlan === "pro") localStorage.setItem("limit", "100");
      if (successPlan === "lifetime") localStorage.setItem("limit", "99999");
      setUserPlan(successPlan);
    } else {
      setUserPlan(localStorage.getItem("plan"));
    }
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-2">Pricing Plans</h1>
      <p className="text-gray-600 mb-10">Choose a plan that fits your needs</p>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="border rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">Free</h2>
          <p className="text-gray-500 mb-4">Great for getting started</p>
          <p className="text-3xl font-bold mb-6">₹0</p>
          <ul className="text-left space-y-2 mb-6">
            <li>✔ 5 AI queries per month</li>
            <li>✔ Basic support</li>
            <li>✔ Limited features</li>
          </ul>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl" disabled>
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-blue-500 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Pro</h2>
          <p className="text-gray-500 mb-4">Ideal for professionals</p>
          <p className="text-3xl font-bold mb-6">₹199/mo</p>
          <ul className="text-left space-y-2 mb-6">
            <li>✔ 100 AI queries/month</li>
            <li>✔ Priority support</li>
            <li>✔ Full feature access</li>
          </ul>
          {userPlan === "pro" ? (
            <button disabled className="bg-blue-100 text-blue-600 px-4 py-2 rounded-xl">You are on Pro</button>
          ) : (
            <a href="https://payments.cashfree.com/links?code=L8o5h91fcf7g&redirect_url=https://upgrade-for-less-xqd6.vercel.app/payment-success?plan=pro" target="_blank" rel="noopener noreferrer">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Upgrade to Pro</button>
            </a>
          )}
        </div>

        {/* Lifetime Deal */}
        <div className="border rounded-2xl p-6 shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">Lifetime Deal</h2>
          <p className="text-gray-500 mb-4">One-time payment, forever access</p>
          <p className="text-3xl font-bold mb-6">₹1499</p>
          <ul className="text-left space-y-2 mb-6">
            <li>✔ Unlimited AI queries</li>
            <li>✔ Lifetime access</li>
            <li>✔ Priority support</li>
          </ul>
          {userPlan === "lifetime" ? (
            <button disabled className="bg-green-100 text-green-600 px-4 py-2 rounded-xl">You have Lifetime</button>
          ) : (
            <a href="https://payments.cashfree.com/links?code=J8o5hft2of7g&redirect_url=https://upgrade-for-less-xqd6.vercel.app/payment-success?plan=lifetime" target="_blank" rel="noopener noreferrer">
              <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700">Buy Lifetime Deal</button>
            </a>
          )}
        </div>
      </div>
      <div className="mt-8">
        <span className="text-sm text-gray-500">Remaining AI queries: {localStorage.getItem("limit") || "0"}</span>
      </div>
    </div>
  );
}