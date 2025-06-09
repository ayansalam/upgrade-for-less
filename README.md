# Upgrade For Less - Pricing Optimizer

A SaaS pricing optimization tool that helps businesses find the perfect price point for their products and services.

## Features

- Pricing Optimizer: Calculate optimal pricing tiers based on your business goals
- AI Pricing Assistant: Get AI-powered pricing suggestions using Google's Gemini API
- User-friendly interface with modern design

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to the `.env` file (Get one at https://makersuite.google.com/app/apikey)
4. Start the development server: `npm run dev`

## Environment Variables

This project uses the following environment variables:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for AI pricing suggestions

## Development
hk hai  
```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Testing Gemini API via PowerShell

To test the Gemini API directly from PowerShell (instead of curl), use the following example:

```powershell
$apiKey = "YOUR_GEMINI_API_KEY"
$body = '{
  "contents": [{
    "parts": [{"text": "Explain how AI works"}]
  }]
}'
Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey" -Method Post -ContentType "application/json" -Body $body
```

Replace `YOUR_GEMINI_API_KEY` with your actual API key.

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Google Gemini API

# Upgrade For Less

## Environment Variables Setup

### Frontend (.env.local)
Add your public environment variables here.

### Backend (Vercel Environment Variables)
Add your backend environment variables here.

## API Routes

Document your API routes here as needed.

## Security Measures

1. **Environment Variables**
   - Sensitive keys are only accessible on the server
   - Public keys are prefixed with `VITE_` for frontend access

2. **API Security**
   - Payment creation only happens server-side
   - Signature verification prevents tampering
   - Error messages are sanitized in production

3. **Data Validation**
   - All required fields are validated
   - Types are checked with TypeScript
   - Input sanitization on both client and server

## Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create `.env.local` for frontend variables
   - Add backend variables in Vercel project settings

3. Run development server:
```bash
npm run dev
```

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

Make sure all environment variables are properly set in your Vercel project settings before deploying.

# Razorpay Test Environment

This project provides a complete test environment for Razorpay payment integration with React and Express.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the project root:

```env
# Frontend (Vite)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here

# Backend
RAZORPAY_KEY_SECRET=your_test_secret_key_here
PORT=3001
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3. Start Development Servers

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from project root)
npm run dev
```

## Testing the Integration

1. Access the test page at: `http://localhost:5173/payment-test`

2. Use test cards:
   - Success: 4111 1111 1111 1111
   - Failure: 4242 4242 4242 4242
   - Any future expiry date
   - Any 3-digit CVV
   - OTP: 1234

3. Monitor:
   - Browser console (F12) for frontend logs
   - Terminal for backend logs
   - Network tab for API calls
   - Debug panel for setup status

## Test Scenarios

### Basic Flow
1. Enter amount (min: ₹100)
2. Click pay button
3. Enter test card details
4. Complete payment
5. Verify success/failure handling

### Error Cases
1. Amount below ₹100
2. Invalid card number
3. Network disconnection
4. Backend errors
5. Signature verification

## Debugging Tips

### Frontend Issues
- Check console for SDK loading errors
- Verify environment variables
- Monitor payment events in debug panel
- Check network requests

### Backend Issues
- Verify Razorpay keys
- Check order creation response
- Monitor payment verification
- Check server logs

## Production Checklist

1. Replace test keys with production keys
2. Remove test card information
3. Add error tracking (e.g., Sentry)
4. Implement proper error recovery
5. Add payment analytics
6. Setup webhook handling
7. Add database logging
8. Implement retry logic
9. Add monitoring alerts
10. Create backup payment methods

## API Endpoints

### Create Order
```http
POST /api/razorpay/create-order
Content-Type: application/json

{
  "amount": 500,
  "currency": "INR",
  "receipt": "order_123",
  "notes": {
    "description": "Test payment"
  }
}
```

### Verify Payment
```http
POST /api/razorpay/verify-payment
Content-Type: application/json

{
  "razorpay_payment_id": "pay_123",
  "razorpay_order_id": "order_123",
  "razorpay_signature": "signature"
}
```

## Component Structure

```
src/
  components/
    payments/
      RazorpayButton.tsx    # Main payment button component
      PaymentTest.tsx       # Test component with form
      PaymentDebugPanel.tsx # Debug and monitoring panel
  utils/
    payment-testing.ts      # Testing utilities and helpers
  config/
    razorpay.config.ts     # Configuration and constants
  pages/
    PaymentTestPage.tsx    # Test page with instructions

server/
  index.ts                 # Express backend with Razorpay APIs
```

## Troubleshooting

### Common Issues

1. SDK Not Loading
   ```typescript
   // Check browser console for:
   - Network errors
   - Script loading failures
   - Environment variable issues
   ```

2. Order Creation Failed
   ```typescript
   // Verify:
   - Amount is valid
   - Currency is supported
   - Backend logs for errors
   - Razorpay key permissions
   ```

3. Payment Verification Failed
   ```typescript
   // Check:
   - All parameters are present
   - Signature calculation
   - Key secret is correct
   - Order status in dashboard
   ```

### Getting Help

1. Check the [Razorpay Documentation](https://razorpay.com/docs)
2. Monitor the debug panel
3. Review server logs
4. Contact support with transaction IDs

## Contributing

Feel free to submit issues and enhancement requests!

