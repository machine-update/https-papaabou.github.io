# Deploy GitHub + Vercel (Public/Admin split)

This project is deployed as two Vercel projects from the same GitHub repository.

## 1) GitHub

- Repository root: `frontend`
- Main branch: `main`
- Push workflow:

```bash
git add -A
git commit -m "feat: deployment split public/admin"
git push origin main
```

## 2) Vercel projects

Create two Vercel projects that both point to the same repo and same root directory.

- Project A: `xksprod-public`
  - `APP_SURFACE=public`
- Project B: `xksprod-admin`
  - `APP_SURFACE=admin`

Build settings (both):
- Framework: Next.js
- Install command: `npm ci`
- Build command: `npm run build`

## 3) Required environment variables

Set these in both Vercel projects (with project-specific values):

- `APP_SURFACE` = `public` or `admin`
- `DATABASE_URL` = managed PostgreSQL URL
- `PAYLOAD_SECRET`
- `NEXTAUTH_SECRET`
- `CRON_SECRET`
- `PREVIEW_SECRET`
- `NEXT_PUBLIC_APP_URL` = project URL
- `NEXT_PUBLIC_SERVER_URL` = project URL

Optional:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

## 4) Routing behavior

Routing split is controlled by `src/middleware.ts`:

- `APP_SURFACE=public`
  - `/admin` and admin APIs are blocked and redirected to `/`.
- `APP_SURFACE=admin`
  - public pages are blocked and redirected to `/admin`.

## 5) Prisma production migration

Run against production DB before opening traffic:

```bash
npm run prisma:migrate:deploy
```

You can run this from CI/CD or manually from a secure environment.

## 6) Validation checklist

- Public project:
  - `/` works
  - `/admin` redirects away
- Admin project:
  - `/admin` works
  - public routes redirect to `/admin`
- Build succeeds in both projects
- Database writes work on managed PostgreSQL
