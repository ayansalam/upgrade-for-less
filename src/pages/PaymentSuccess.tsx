import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  useEffect(() => {
    if (plan === "pro") {
      localStorage.setItem("plan", "pro");
      localStorage.setItem("limit", "100");
    } else if (plan === "lifetime") {
      localStorage.setItem("plan", "lifetime");
      localStorage.setItem("limit", "999999");
    }
  }, [plan]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
      <p className="text-lg mb-2">
        Thank you for purchasing the {plan === "lifetime" ? "Lifetime Deal" : "Pro"} Plan!
      </p>
      <p>Your AI query limit has been updated. You can now use the tool freely.</p>
    </div>
  );
}