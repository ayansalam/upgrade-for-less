import { handleCashfreeWebhook } from "./webhooks/cashfree";

// API route handler
export async function handleApiRequest(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle Cashfree webhook
  if (path.startsWith('/api/webhooks/cashfree')) {
    return handleCashfreeWebhook(request);
  }

  // Return 404 for unknown API routes
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}