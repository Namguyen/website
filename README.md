# Terrafound — Company Website

Company website for **Terrafound**: General Trading · AI Consultancy.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4.

---

## 1. Run locally

Requirements: **Node.js ≥ 20.9** (LTS recommended).

```bash
npm install
cp .env.example .env.local   # then edit NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command             | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run build`     | Production build (type-checks too)   |
| `npm start`         | Serve the production build           |
| `npm run typecheck` | TypeScript check only                |

## 2. Project structure

```
content/                     ← ALL editable content lives here
  copy.ts                    Text for every page
  site.ts                    Company info: email, phone, address, map, socials
public/
  images/placeholders/       Brand-coloured SVG placeholders → replace with real photos
  icon.svg                   Favicon
src/
  lib/                       routes, SEO helper, shared form validation, JSON-LD helper, business lines
  app/
    layout.tsx               Root layout (fonts, header, footer, Organization JSON-LD)
    page.tsx                 Home
    general-trading/  ai-consultancy/  about/  contact/
    not-found.tsx, opengraph-image.tsx, sitemap.ts, robots.ts
    api/contact/route.ts     Form endpoint (mock — logs to console)
  components/
    layout/                  Header (sticky + mobile menu), Footer, Logo
    ui/                      Container, ButtonLink, SectionHeading, Reveal, Icon, PlaceholderNote
    sections/                PageHero, FeatureGrid, ProcessSteps, Faq, CtaBanner, home/*
    forms/                   LeadForm, ContactFormWithParams
```

### Pages

| Route               | Content                                                                         |
| ------------------- | ------------------------------------------------------------------------------- |
| `/`                 | Hero + 2 shortcuts, intro & stats, business lines, why us, partners, testimonials, CTA |
| `/general-trading`  | 5-step sourcing timeline, categories, logistics, sourcing request form          |
| `/ai-consultancy`   | Services, process, case studies, FAQ (+ FAQ schema), booking CTA                |
| `/about`            | Story, mission/vision, values, team                                             |
| `/contact`          | Contact form, details, map                                                      |

## 3. Editing content

- **Text:** edit `content/copy.ts`.
- **Company details / map:** edit `content/site.ts`.

### ⚠️ Placeholders to replace before launch

Search the project for `[placeholder]`, `[Placeholder]`, `[X`, `[Client` and `[Full name]`:

- Statistics (years, orders, partners, countries) — `home.intro.stats`
- Address, phone, email, business registration number, map URL — `content/site.ts`, `Footer.tsx`
- Partner logos — `src/components/sections/home/Partners.tsx`
- Testimonials, case-study results, team names & photos — `content/copy.ts`
- Response time "[X] business day(s)", AI project durations
- Social links, privacy policy link
- All images in `public/images/placeholders/` (keep the same filenames, or update paths in
  `src/lib/business-lines.ts` and the page files). Real photos should be JPG/WebP — `next/image`
  optimises them automatically (AVIF/WebP, responsive sizes, lazy-loading).

## 4. Forms

All forms post to `POST /api/contact` with a `kind` of `contact` or `sourcing`.

- Validation rules live in `src/lib/validation.ts` and run **both** in the browser and in the API route.
- Includes a honeypot field against basic spam bots.
- CTAs deep-link into the contact form with pre-filled values, e.g.
  `/contact?interest=ai` or `/contact?interest=trading&product=Steel pipes`.
- **Currently a mock:** submissions are printed to the server console. See the `TODO` block in
  `src/app/api/contact/route.ts` for wiring Resend / SMTP / a CRM, plus rate-limiting and CAPTCHA suggestions.

## 5. SEO & accessibility

- Per-page `<title>`, meta description, canonical URL, Open Graph & Twitter tags.
- Generated `/sitemap.xml` and `/robots.txt`. Set `NEXT_PUBLIC_SITE_URL` so absolute URLs are correct.
- Auto-generated Open Graph image (`src/app/opengraph-image.tsx`).
- JSON-LD: `Organization` (all pages) and `FAQPage` (AI page).
- Semantic headings (one `h1` per page), skip-to-content link, visible focus styles, labelled form fields with
  `aria-invalid`/`aria-describedby`, keyboard-accessible mobile menu (Esc closes), native `<details>` FAQ,
  `prefers-reduced-motion` respected; scroll animations never hide content when JS is disabled.

## 6. Deploy

### Cloudflare Workers (current setup)

The site runs on Cloudflare Workers via the [OpenNext adapter](https://opennext.js.org/cloudflare)
(`@opennextjs/cloudflare`). Config: `wrangler.jsonc` and `open-next.config.ts`.

```bash
npx wrangler login     # once per machine — opens the browser to authorise
npm run preview        # build + run locally in the Workers runtime (http://localhost:8787)
npm run deploy         # build + publish to https://terrafound.<your-subdomain>.workers.dev
```

**Updating the live site:** edit the code/content (e.g. `content/copy.ts`), then run `npm run deploy` again.
The URL stays the same; the new version is live within a minute or two. Previous versions can be rolled
back from the Cloudflare dashboard (Workers & Pages → terrafound → Deployments).

**Automatic deploys (optional):** push the project to GitHub, then in the Cloudflare dashboard open
Workers & Pages → terrafound → Settings → Builds → connect the repository, with build command
`npx opennextjs-cloudflare build` and deploy command `npx opennextjs-cloudflare deploy`.
Every push to the main branch then redeploys the site.

**Custom domain:** Workers & Pages → terrafound → Settings → Domains & Routes → Add custom domain
(the domain must be on your Cloudflare account). Then set `NEXT_PUBLIC_SITE_URL` in `.env.local`
(or in the build settings) to that domain and redeploy, so canonical URLs and the sitemap are correct.

> OpenNext warns that Windows is not officially supported. Building and previewing on Windows was tested
> and works; if you ever hit odd build errors, run the deploy from WSL or let Cloudflare build from GitHub.

### Vercel (alternative)

1. Push the project to GitHub/GitLab.
2. Import it at [vercel.com/new](https://vercel.com/new) — the framework is auto-detected.
3. Add environment variable `NEXT_PUBLIC_SITE_URL=https://your-domain.com` (and email keys once wired).
4. Add your custom domain in Project → Settings → Domains.

### Any Node.js server / VPS

```bash
npm ci
npm run build
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm start -- -p 3000
```

Run behind a reverse proxy (Nginx/Caddy) with HTTPS, and keep it alive with a process manager such as `pm2`
(`pm2 start npm --name terrafound -- start`).

> The contact form needs the API route, so the site requires a Node.js runtime rather than a pure static export.

## 7. Security notes

`package.json` pins Next.js 15.5.28 (patched) and uses `overrides` to force patched versions of `postcss`
and `sharp`. Run `npm audit` periodically.
