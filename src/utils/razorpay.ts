declare global {
  interface Window {
    Razorpay: any;
  }
}

let razorpayPromise: Promise<boolean> | null = null;

export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};

export const validatePaymentVerification = ({
  orderCreationId,
  razorpayPaymentId,
  razorpaySignature,
  secretKey,
}: {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  secretKey: string;
}): boolean => {
  const crypto = require('crypto');
  const shasum = crypto.createHmac('sha256', secretKey);
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
  const digest = shasum.digest('hex');
  return digest === razorpaySignature;
};

export const formatAmountForDisplay = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

export const formatAmountForRazorpay = (amount: number): number => {
  // Convert to paise (multiply by 100)
  return Math.round(amount * 100);
};

export const getPaymentMethodIcon = (method: string): string => {
  const icons: { [key: string]: string } = {
    card: '💳',
    netbanking: '🏦',
    wallet: '📱',
    upi: '📲',
    emi: '📅',
  };
  return icons[method.toLowerCase()] || '💰';
};

export const getPaymentStatus = (status: string): {
  label: string;
  color: string;
} => {
  const statusMap: {
    [key: string]: { label: string; color: string };
  } = {
    created: { label: 'Pending', color: 'yellow' },
    authorized: { label: 'Authorized', color: 'blue' },
    captured: { label: 'Completed', color: 'green' },
    refunded: { label: 'Refunded', color: 'purple' },
    failed: { label: 'Failed', color: 'red' },
  };

  return (
    statusMap[status.toLowerCase()] || {
      label: 'Unknown',
      color: 'gray',
    }
  );
}; 