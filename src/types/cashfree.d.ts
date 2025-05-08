// Type definitions for Cashfree SDK

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: '_self' | '_blank';
}

interface Cashfree {
  checkout: (options: CashfreeCheckoutOptions) => void;
}

declare global {
  interface Window {
    Cashfree: Cashfree;
  }
}

export {};