declare global {
  interface Window {
    Cashfree: {
      init: (options: { paymentSessionId: string }) => void;
      pay: () => void;
    };
  }
}

export {};