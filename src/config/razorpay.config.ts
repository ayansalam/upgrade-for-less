export const RAZORPAY_CONFIG = {
  TEST_CARDS: {
    SUCCESS: {
      number: '4111 1111 1111 1111',
      expiry: '12/25',
      cvv: '123',
      otp: '1234'
    },
    FAILURE: {
      number: '4242 4242 4242 4242',
      expiry: '12/25',
      cvv: '123',
      otp: '1234'
    }
  },
  AMOUNTS: {
    MIN: 100, // Minimum amount in INR
    TEST: 500, // Test amount in INR
    MAX: 500000 // Maximum amount in INR
  },
  CURRENCIES: {
    INR: 'INR',
    USD: 'USD'
  }
};

export const RAZORPAY_ERRORS = {
  INVALID_AMOUNT: 'Amount must be between 100 and 500000',
  INVALID_CURRENCY: 'Invalid currency. Supported currencies: INR, USD',
  PAYMENT_FAILED: 'Payment failed. Please try again',
  VERIFICATION_FAILED: 'Payment verification failed',
  SDK_LOAD_FAILED: 'Failed to load payment gateway',
  ORDER_CREATE_FAILED: 'Failed to create order',
  NETWORK_ERROR: 'Network error. Please check your connection'
}; 