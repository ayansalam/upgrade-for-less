# Cashfree Payment Integration

This document provides an overview of the Cashfree payment integration implemented in the application.

## Overview

The integration allows users to make payments using the Cashfree payment gateway. It supports:

- Direct checkout payments
- Shareable payment links
- Webhook handling for payment notifications
- Transaction history tracking

## Components

### 1. Cashfree Client

The `client.ts` file contains the API client for interacting with Cashfree's payment gateway. It handles:

- Creating payment orders
- Creating payment links
- Fetching order details
- Processing webhook notifications

### 2. Payment Components

- **CashfreeCheckout**: Component for direct checkout experience
- **CashfreePaymentLink**: Component for creating shareable payment links
- **PaymentButton**: Reusable button component for initiating payments

### 3. Payment Service

The `payment.ts` service centralizes payment-related functions:

- Creating payment checkouts
- Creating payment links
- Fetching transaction history
- Checking payment status

### 4. Webhook Handler

The webhook handler processes payment notifications from Cashfree and updates transaction status in the database.

## Usage Examples

### Initiating a Payment

```tsx
import PaymentButton from "@/components/payments/PaymentButton";

<PaymentButton 
  amount={99.99}
  currency="INR"
  purpose="Premium Subscription"
/>
```

### Creating a Payment Link

```tsx
import CashfreePaymentLink from "@/components/payments/CashfreePaymentLink";

<CashfreePaymentLink
  defaultAmount={199.99}
  defaultCurrency="INR"
  defaultPurpose="Service Payment"
  onSuccess={(data) => console.log("Payment link created:", data)}
/>
```

### Using the Payment Service

```tsx
import { createPaymentCheckout, getUserTransactions } from "@/services/payment";

// Create a payment checkout
const handlePayment = async () => {
  try {
    const response = await createPaymentCheckout({
      amount: 299.99,
      currency: "INR",
      purpose: "Product Purchase",
      userId: user.id,
      userEmail: user.email
    });
    
    // Redirect to payment page
    window.location.href = response.paymentLink;
  } catch (error) {
    console.error("Payment error:", error);
  }
};

// Get user's transaction history
const loadTransactions = async () => {
  try {
    const transactions = await getUserTransactions(user.id);
    setTransactionHistory(transactions);
  } catch (error) {
    console.error("Error loading transactions:", error);
  }
};
```

## Database Schema

The integration uses the `cashfree_transactions` table in Supabase with the following structure:

- `id`: UUID primary key
- `order_id`: Unique order identifier
- `payment_link_id`: Optional payment link identifier
- `user_id`: User who made the payment
- `amount`: Payment amount
- `currency`: Payment currency
- `status`: Payment status (PENDING, SUCCESS, FAILED, CANCELLED)
- `payment_method`: Payment method used
- `reference_id`: External reference ID
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp
- `metadata`: Additional payment data

## Configuration

The integration uses environment variables for configuration:

- `VITE_CASHFREE_APP_ID`: Cashfree application ID
- `VITE_CASHFREE_SECRET_KEY`: Cashfree secret key

In development, the integration uses sandbox URLs. For production, update the API base URL in the client.