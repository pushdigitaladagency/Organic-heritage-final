// Prefixes public-folder asset paths with the deployment basePath.
//
// Next.js only auto-prefixes basePath onto next/image, next/link and _next
// assets — NEVER manual references to /public (plain <img src>, CSS url(),
// favicon/og:image in metadata, etc). Those resolve at the domain root and 404
// in production where the whole app is served under /cosmetics.
//
// The prefix is HARDCODED on purpose: .env is gitignored and absent on the
// server, and NEXT_PUBLIC_* vars are inlined at build time, so an env-based
// helper would silently emit the unprefixed path. Hardcoding avoids that.
const BASE_PATH = '/cosmetics';

export const asset = (p) => `${BASE_PATH}${p.startsWith('/') ? '' : '/'}${p}`;
