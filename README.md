# Lushan Thrift

A full-stack e-commerce web application for selling thrift clothes in Mombasa and Kenya.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Auth:** Clerk (login, signup, role-based access)
- **Database:** Supabase (PostgreSQL)
- **Images:** Cloudinary
- **Styling:** Tailwind CSS
- **State:** Zustand (cart & wishlist)
- **PWA:** Installable, offline support, service worker, manifest

## Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account
- Supabase project
- Cloudinary account

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd lushan-thrift
npm install
```

### 2. Environment variables

Copy the example env and fill in your keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

- **Clerk:** Create an application at [clerk.com](https://clerk.com). Add sign-in/sign-up URLs and set `NEXT_PUBLIC_CLERK_*` and `CLERK_SECRET_KEY`.
- **Supabase:** Create a project at [supabase.com](https://supabase.com). Get project URL and anon key from Settings → API. Use the service role key for server-side admin operations (keep secret).
- **Cloudinary:** Create a cloud at [cloudinary.com](https://cloudinary.com). Get cloud name, API key, and API secret from Dashboard.

### 3. Database schema

In the Supabase SQL Editor, run the migrations in order:

1. **Initial schema:** paste and run the contents of `supabase/migrations/001_initial_schema.sql`.
2. **Orders (checkout):** paste and run the contents of `supabase/migrations/002_orders.sql`.
3. **M-Pesa manual checkout:** paste and run `supabase/migrations/003_checkout_mpesa.sql` (payment settings table, order location & payment fields).

Optional: run `supabase/seed.sql` to insert sample products (replace image URLs with your Cloudinary URLs).

**Email notifications:** Set SMTP variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` app password, `SMTP_SECURE` if needed), `EMAIL_FROM`, and `ADMIN_ORDERS_EMAIL` in `.env.local` so the shop emails you on new orders and M-Pesa submissions, and customers when payment is approved. Set **`NEXT_PUBLIC_APP_URL`** to your live site URL (no trailing slash) so admin emails include an **Open orders dashboard** button.

### 4. Clerk session claims (admin role)

To protect `/admin` by role:

1. In Clerk Dashboard → Sessions → Customize session token.
2. Add this claim so the role is in the token:

```json
{
  "metadata": "{{user.public_metadata}}"
}
```

3. In Users → select your user → Public metadata → Edit, add:

```json
{
  "role": "admin"
}
```

Only users with `publicMetadata.role === "admin"` can access `/admin`.

### 5. PWA icons

Add app icons for the PWA:

- `public/icons/icon-192.png` (192×192)
- `public/icons/icon-512.png` (512×512)

If missing, the app still works; add them for install prompt and home screen.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── (main)/          # Customer-facing routes (/, /shop, /cart, etc.)
│   ├── (auth)/          # Sign-in, sign-up
│   ├── admin/           # Admin dashboard (protected by role)
│   ├── api/             # API routes (cart, wishlist, products, upload)
│   ├── offline/         # Offline fallback page
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── layout/          # Header, Footer
│   ├── product/         # ProductCard, etc.
│   └── ui/              # Skeletons, etc.
├── proxy.ts             # Auth & route protection (replaces middleware in Next 16)
├── lib/
│   ├── supabase/        # Client, server, admin Supabase
│   ├── roles.ts         # checkRole for Clerk
├── store/               # Zustand (cart, wishlist)
└── types/               # DB types, globals for Clerk
```

## Features

- **Client:** Home, Shop (with category filter), Product detail, Cart, Wishlist, Profile, Sign-in/Sign-up.
- **Cart:** Persistent in DB when logged in; add, remove, update quantity, clear; subtotal.
- **Wishlist:** Add/remove, no duplicates, persisted in DB.
- **Admin:** Add/Edit/Delete products, upload image to Cloudinary, set price, description, category, size, availability; table view of all products.
- **PWA:** `manifest.json`, service worker (`public/sw.js`), offline page; installable on supported browsers.

## Deployment

- Set all env vars in your host (Vercel, etc.). **Required for build:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` must be set or the build will fail.
- Build: `npm run build`
- Start: `npm start`
- Ensure Clerk allowed redirect URLs include your production domain.

## License

Private / All rights reserved.
