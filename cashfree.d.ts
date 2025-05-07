declare global {
  interface Window {
    Cashfree: {
      init: (options: { paymentSessionId: string }) => void;
      pay: () => void;
      checkout: (options: { paymentSessionId: string; redirectTarget?: string }) => void;
    };
  }
}

export {};