# Deployment Guide

This repository supports two deployment approaches for Railway.app:

1. **Railway Native Integration** (Recommended) - Simple, automated deployment
2. **GitHub Actions + Railway CLI** (Advanced) - For complex CI/CD requirements

Choose the approach that best fits your needs.

---

## Approach 1: Railway Native GitHub Integration (Recommended)

**Best for:** Most use cases - simple, reliable, and fully automated.

### Setup Steps

#### 1. Create Railway Account & Project

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account (if not already connected)
5. Select this repository (`spacex-impacts`)

#### 2. Configure Deployment

Railway will automatically:
- Detect this is a Next.js application
- Use the `railway.json` and `nixpacks.toml` configuration files
- Install dependencies with `npm ci`
- Build with `npm run build`
- Start the application with `npm start`

#### 3. Set Environment Variables (if needed)

If your application requires environment variables:
1. In Railway dashboard, select your service
2. Go to "Variables" tab
3. Add variables like:
   - `NODE_ENV=production` (usually set automatically)
   - Any API keys or configuration needed

#### 4. Enable PR Previews (Optional)

1. Go to your service settings in Railway
2. Enable "PR Deploys"
3. Railway will now create preview deployments for pull requests automatically

### How It Works

Once set up, Railway automatically:
- **Monitors your repository** for changes to the main branch
- **Deploys immediately** when you push to main
- **Creates preview environments** for pull requests (if enabled)
- **Manages build caching** for faster deployments
- **Provides deployment logs** in the Railway dashboard

### Benefits

- ✅ **Zero configuration** - works out of the box
- ✅ **No secrets to manage** - Railway handles authentication
- ✅ **Automatic deployments** on every push
- ✅ **Built-in preview environments** for PRs
- ✅ **Optimized builds** with smart caching
- ✅ **Simple monitoring** in Railway dashboard

### Deployment Status

- View deployments in the Railway dashboard
- Get deployment URLs automatically
- Monitor logs and metrics in real-time

---

## Approach 2: GitHub Actions + Railway CLI (Advanced)

**Best for:** Complex pipelines requiring custom checks, multi-environment deployments, or deployment gates.

### When to Use This Approach

Choose GitHub Actions if you need:
- Custom security scans or compliance checks before deployment
- Multi-cloud deployments (Railway + other platforms)
- Manual approval gates for production deployments
- Custom test suites that must pass before deploy
- Integration with other GitHub Actions workflows
- Deployment to multiple Railway services/environments

### Setup Steps

#### 1. Get Railway Token

1. Go to [Railway Dashboard](https://railway.app/account/tokens)
2. Click "New Token"
3. Give it a descriptive name (e.g., "GitHub Actions")
4. Copy the token (save it securely - shown only once)

#### 2. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to `Settings > Secrets and variables > Actions`
3. Click "New repository secret"
4. Add these secrets:

**Required:**
- **Name:** `RAILWAY_TOKEN`
- **Value:** Your Railway API token from step 1

**Optional:**
- **Name:** `RAILWAY_SERVICE_NAME`
- **Value:** Your Railway service name (defaults to `starlink-impact-viz`)

#### 3. Create Railway Project

1. Create a new project in [Railway](https://railway.app)
2. Create a service in the project
3. Note the service name for the GitHub secret above

### GitHub Actions Workflows

This repository includes two workflows:

#### Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers on:**
- Push to `main` branch
- Push to `claude/**` branches
- Pull requests to `main`

**Steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run linter (`npm run lint`)
5. Build the application (`npm run build`)
6. Upload build artifacts
7. Deploy to Railway (only on `main` branch pushes)

#### PR Preview Deployment (`.github/workflows/railway-preview.yml`)

**Triggers on:**
- Pull requests to `main` branch

**Steps:**
1. Build and test the application
2. Deploy preview environment to Railway
3. Comment on PR with deployment status

### Customizing Workflows

You can modify the workflows in `.github/workflows/` to add:

```yaml
# Add security scanning
- name: Run security audit
  run: npm audit --audit-level=high

# Add custom tests
- name: Run integration tests
  run: npm run test:integration

# Add manual approval for production
environment:
  name: production
  url: https://your-app.railway.app

# Deploy to multiple environments
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: railway up --service staging-service
```

### Benefits

- ✅ **Full control** over CI/CD pipeline
- ✅ **Custom validation** before deployment
- ✅ **Multi-environment support**
- ✅ **Deployment gates** and approvals
- ✅ **Visible in GitHub Actions** tab
- ✅ **Extensible** for complex workflows

### Trade-offs

- ❌ More complex setup
- ❌ Requires managing secrets
- ❌ Two systems to monitor

---

## Configuration Files

Both approaches use these configuration files:

### `railway.json`

Main Railway configuration:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `nixpacks.toml`

Optimized build configuration:
```toml
[phases.setup]
nixPkgs = ['nodejs_20']

[phases.install]
cmds = ['npm ci']

[phases.build]
cmds = ['npm run build']

[start]
cmd = 'npm start'
```

---

## Environment Variables

If your application needs environment variables:

### In Railway (Approach 1 & 2)

1. Go to your Railway project
2. Select your service
3. Click "Variables" tab
4. Add variables

Common Next.js variables:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com
```

### In GitHub Actions (Approach 2 only)

For build-time environment variables in GitHub Actions:

```yaml
- name: Build project
  run: npm run build
  env:
    NODE_ENV: production
    NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
```

---

## Monitoring & Troubleshooting

### Railway Dashboard

**For both approaches:**
1. View deployment logs
2. Monitor resource usage
3. Check deployment status
4. View application metrics

**Access:** [Railway Dashboard](https://railway.app/dashboard)

### GitHub Actions (Approach 2 only)

1. Go to "Actions" tab in your repository
2. View workflow runs and status
3. Check detailed logs for each step
4. Debug failed deployments

### Common Issues

#### Build Fails

**Symptoms:** Deployment fails during build phase

**Solutions:**
- Check Railway/GitHub Actions logs for errors
- Verify all dependencies are in `package.json`
- Ensure Node.js version compatibility (20.x)
- Check for TypeScript errors: `npm run build` locally

#### Deployment Fails

**Railway Native Integration:**
- Verify repository connection in Railway
- Check Railway service settings
- Review deployment logs

**GitHub Actions:**
- Verify `RAILWAY_TOKEN` secret is set correctly
- Check Railway service name matches
- Ensure token has deployment permissions

#### Application Errors

**For both approaches:**
- Check Railway logs in dashboard
- Verify environment variables are set
- Test production build locally:
  ```bash
  npm ci
  npm run build
  npm start
  ```

---

## Local Testing

Test your production build locally before deploying:

```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to test.

---

## Migration Between Approaches

### From Railway Native to GitHub Actions

1. Keep your Railway project and service
2. Get Railway token
3. Add GitHub secrets
4. Workflows will start working on next push

**Note:** Railway will still deploy on push, so you'll have duplicate deployments. Disconnect the GitHub integration in Railway if you want only GitHub Actions.

### From GitHub Actions to Railway Native

1. Remove or disable GitHub Actions workflows
2. Connect repository in Railway dashboard
3. Railway takes over deployments
4. Optionally remove GitHub secrets

---

## Best Practices

### For Railway Native Integration

- ✅ Use Railway's environment variables for configuration
- ✅ Enable PR previews for testing before merge
- ✅ Monitor deployments in Railway dashboard
- ✅ Use Railway's rollback feature if needed

### For GitHub Actions

- ✅ Keep secrets secure and rotate regularly
- ✅ Use environment protection rules for production
- ✅ Test workflows on branches before merging
- ✅ Monitor both GitHub Actions and Railway

### General

- ✅ Never commit secrets or API keys
- ✅ Use environment variables for all configuration
- ✅ Test builds locally before pushing
- ✅ Review deployment logs after changes
- ✅ Set up alerts for failed deployments

---

## Quick Start Commands

### Railway CLI (Manual Deployment)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy manually
railway up

# View logs
railway logs

# Open dashboard
railway open
```

---

## Support Resources

- **Railway Documentation:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## Security Notes

### For All Approaches

- Never commit secrets, tokens, or API keys to the repository
- Use environment variables for all sensitive data
- Review Railway access logs regularly
- Keep dependencies updated for security patches

### For GitHub Actions

- Rotate `RAILWAY_TOKEN` regularly
- Use environment protection rules
- Limit token permissions to minimum required
- Review Actions logs for suspicious activity
