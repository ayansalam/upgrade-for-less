# Production Deployment Guide

## Frontend Deployment (Vercel)

1. Build the frontend:
```bash
# In project root
npm run build
```

2. Configure Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel
```

3. Set environment variables in Vercel dashboard:
```env
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_here
```

## Backend Deployment (Multiple Options)

### Option 1: Heroku

1. Create Heroku app:
```bash
# Install Heroku CLI
npm i -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set RAZORPAY_KEY_SECRET=your_live_secret_key
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com

# Deploy
git push heroku main
```

### Option 2: DigitalOcean/AWS EC2

1. Server setup:
```bash
# Install Node.js and PM2
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# Clone and setup project
git clone your-repo
cd your-repo/server
npm install
npm run build

# Start with PM2
pm2 start dist/index.js --name razorpay-server
```

2. Environment setup:
```bash
# Create production .env
cat > .env << EOL
RAZORPAY_KEY_SECRET=your_live_secret_key
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
PORT=3001
EOL
```

3. Nginx configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Checklist

1. SSL/TLS Setup:
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
```

2. Firewall Configuration:
```bash
# Allow only necessary ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

3. Security Headers:
```typescript
// Add to server/index.ts
import helmet from 'helmet';
app.use(helmet());
```

## Monitoring Setup

1. Install monitoring tools:
```bash
# Install monitoring packages
npm install --save winston morgan
```

2. Configure logging:
```typescript
// Add to server/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Webhook Setup

1. Configure Razorpay webhook in dashboard:
   - URL: https://api.yourdomain.com/api/razorpay/webhook
   - Events: payment.captured, payment.failed, refund.processed

2. Add webhook secret to environment:
```bash
heroku config:set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
# or
echo "RAZORPAY_WEBHOOK_SECRET=your_webhook_secret" >> .env
```

## Health Checks

1. Add health check endpoint:
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

2. Configure monitoring:
```bash
# Setup uptime monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Backup and Recovery

1. Database backups (if using):
```bash
# Example for MongoDB
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)
```

2. Log rotation:
```bash
# Install logrotate
sudo apt-get install logrotate

# Configure
sudo nano /etc/logrotate.d/razorpay-server
```

## Testing Production Setup

1. Smoke test:
```bash
# Test health endpoint
curl https://api.yourdomain.com/health

# Test payment flow with test keys
curl -X POST https://api.yourdomain.com/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "INR"}'
```

2. Load test:
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 20 -n 50 https://api.yourdomain.com/health
```

## Rollback Plan

1. Keep previous version tagged:
```bash
# Tag releases
git tag v1.0.0
git push origin v1.0.0

# Rollback if needed
git checkout v0.9.0
npm run build
pm2 restart razorpay-server
```

2. Database rollback (if applicable):
```bash
# Restore MongoDB backup
mongorestore --uri="your_mongodb_uri" /backup/20240101/
```

## Maintenance

1. Regular updates:
```bash
# Update dependencies
npm audit
npm update

# Update system
sudo apt-get update
sudo apt-get upgrade
```

2. Log monitoring:
```bash
# Check logs
pm2 logs razorpay-server
tail -f /var/log/nginx/error.log
```

## Troubleshooting

Common issues and solutions:

1. Payment failures:
   - Check Razorpay dashboard
   - Verify webhook delivery
   - Check server logs
   - Validate signature calculation

2. Performance issues:
   - Monitor server resources
   - Check nginx access logs
   - Review database queries
   - Enable caching if needed

3. SSL/TLS issues:
   - Verify certificate renewal
   - Check SSL configuration
   - Test SSL grade (ssllabs.com)

## Contact

For support:
- Email: support@yourdomain.com
- Emergency: +1234567890 