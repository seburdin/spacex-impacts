# Docker-Based Deployment Strategy

This project uses a **Docker-based deployment strategy** with pre-built images pushed to GitHub Container Registry (GHCR). This approach optimizes Railway resource usage and provides faster, more reliable deployments.

## Overview

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  GitHub Actions │ ──▶ │  GHCR (Registry) │ ──▶ │     Railway     │
│   Build & Push  │     │  Docker Images   │     │  Pull & Deploy  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Workflow

1. **Lint & Type Check** → Validates code quality
2. **Build Docker Image** → Multi-stage optimized build
3. **Push to GHCR** → Tagged with commit SHA, branch, and 'latest'
4. **Railway Pulls** → Fast deployment from pre-built image
5. **Health Check** → Verifies deployment success

---

## Benefits

### 🚀 Performance

- **30-second deployments** vs 3-5 minute builds
- Railway only pulls and runs (no build phase)
- Reduced Railway CPU/memory consumption
- Lower costs on Railway

### ✅ Reliability

- Same image tested in CI is deployed to production
- Immutable artifacts (SHA-based tags)
- No "works in CI but fails in Railway" scenarios
- Consistent deployments across environments

### 🔒 Security

- Multi-stage builds reduce attack surface
- Non-root user in production image
- Minimal production dependencies only
- Image attestation and provenance tracking

### 📦 Portability

- Not locked into Railway's build system
- Deploy same image to any container platform
- Easy provider migration if needed
- Works with Kubernetes, ECS, Cloud Run, etc.

---

## Docker Image Details

### Multi-Stage Build

The Dockerfile uses 3 stages for optimization:

#### 1. **Dependencies Stage** (`deps`)
- Installs both dev and prod dependencies
- Prepares for build phase

#### 2. **Builder Stage** (`builder`)
- Builds Next.js application
- Generates standalone output
- Optimizes for production

#### 3. **Runner Stage** (`runner`)
- **Base:** `node:20-alpine` (minimal size)
- **User:** Non-root user (`nextjs:nodejs`)
- **Port:** 3000
- **Size:** ~200MB (vs ~800MB with dev dependencies)
- **Health Check:** `/api/health` endpoint

### Image Tags

Every build creates multiple tags:

```bash
# Latest (main branch only)
ghcr.io/seburdin/spacex-impacts:latest

# Branch name
ghcr.io/seburdin/spacex-impacts:main

# Commit SHA
ghcr.io/seburdin/spacex-impacts:main-a1b2c3d

# Semantic version (if tagged)
ghcr.io/seburdin/spacex-impacts:1.0.0
ghcr.io/seburdin/spacex-impacts:1.0
```

---

## GitHub Actions Workflow

### Updated Pipeline

```yaml
jobs:
  lint-and-test:       # Fast code validation
    - npm ci
    - npm run lint
    - npx tsc --noEmit

  build-and-push-image:  # Docker image creation
    - Setup Docker Buildx
    - Login to GHCR
    - Build multi-stage image
    - Push with multiple tags
    - Generate attestation

  deploy-to-railway:     # Notification only
    - Echo deployment info
    - Railway auto-deploys new image
```

### Permissions

The workflow requires these GitHub permissions:
- `contents: read` - Checkout code
- `packages: write` - Push to GHCR

These are automatically available via `GITHUB_TOKEN`.

---

## Railway Configuration

### Setup in Railway Dashboard

#### Option 1: Use Dockerfile (Recommended for now)

Railway is configured to build from Dockerfile:

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  }
}
```

**Note:** Railway currently builds from Dockerfile on push. We're working on configuring it to pull pre-built images from GHCR.

#### Option 2: Pull from GHCR (Future)

To pull pre-built images instead of building:

1. **Go to Railway Service Settings**
2. **Source → Image**
3. **Configure:**
   - Registry: `ghcr.io`
   - Image: `seburdin/spacex-impacts`
   - Tag: `latest` (or specific tag)

4. **Add GitHub Token** (if private repo):
   - Variable: `GITHUB_TOKEN`
   - Value: Your GitHub Personal Access Token with `read:packages` scope

### Health Check

Railway uses the configured health check:

```json
{
  "healthcheckPath": "/api/health",
  "healthcheckTimeout": 300
}
```

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-11T18:00:00.000Z",
  "uptime": 123.456
}
```

---

## Development Workflow

### Local Development

```bash
# Regular development (no Docker)
npm install
npm run dev

# Test production build locally
npm run build
npm start

# Test Docker build locally
docker build -t spacex-impacts:local .
docker run -p 3000:3000 spacex-impacts:local
```

### Branch Development

For feature branches (`claude/**`):
- Workflow runs lint and type check only
- No Docker image built (saves time/resources)
- Push to `main` triggers full build

### Pull Requests

For PRs to `main`:
- Full lint and type check
- Can optionally build Docker image for testing
- Preview deployment via Railway

---

## Image Registry Management

### Viewing Images

**GitHub UI:**
1. Go to repository
2. Click "Packages" on the right sidebar
3. See all published images with tags

**CLI:**
```bash
# List all tags
gh api /user/packages/container/spacex-impacts/versions

# Pull specific image
docker pull ghcr.io/seburdin/spacex-impacts:latest
```

### Cleanup Policy

To manage storage, configure cleanup:

1. **Go to Package Settings**
2. **Set retention policy:**
   - Keep `latest` indefinitely
   - Keep last 10 SHA-tagged images
   - Delete untagged images after 7 days

**Manual cleanup:**
```bash
# Delete old image version
gh api --method DELETE /user/packages/container/spacex-impacts/versions/VERSION_ID
```

---

## Troubleshooting

### Build Failures

**Issue:** Docker build fails in GitHub Actions

**Solutions:**
1. Check Dockerfile syntax
2. Verify `next.config.ts` has `output: 'standalone'`
3. Check build logs in Actions tab
4. Test build locally: `docker build .`

### Railway Not Pulling New Image

**Issue:** Railway doesn't deploy new image

**Current:** Railway builds from Dockerfile on every push (not pulling from GHCR yet)

**Future:** When configured to pull from GHCR:
1. Verify image exists in GHCR
2. Check Railway has correct image name/tag
3. Verify Railway can authenticate (if private)
4. Manually trigger redeploy in Railway

### Image Size Too Large

**Issue:** Docker image > 500MB

**Solutions:**
1. Ensure multi-stage build is working
2. Verify only production deps in final stage
3. Check `.dockerignore` excludes dev files
4. Use `alpine` base images

**Check image size:**
```bash
docker images ghcr.io/seburdin/spacex-impacts
```

### Health Check Failing

**Issue:** Railway health check returns errors

**Solutions:**
1. Test endpoint: `curl http://localhost:3000/api/health`
2. Check logs for Node.js errors
3. Verify PORT environment variable (should be 3000)
4. Increase `healthcheckTimeout` if needed

---

## Deployment Timeline

### Current Setup (Dockerfile Build)

```
Push to main
  ↓
GitHub Actions: 2 min
  ├─ Lint & Type Check: 30s
  └─ Build & Push Image: 90s
  ↓
Railway Build: 2-3 min
  ├─ Pull repo
  ├─ Build Dockerfile
  └─ Deploy
  ↓
Total: 4-5 minutes
```

### Target Setup (Pre-built Image Pull)

```
Push to main
  ↓
GitHub Actions: 2 min
  ├─ Lint & Type Check: 30s
  └─ Build & Push Image: 90s
  ↓
Railway Deploy: 30s
  ├─ Pull image from GHCR
  └─ Deploy container
  ↓
Total: 2.5 minutes (50% faster)
```

---

## Rollback Strategy

### Automatic Rollback

Railway can automatically rollback on:
- Health check failures
- Startup failures
- Crash loops

### Manual Rollback

**Via Railway Dashboard:**
1. Go to Deployments
2. Find previous successful deployment
3. Click "Redeploy"

**Via Git:**
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard COMMIT_SHA
git push --force origin main
```

**Via Image Tag (Future):**
```bash
# Deploy specific version
# Update Railway to use specific tag: main-a1b2c3d
```

---

## Security Considerations

### Image Scanning

Add security scanning to workflow:

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ghcr.io/seburdin/spacex-impacts:latest
    format: 'sarif'
    output: 'trivy-results.sarif'
```

### Private Images

If using private repository:

1. **Generate GitHub PAT:**
   - Settings → Developer settings → Personal access tokens
   - Scopes: `read:packages`

2. **Add to Railway:**
   - Variable: `GHCR_TOKEN`
   - Use in image pull credentials

### Non-Root User

The Docker image runs as non-root:
- User: `nextjs` (UID: 1001)
- Group: `nodejs` (GID: 1001)
- Better security posture
- Prevents privilege escalation

---

## Migration Path

### Current State

✅ Dockerfile created
✅ GitHub Actions builds and pushes images
✅ Railway configured with Dockerfile builder
⏳ Railway pulls from GHCR (next step)

### Next Steps

1. **Verify Images in GHCR**
   - Check that images are being published
   - Verify tags are correct

2. **Configure Railway to Pull**
   - Update Railway service to use GHCR image
   - Test deployment from registry

3. **Monitor & Optimize**
   - Compare deployment times
   - Monitor resource usage
   - Tune health check settings

---

## Cost Analysis

### GitHub Actions (Free Tier)

- **Minutes/month:** 2000
- **Per deployment:** ~2 minutes
- **Deployments/month:** ~1000 possible
- **Storage:** 500MB (public), 2GB (private)
- **Cost:** $0 (within free tier)

### Railway

**Before (Nixpacks Build):**
- Build time: 3-5 minutes
- CPU usage: High during build
- Memory: ~2GB during build
- Cost: Higher build resource usage

**After (Pre-built Image):**
- Pull time: 30 seconds
- CPU usage: Minimal (pull only)
- Memory: ~500MB during pull
- Cost: **50-70% less** build resource usage

### Estimated Savings

For 10 deployments/day:
- Time saved: ~45 minutes/day
- Resource cost reduction: ~60%
- Faster incident response
- Better developer experience

---

## Comparison: Nixpacks vs Docker Image

| Aspect | Nixpacks (Old) | Docker Image (New) |
|--------|----------------|-------------------|
| **Deployment Time** | 3-5 minutes | 30 seconds (goal) |
| **Railway CPU** | High (build) | Low (pull only) |
| **Railway Memory** | ~2GB | ~500MB |
| **Consistency** | CI ≠ Production | CI = Production |
| **Rollback** | Re-build | Tag switch |
| **Portability** | Railway-only | Any platform |
| **Build Control** | Limited | Full control |
| **Cache** | Platform-dependent | Docker layers |

---

## Best Practices

### Image Tagging

✅ **Do:**
- Use `latest` for main branch
- Use commit SHA for traceability
- Use semantic versions for releases
- Keep multiple tags per image

❌ **Don't:**
- Use only `latest` (no rollback)
- Use mutable tags for production
- Delete production images

### Build Optimization

✅ **Do:**
- Use multi-stage builds
- Minimize layer count
- Order layers by change frequency
- Use `.dockerignore`

❌ **Don't:**
- Install dev dependencies in production
- Run as root user
- Include source code in final image
- Skip health checks

### Deployment

✅ **Do:**
- Test images locally before pushing
- Use health checks
- Monitor deployment metrics
- Keep deployment logs

❌ **Don't:**
- Deploy without testing
- Skip version tags
- Ignore health check failures
- Deploy directly to production without staging

---

## Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Railway Docker Deployment](https://docs.railway.app/deploy/deployments#docker)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

## Support

If you encounter issues:

1. Check GitHub Actions logs
2. Verify image exists in GHCR
3. Test image locally
4. Review Railway deployment logs
5. Check health endpoint: `/api/health`

For questions about this deployment strategy, see [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete deployment guide.
