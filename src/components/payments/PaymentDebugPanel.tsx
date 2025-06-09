import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { checkRazorpaySetup, getTestCardByType } from '@/utils/payment-testing';
import { RAZORPAY_CONFIG } from '@/config/razorpay.config';

interface PaymentDebugPanelProps {
  onTestPayment?: (type: 'success' | 'failure') => void;
}

export const PaymentDebugPanel = ({ onTestPayment }: PaymentDebugPanelProps) => {
  const [setupStatus, setSetupStatus] = useState<{
    isValid: boolean;
    issues: string[];
  }>({ isValid: false, issues: [] });

  const [lastEvent, setLastEvent] = useState<{
    type: string;
    data: any;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    // Check Razorpay setup on mount
    const status = checkRazorpaySetup();
    setSetupStatus(status);

    // Listen for payment events
    const handlePaymentEvent = (event: any) => {
      if (event.detail?.type?.startsWith('razorpay:')) {
        setLastEvent({
          type: event.detail.type,
          data: event.detail.data,
          timestamp: Date.now()
        });
      }
    };

    window.addEventListener('payment', handlePaymentEvent);
    return () => window.removeEventListener('payment', handlePaymentEvent);
  }, []);

  const copyTestCard = (type: 'success' | 'failure') => {
    const card = getTestCardByType(type);
    navigator.clipboard.writeText(card.number.replace(/\s/g, ''));
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Payment Debug Panel
          <Badge variant={setupStatus.isValid ? "default" : "destructive"}>
            {setupStatus.isValid ? 'Ready' : 'Setup Issues'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Setup Status */}
        <div>
          <h3 className="font-medium mb-2">Setup Status</h3>
          {setupStatus.issues.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-red-600">
              {setupStatus.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-600">
              ✓ All required configurations are present
            </p>
          )}
        </div>

        {/* Test Cards */}
        <div>
          <h3 className="font-medium mb-2">Test Cards</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Success Card</p>
                <p className="text-sm text-gray-500">
                  {RAZORPAY_CONFIG.TEST_CARDS.SUCCESS.number}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyTestCard('success')}
              >
                Copy
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Failure Card</p>
                <p className="text-sm text-gray-500">
                  {RAZORPAY_CONFIG.TEST_CARDS.FAILURE.number}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyTestCard('failure')}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div>
          <h3 className="font-medium mb-2">Test Actions</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTestPayment?.('success')}
            >
              Test Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTestPayment?.('failure')}
            >
              Test Failure
            </Button>
          </div>
        </div>

        {/* Last Event */}
        {lastEvent && (
          <div>
            <h3 className="font-medium mb-2">Last Event</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium">{lastEvent.type}</p>
              <p className="text-xs text-gray-500">
                {new Date(lastEvent.timestamp).toLocaleTimeString()}
              </p>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(lastEvent.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Debugging Tips */}
        <div>
          <h3 className="font-medium mb-2">Debugging Tips</h3>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• Use browser console (F12) for detailed logs</li>
            <li>• Check Network tab for API calls</li>
            <li>• Test both success and failure flows</li>
            <li>• Verify payment signature in console</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 