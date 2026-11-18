# IMIS Global digital business cards

A single, administrator-managed digital business card system for IMIS Global. Every employee card uses the visual structure and branding from the original Trevor Evans card. There are no employee accounts, employee dashboards, public registration flows, or per-employee repositories.

## Architecture

- Next.js App Router, React, TypeScript and Tailwind CSS
- Vercel hosting (one application and one project for every card)
- Supabase Postgres for card data and Supabase Storage for optional profile photographs
- Server-only Supabase secret; browsers never receive database credentials
- One administrator identity configured through environment variables
- Scrypt password verification, signed HTTP-only sessions and database-backed login throttling
- RLS enabled with no public table policies; all reads and writes are made by trusted server code

Published cards have permanent URLs at `/card/{slug}`. A slug is created once and is deliberately not editable.

## Local setup

1. Install Node.js 22 or newer and run `npm install`.
2. Create a Supabase project.
3. Apply [the database migration](supabase/migrations/20261118081051_imis_digital_cards.sql). It creates the tables, RLS configuration, image bucket and Trevor's reference card.
4. Copy `.env.example` to `.env.local` and fill in every value.
5. Generate the administrator password hash:

   ```sh
   npm run hash-password -- "a-long-unique-administrator-password"
   ```

6. Start the app with `npm run dev`, then open `/admin/login`.

The Supabase key must be a server-side secret key (`sb_secret_...`, or the legacy service-role key). Never expose it in a `NEXT_PUBLIC_` variable.

## Administrator workflow

1. Sign in at `/admin/login`.
2. Create an employee card with the three required fields and any optional information.
3. Preview and review the card.
4. Publish it from the dashboard.
5. Copy the permanent public URL or NFC link, or download its QR PNG.
6. To program an NFC card in NFC Tools, choose **Write → Add a record → URL / URI**, paste the NFC link, tap **Write**, and hold the phone over the card.

Unpublishing immediately removes the public page while retaining its slug and data. Editing never changes the permanent URL.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

## Vercel deployment

Import this single repository into one Vercel project. Add `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` to Production, Preview and Development as appropriate. Deploy with `vercel --prod`.

After attaching a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy so QR codes, NFC links, canonical metadata and shares all contain the final permanent origin.
