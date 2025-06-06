import React, { useEffect } from "react";
import { useAuth } from './AuthProvider';

const RazorpayCheckoutButton = () => {
  const { user } = useAuth();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!user) {
      alert('Please login to continue');
      return;
    }
    // Create order on backend
    const res = await fetch("/api/payment/razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 499, notes: { user_id: user.id } }),
    });
    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: 49900, // in paise
      currency: "INR",
      name: "Upgrade for Less",
      description: "One-time payment",
      order_id: order.id,
      handler: function (response) {
        window.location.href = `/thank-you?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
      },
      prefill: {
        name: user.email,
        email: user.email,
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      window.location.href = `/payment-failed?reason=${encodeURIComponent(response.error.description)}`;
    });
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        background: "#6366f1",
        color: "#fff",
        padding: "12px 32px",
        border: "none",
        borderRadius: "6px",
        fontSize: "18px",
        cursor: "pointer",
      }}
    >
      Pay ₹499
    </button>
  );
};

export default RazorpayCheckoutButton; 