This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses system fonts, including Japanese system fonts, without external font downloads.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## UI design

- The default appearance follows the OS color scheme. The sidebar offers System, Light, and Dark overrides, saved under `site-theme` in localStorage.
- Semantic colors are defined as RGB tokens in `app/globals.css` and exposed through `tailwind.config.ts`. Use `canvas`, `surface`, `soft`, `ink`, `muted`, `line`, and `accent` rather than fixed light/dark colors.
- Navigation switches to an accessible modal menu below 1024px. Content and tool grids adapt down to 320px.
- Pixel icons share a seven-pixel grid in `app/components/PixelIcon.tsx`. Page headings and tool headings use shared components.
- Article URLs and existing tools remain available; the article library has category/tag filters, and the toolbox supports keyword search and category selection.
