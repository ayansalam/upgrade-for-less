import { PaymentTest } from "@/components/payments/PaymentTest";
import { PaymentDebugPanel } from "@/components/payments/PaymentDebugPanel";
import { paymentLogger } from '@/utils/payment-testing';

export default function PaymentTestPage() {
  const handleTestPayment = (type: 'success' | 'failure') => {
    paymentLogger.group(`Test Payment: ${type}`);
    paymentLogger.log({
      type: 'info',
      title: 'Initiating test payment',
      data: { type }
    });
    // Your test payment logic here
    paymentLogger.groupEnd();
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Razorpay Payment Integration Test
      </h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Test Mode Instructions
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  This is a test payment integration. No real money will be charged.
                  Use the test card details provided below to simulate payments.
                </p>
              </div>
            </div>
          </div>
        </div>

        <PaymentTest />
        
        <PaymentDebugPanel onTestPayment={handleTestPayment} />

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Testing Instructions:</h2>
          <div className="space-y-4">
            <section>
              <h3 className="font-medium">1. Environment Setup</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Ensure <code className="bg-gray-100 px-1">.env</code> file has Razorpay test keys</li>
                <li>Check debug panel for setup status</li>
                <li>Verify console shows no SDK loading errors</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium">2. Test Scenarios</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Try amounts below ₹100 (should show error)</li>
                <li>Test successful payment flow with success test card</li>
                <li>Test failure scenarios with failure test card</li>
                <li>Verify payment verification response</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium">3. Debugging</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Monitor browser console (F12) for detailed logs</li>
                <li>Check Network tab for API calls</li>
                <li>Verify order creation response</li>
                <li>Check payment verification status</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium">4. Common Issues</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>SDK not loading: Check environment variables</li>
                <li>Order creation failing: Verify backend setup</li>
                <li>Payment failing: Check test card details</li>
                <li>Verification failing: Check signature calculation</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 