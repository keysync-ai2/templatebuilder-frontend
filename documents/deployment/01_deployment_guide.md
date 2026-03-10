# Email Template Builder — Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd project/template-builder
npm install
npm run dev
```

Dev server starts at `http://localhost:3000`.

### Environment Variables

Create `.env.local` in the project root:

```
# API endpoint (when backend is ready)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Other config
NEXT_PUBLIC_APP_NAME=Email Template Builder
```

---

## Production Build

```bash
npm run build
npm run start
```

Build output is in `.next/` directory. Production server starts on port 3000.

---

## AWS Amplify Deployment

### Setup

1. Push code to GitHub repository
2. Go to AWS Amplify Console → Create new app → Connect to GitHub
3. Select repository and branch (`main`)
4. Amplify auto-detects Next.js and configures build settings

### Build Settings (amplify.yml)

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Environment Variables (Amplify Console)

Set in Amplify Console → App settings → Environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Production API URL |

### Custom Domain (Optional)

Amplify Console → Domain management → Add domain → Follow DNS verification steps.

---

## Deployment Checklist

| Check | Status |
|-------|--------|
| `npm run build` succeeds locally | |
| No TypeScript/ESLint errors | |
| Environment variables set in Amplify | |
| GitHub repo connected to Amplify | |
| Build succeeds in Amplify | |
| App loads at Amplify URL | |
| All widgets render correctly | |
| DnD works on deployed version | |

---

**Summary**: Local dev with `npm run dev`. Deploy to AWS Amplify V2 via GitHub push → auto-build → auto-deploy. Next.js build output served via CloudFront (handled by Amplify). No backend infrastructure needed currently — all state is client-side.
