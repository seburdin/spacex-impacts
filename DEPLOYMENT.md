# Deployment Guide

This repository is configured with automated CI/CD pipelines using GitHub Actions and Railway.app.

## Overview

The deployment pipeline consists of:

1. **Continuous Integration (CI)**: Automated testing and building on every push
2. **Continuous Deployment (CD)**: Automated deployment to Railway.app on main branch
3. **Preview Deployments**: Automatic preview deployments for pull requests

## GitHub Actions Workflows

### Main CI/CD Pipeline (`ci-cd.yml`)

Triggers on:
- Push to `main` branch
- Push to `claude/**` branches
- Pull requests to `main`

Steps:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies with `npm ci`
4. Run linter
5. Build the Next.js application
6. Upload build artifacts
7. Deploy to Railway (only on `main` branch pushes)

### Railway Preview Deployment (`railway-preview.yml`)

Triggers on:
- Pull requests to `main` branch

Steps:
1. Build and test the application
2. Deploy a preview environment to Railway
3. Comment on the PR with deployment status

## Railway Setup

### Prerequisites

1. **Railway Account**: Create an account at [railway.app](https://railway.app)
2. **Railway Project**: Create a new project in Railway
3. **Railway Service**: Create a service in your project

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

#### `RAILWAY_TOKEN` (Required)
Your Railway API token for authentication.

**How to get it:**
1. Go to [Railway Dashboard](https://railway.app/account/tokens)
2. Click "New Token"
3. Give it a descriptive name (e.g., "GitHub Actions")
4. Copy the token
5. Add it as a secret named `RAILWAY_TOKEN` in your GitHub repository

#### `RAILWAY_SERVICE_NAME` (Optional)
The name of your Railway service. Defaults to `starlink-impact-viz` if not set.

**How to get it:**
1. Go to your Railway project
2. Click on your service
3. Go to Settings
4. Copy the service name
5. Add it as a secret named `RAILWAY_SERVICE_NAME` in your GitHub repository

### Railway Configuration Files

#### `railway.json`
Main Railway configuration file that defines:
- Build settings (uses Nixpacks builder)
- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Restart policy: On failure with 10 max retries

#### `nixpacks.toml`
Nixpacks configuration for optimized builds:
- Node.js 20 runtime
- Efficient caching
- Optimized install and build phases

## Environment Variables

If your application requires environment variables (API keys, database URLs, etc.):

1. Go to your Railway project
2. Select your service
3. Go to "Variables" tab
4. Add your environment variables

Common Next.js environment variables:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=your-api-url
```

## Deployment Process

### Automatic Deployment (Main Branch)

1. Make changes to your code
2. Commit and push to `main` branch
3. GitHub Actions automatically:
   - Runs tests and linting
   - Builds the application
   - Deploys to Railway
4. Check Railway dashboard for deployment status

### Preview Deployment (Pull Requests)

1. Create a pull request to `main`
2. GitHub Actions automatically:
   - Builds and tests the code
   - Creates a preview deployment on Railway
   - Comments on the PR with status
3. Review the preview before merging

### Manual Deployment

You can also deploy manually using Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Deploy
railway up
```

## Monitoring

### GitHub Actions

Monitor your deployments:
1. Go to the "Actions" tab in your GitHub repository
2. View workflow runs and their status
3. Check logs for any errors

### Railway Dashboard

Monitor your application:
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. View deployment logs, metrics, and status

## Troubleshooting

### Build Fails

- Check GitHub Actions logs for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Deployment Fails

- Verify `RAILWAY_TOKEN` secret is set correctly
- Check Railway service name matches
- Review Railway deployment logs
- Ensure environment variables are set in Railway

### Application Errors

- Check Railway logs in the dashboard
- Verify environment variables are configured
- Check for missing dependencies
- Review application error logs

## Local Development

Test the production build locally:

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Start production server
npm start
```

## Support

- GitHub Actions Documentation: https://docs.github.com/en/actions
- Railway Documentation: https://docs.railway.app
- Next.js Deployment: https://nextjs.org/docs/deployment

## Security Notes

- Never commit secrets or API keys to the repository
- Always use GitHub Secrets for sensitive data
- Keep your `RAILWAY_TOKEN` secure
- Rotate tokens regularly
- Use environment variables for configuration
