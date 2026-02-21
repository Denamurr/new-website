# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production (static export)
npm run start    # Serve production build
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16 personal portfolio site** with static export (`output: 'export'` in `next.config.js`), deployed to Vercel. It uses the App Router, Turbopack, and Tailwind CSS for styling.

**Page structure:** `app/page.js` is the single homepage, assembled from section components in `components/`. The layout and global metadata live in `app/layout.js`.

**Blog system:** Blog posts are Markdown files in `posts/` with gray-matter frontmatter (`title`, `date`, `slug`). The `components/Blog.js` component reads them at build time using Node's `fs` module (server component). Individual posts are rendered at `app/blog/[slug]/page.js`, which parses Markdown to HTML via `remark`/`remark-html`. Adding a new post means creating a new `.md` file in `posts/`.

**Static export constraint:** Because `output: 'export'` is set, dynamic server features (middleware, API routes, ISR) are not available. All data fetching must happen at build time.

**Tools section:** `components/Tools.js` contains a static array of PM tools — currently placeholders. When tools are built out, they'll likely need new routes under `app/`.
