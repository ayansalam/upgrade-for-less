# Production Deployment Guide

This guide covers the deployment of the Razorpay payment integration in a production environment.

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- A domain name with SSL certificate
- Razorpay live account credentials
- Access to a cloud provider (AWS, GCP, Azure, etc.)

## Environment Setup

1. Create production environment files:

```bash
# Copy example environment files
cp config/production.env.example .env
cp config/production.env.example server/.env
```

2. Update environment variables with your production values:

```env
# Frontend (.env)
VITE_API_URL=https://api.yourdomain.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_here
VITE_COMPANY_NAME=Your Company Name

# Backend (server/.env)
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
RAZORPAY_KEY_ID=rzp_live_your_key_here
RAZORPAY_KEY_SECRET=your_live_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

## Building for Production

### Using Docker (Recommended)

1. Build the Docker image:

```bash
docker build -t razorpay-integration:latest .
```

2. Run the container:

```bash
docker run -d \
  --name razorpay-integration \
  -p 3001:3001 \
  --env-file .env \
  razorpay-integration:latest
```

### Manual Build

1. Build frontend:

```bash
# In project root
npm install
npm run build
```

2. Build backend:

```bash
# In server directory
cd server
npm install
npm run build
```

## Deployment Options

### Option 1: Docker on Cloud VM

1. Set up a VM (e.g., AWS EC2):
   - Choose Ubuntu 20.04 LTS
   - At least 2GB RAM
   - Configure security groups for ports 80, 443, and 3001

2. Install Docker and Docker Compose:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. Deploy using Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Platform as a Service (Heroku)

1. Install Heroku CLI:

```bash
npm install -g heroku
```

2. Deploy to Heroku:

```bash
heroku create your-app-name
heroku config:set $(cat .env)
git push heroku main
```

### Option 3: Kubernetes

1. Build and push Docker image:

```bash
docker build -t your-registry/razorpay-integration:latest .
docker push your-registry/razorpay-integration:latest
```

2. Apply Kubernetes manifests:

```bash
kubectl apply -f k8s/
```

## SSL Configuration

### Using Let's Encrypt with Nginx

1. Install Certbot:

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

2. Configure Nginx:

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

3. Obtain SSL certificate:

```bash
sudo certbot --nginx -d api.yourdomain.com
```

## Monitoring Setup

1. Configure logging:

```bash
# Create log directory
mkdir -p /var/log/razorpay-app
chown -R node:node /var/log/razorpay-app
```

2. Set up monitoring tools:

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name razorpay-server

# Configure PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Razorpay Configuration

1. Configure webhooks in Razorpay Dashboard:
   - URL: https://api.yourdomain.com/api/razorpay/webhook
   - Events: payment.captured, payment.failed, refund.processed
   - Add webhook secret to environment variables

2. Test webhook endpoint:

```bash
curl -X POST https://api.yourdomain.com/api/razorpay/webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: your_test_signature" \
  -d '{"event": "payment.captured"}'
```

## Security Checklist

- [ ] SSL/TLS enabled
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Security headers enabled
- [ ] Webhook signatures verified
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Monitoring set up
- [ ] Backups configured

## Backup and Recovery

1. Configure database backups (if using):

```bash
# Example for MongoDB
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)
```

2. Configure log rotation:

```bash
# Install logrotate
sudo apt-get install logrotate

# Configure logrotate
sudo nano /etc/logrotate.d/razorpay-server
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

2. Monitor logs:

```bash
# Check application logs
tail -f /var/log/razorpay-app/app.log

# Check error logs
tail -f /var/log/razorpay-app/error.log
```

## Troubleshooting

### Common Issues

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

### Debug Tools

1. Check server status:

```bash
curl https://api.yourdomain.com/health
```

2. View metrics:

```bash
curl -H "x-api-key: your_metrics_key" https://api.yourdomain.com/metrics
```

3. Test payment flow:

```bash
curl -X POST https://api.yourdomain.com/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "INR"}'
```

## Support

For production support:
- Email: support@yourdomain.com
- Emergency: +1234567890

## Rollback Procedure

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

## Performance Optimization

1. Enable compression:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. Configure caching:

```nginx
location /static/ {
    expires 1y;
    add_header Cache-Control "public, no-transform";
}
```

3. Use CDN for static assets:
   - Configure CDN in frontend environment
   - Update asset URLs to use CDN

## Monitoring and Alerts

1. Set up alerts for:
   - Server CPU/Memory usage
   - Payment failures
   - High error rates
   - SSL certificate expiration
   - Disk space usage

2. Configure notification channels:
   - Email
   - Slack
   - SMS (for critical alerts)

## Compliance

1. Ensure PCI DSS compliance:
   - Regular security scans
   - Access control
   - Audit logging
   - Data encryption

2. GDPR compliance:
   - Data protection
   - Privacy policy
   - User consent
   - Data retention

## Documentation

Keep the following documentation updated:
- API documentation
- Integration guide
- Troubleshooting guide
- Security policies
- Incident response plan 