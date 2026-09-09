# MC-LEA Hotel & Suite

Premium, responsive hotel website for MC-LEA Hotel & Suite in Port Harcourt, with room discovery, booking enquiries, gallery browsing, and contact actions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `pnpm --filter @workspace/mc-lea-hotel run typecheck` — typecheck the hotel website

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mc-lea-hotel/src/App.tsx` — hotel page sections, structured hotel/room/gallery content, booking enquiry modal, and interactions
- `artifacts/mc-lea-hotel/src/index.css` — shared palette, typography, responsive styling, reveal motion, focus states, and reduced-motion rules
- `artifacts/mc-lea-hotel/.replit-artifact/artifact.toml` — web artifact routing and workflow configuration

## Architecture decisions

- The first release is frontend-only; booking enquiries are prepared as WhatsApp messages instead of being treated as confirmed reservations.
- Hotel facts that were not supplied are kept as explicit placeholders in the `HOTEL` and content constants rather than fabricated.
- Temporary Pexels visuals carry an on-page preview label so they are not presented as official MC-LEA photography.
- The site is a single-page experience with anchor navigation so the full hospitality story stays fast and easy to scan.

## Product

- Guests can browse rooms, view temporary gallery imagery in a lightbox, cycle through clearly marked review placeholders, copy the hotel address, open directions, and prepare a booking enquiry.
- The responsive navigation, booking form, and contact actions are designed for desktop, tablet, and mobile use.

## User preferences

- Keep the visual language calm, premium, clean, trustworthy, and understated.
- Never invent MC-LEA prices, reviews, awards, facilities, room specifications, phone numbers, email addresses, or social accounts.

## Gotchas

- Replace the placeholder WhatsApp number, phone, email, amenity data, room details, and preview images before treating the site as production-ready.
- The website workflow provides `PORT` and `BASE_PATH`; use the managed artifact workflow rather than starting Vite directly.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
