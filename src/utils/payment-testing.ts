import { RAZORPAY_CONFIG, RAZORPAY_ERRORS } from '@/config/razorpay.config';

interface PaymentLogData {
  type: 'info' | 'success' | 'error' | 'warning';
  title: string;
  data?: any;
}

export const paymentLogger = {
  group: (name: string) => {
    console.group(`🔍 ${name}`);
  },
  
  groupEnd: () => {
    console.groupEnd();
  },
  
  log: ({ type, title, data }: PaymentLogData) => {
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];

    console.log(`${emoji} ${title}:`, data || '');
  },

  error: (error: any) => {
    console.error('❌ Payment Error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      details: error.details || {}
    });
  }
};

export const validatePaymentAmount = (amount: number): string | null => {
  if (!amount || amount < RAZORPAY_CONFIG.AMOUNTS.MIN) {
    return `Amount must be at least ₹${RAZORPAY_CONFIG.AMOUNTS.MIN}`;
  }
  if (amount > RAZORPAY_CONFIG.AMOUNTS.MAX) {
    return `Amount cannot exceed ₹${RAZORPAY_CONFIG.AMOUNTS.MAX}`;
  }
  return null;
};

export const validateRazorpayResponse = (response: any): boolean => {
  const requiredFields = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature'];
  return requiredFields.every(field => response && response[field]);
};

export const getTestCardByType = (type: 'success' | 'failure' = 'success') => {
  return type === 'success' 
    ? RAZORPAY_CONFIG.TEST_CARDS.SUCCESS 
    : RAZORPAY_CONFIG.TEST_CARDS.FAILURE;
};

export const checkRazorpaySetup = () => {
  const issues: string[] = [];

  if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
    issues.push('Missing VITE_RAZORPAY_KEY_ID in environment variables');
  }

  if (!window.Razorpay) {
    issues.push('Razorpay SDK not loaded');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

export const generateTestOrderId = () => {
  return `order_test_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

export const mockSuccessfulPayment = () => {
  return {
    razorpay_payment_id: `pay_test_${Date.now()}`,
    razorpay_order_id: generateTestOrderId(),
    razorpay_signature: 'test_signature'
  };
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error) return error.error;
  return RAZORPAY_ERRORS.PAYMENT_FAILED;
}; 