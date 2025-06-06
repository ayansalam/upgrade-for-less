import { useRouter } from "next/router";

export default function ThankYou() {
  const router = useRouter();
  const { payment_id, order_id } = router.query;

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>✅ Payment Successful!</h1>
      <p>Your Payment ID is: <b>{payment_id}</b></p>
      <p>Order ID: <b>{order_id}</b></p>
      <button
        style={{ marginTop: 24, padding: "10px 24px", fontSize: 18, borderRadius: 6, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        Go to Home
      </button>
    </div>
  );
} 