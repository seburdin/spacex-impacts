# GitHub Actions Workflows

This repository includes two automated CI/CD workflows for building, testing, and deploying the application.

## Workflows Overview

### 1. CI/CD Pipeline (`ci-cd.yml`)

Main workflow for continuous integration and deployment.

**Automatic Triggers:**
- ✅ Push to `main` branch → Full CI + Deploy to Railway
- ✅ Push to `claude/**` branches → CI only (no deploy)
- ✅ Pull requests to `main` → CI only (no deploy)

**Manual Trigger:**
- Go to **Actions** → **CI/CD Pipeline** → **Run workflow**
- Options:
  - **Branch**: Select which branch to run on
  - **Deploy to Railway**: Choose `true` to deploy, `false` for CI only

**Steps:**
1. Install dependencies
2. Run ESLint
3. TypeScript type checking
4. Build Next.js application
5. Upload build artifacts
6. Deploy to Railway (only if triggered from `main` or manual with deploy=true)

---

### 2. Railway Preview Deployment (`railway-preview.yml`)

Workflow for creating preview deployments.

**Automatic Triggers:**
- ✅ Pull requests to `main` → Deploy preview environment

**Manual Trigger:**
- Go to **Actions** → **Railway Preview Deployment** → **Run workflow**
- Options:
  - **Branch**: Select which branch to deploy
  - **Environment**: Choose `preview` or `staging`

**Steps:**
1. Install dependencies
2. Run ESLint
3. TypeScript type checking
4. Build Next.js application
5. Deploy to Railway
6. Comment on PR with deployment status (only for PR triggers)

---

## How to Trigger Manually

### Via GitHub Web Interface

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select the workflow you want to run from the left sidebar:
   - **CI/CD Pipeline**
   - **Railway Preview Deployment**
4. Click **Run workflow** button (top right)
5. Fill in the options:
   - Select the branch
   - Configure workflow-specific inputs
6. Click **Run workflow**

### Via GitHub CLI

```bash
# Run CI/CD Pipeline (CI only)
gh workflow run "CI/CD Pipeline" --ref main -f deploy=false

# Run CI/CD Pipeline (with deployment)
gh workflow run "CI/CD Pipeline" --ref main -f deploy=true

# Run Railway Preview Deployment
gh workflow run "Railway Preview Deployment" --ref your-branch -f environment=preview
```

---

## Workflow Requirements

### Environment Variables

Both workflows use:
- `NODE_VERSION: '20'` - Node.js version
- `NODE_ENV: production` - Build environment
- `NEXT_DISABLE_FONT_CACHE: '1'` - Helps with CI font loading

### GitHub Secrets (Optional for Railway Deployment)

For Railway deployment to work, configure these secrets:

**Repository Settings → Secrets and variables → Actions:**

1. **`RAILWAY_TOKEN`** (Required)
   - Your Railway API token
   - Get it from: https://railway.app/account/tokens

2. **`RAILWAY_SERVICE_NAME`** (Optional)
   - Your Railway service name
   - Defaults to: `starlink-impact-viz`

**Note:** If using Railway's native GitHub integration, these secrets are not needed. Railway will handle deployments automatically.

---

## Workflow Behavior

### CI/CD Pipeline Deployment Logic

Deploys to Railway when:
- Automatic push to `main` branch
- Manual trigger with `deploy=true` option

Does NOT deploy when:
- Push to `claude/**` branches
- Pull requests
- Manual trigger with `deploy=false`

### Railway Preview Deployment Logic

Creates preview environment when:
- Pull request opened/updated to `main`
- Manual trigger from any branch

---

## Troubleshooting

### Workflow Not Appearing in Actions Tab

1. Make sure the workflow files are in `.github/workflows/`
2. Ensure YAML syntax is valid
3. Push the workflow files to the repository
4. Wait a few seconds for GitHub to detect them

### "Run workflow" Button Not Visible

1. Make sure you're on the **Actions** tab
2. Click on the specific workflow name in the left sidebar
3. The button appears only if the workflow has `workflow_dispatch` trigger
4. You need write permissions to the repository

### Build Failures

**TypeScript errors:**
- Check `npx tsc --noEmit` locally
- All type errors must be fixed before build succeeds

**Font loading errors:**
- These are usually warnings, not failures
- The workflow sets `NEXT_DISABLE_FONT_CACHE=1` to mitigate this

**Deployment errors:**
- Verify `RAILWAY_TOKEN` secret is set correctly
- Check Railway service name matches
- Review Railway dashboard logs

---

## Best Practices

### When to Use Manual Triggers

✅ **Good use cases:**
- Testing workflow changes on a feature branch
- Deploying a hotfix from a non-main branch
- Running CI checks without creating a PR
- Creating a staging deployment for testing

❌ **Avoid:**
- Regular deployments (let automatic triggers handle this)
- Bypassing required checks
- Deploying untested code to production

### Recommended Workflow

1. **Development**: Push to `claude/**` branches → CI runs automatically
2. **Review**: Create PR to `main` → CI + preview deployment
3. **Production**: Merge to `main` → Automatic production deployment
4. **Hotfixes**: Manual trigger from hotfix branch with `deploy=true`

---

## Monitoring

### View Workflow Runs

1. Go to **Actions** tab
2. See all workflow runs with status
3. Click any run to see detailed logs
4. Each step shows duration and output

### Status Badges (Optional)

Add to your README.md:

```markdown
[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/spacex-impacts/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/spacex-impacts/actions/workflows/ci-cd.yml)

[![Railway Preview](https://github.com/YOUR_USERNAME/spacex-impacts/actions/workflows/railway-preview.yml/badge.svg)](https://github.com/YOUR_USERNAME/spacex-impacts/actions/workflows/railway-preview.yml)
```

---

## Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Railway Deployment Guide](../../DEPLOYMENT.md)
- [Manual Trigger (workflow_dispatch)](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)
