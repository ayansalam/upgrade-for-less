import { useRouter } from "next/router";

export default function PaymentFailed() {
  const router = useRouter();
  const { reason } = router.query;

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>❌ Payment Failed</h1>
      <p>{reason ? `Reason: ${reason}` : "Something went wrong."}</p>
      <button
        style={{ marginTop: 24, padding: "10px 24px", fontSize: 18, borderRadius: 6, background: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}
        onClick={() => router.back()}
      >
        Retry Payment
      </button>
      <div style={{ marginTop: 16 }}>
        <a href="/" style={{ color: "#6366f1", textDecoration: "underline" }}>Go to Home</a>
      </div>
    </div>
  );
} 