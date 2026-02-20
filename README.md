# Dena Murr Portfolio Site

A personal portfolio site built with Next.js and Tailwind CSS. Vibe coded with AI.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying to Vercel (Free)

### Option 1: Deploy via GitHub (Recommended)

1. **Create a GitHub repository**
   - Go to github.com and create a new repository
   - Name it something like `dena-site` or `portfolio`

2. **Push this code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - vibe coded with AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy" (Vercel auto-detects Next.js settings)

4. **Add your custom domain**
   - In Vercel dashboard, go to your project Settings > Domains
   - Add `denamurr.com`
   - Update your domain's DNS settings as instructed

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your Vercel account.

## Customizing

### Update your photo
Replace the emoji in `components/Hero.js` with an actual image:
```jsx
<img 
  src="/your-photo.jpg" 
  alt="Dena Murr"
  className="w-24 h-24 rounded-full object-cover"
/>
```
Add your photo to the `/public` folder.

### Update blog links
Edit `components/Blog.js` to add real links to your blog posts.

### Update social links
Edit `components/Footer.js` with your actual LinkedIn, GitHub, and email.

## Project Structure

```
dena-site/
├── app/
│   ├── globals.css      # Global styles + Tailwind
│   ├── layout.js        # Root layout + metadata
│   └── page.js          # Homepage
├── components/
│   ├── Navigation.js    # Top nav bar
│   ├── Hero.js          # Intro section
│   ├── Tools.js         # Interactive tools section
│   ├── Blog.js          # Blog posts list
│   ├── Projects.js      # Projects grid
│   └── Footer.js        # Footer with links
├── public/              # Static assets (images, etc.)
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Next Steps

- [ ] Add real blog post links
- [ ] Add your photo
- [ ] Build the RICE Prioritization Tool
- [ ] Build the BCG Matrix Analyzer
- [ ] Add analytics (Vercel Analytics is free)

---

Built with AI · 2025
