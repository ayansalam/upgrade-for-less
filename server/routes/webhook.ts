import { Router } from 'express';
import { webhookSecurityMiddleware } from '../middleware/security';
import { handleWebhook } from '../webhooks/razorpay';
import { asyncHandler } from '../middleware/errorHandler';
import express from 'express';

const router = Router();

// Use raw body parser for webhook endpoint
router.use(express.raw({ type: 'application/json' }));

router.use(webhookSecurityMiddleware);

router.post('/', asyncHandler(handleWebhook));

export { router as webhookRouter }; 