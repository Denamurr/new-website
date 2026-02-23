# Dena Murr — Product Intelligence Lab

A personal site built with Next.js (App Router) and Tailwind CSS, deployed via Vercel.

The site functions as a structured product analysis lab. Posts are treated as data objects, with optional AI-assisted drafting and metadata tagging. The goal is to experiment with AI-augmented workflows while maintaining editorial judgment and structured reasoning.

⸻

## Tech Stack
	•	Next.js (App Router)
	•	Tailwind CSS
	•	Vercel (CI/CD + hosting)
	•	Node.js 18+
	•	Optional: OpenAI API (for structured drafting + metadata experiments)

### Local Development

Prerequisites
	•	Node.js 18+
	•	npm

Install dependencies

3. Visit [http://localhost:3000]
4. 

### Deploy via GitHub which auto-deploys to Vercel

1. **Create a GitHub repository**
   - Go to github.com and create a new repository
   - Name it something like `dena-site` or `portfolio`

Production Deployment Flow
	1.	Push changes to the main branch.
	2.	GitHub triggers Vercel.
	3.	Vercel builds the project.
	4.	If build passes, production is updated.


## Project Structure

app/
  layout.js          # Root layout
  page.js            # Homepage dashboard
  blog/[slug]/       # Individual post pages

components/
  Hero.js
  LabDashboard.js
  DashboardMetrics.js
  RecentTable.js
  ThemeChips.js
  ExperimentTracker.js
  Tools.js
  Projects.js
  Navigation.js
  Footer.js

posts/               # Markdown content source
data/                # Structured metadata (if used)

public/              # Static assets


## Content Architecture

Posts live in /posts.

Each post may optionally include structured metadata:
	•	category
	•	themes
	•	aiAugmented (boolean)
	•	written date
	•	updated date

The dashboard reads from structured metadata rather than rendering raw markdown lists.

⸻

## AI Layer (Optional + Experimental)

The AI layer is used selectively for:
	•	Structured first-draft scaffolding
	•	TL;DR generation
	•	Theme extraction experiments

AI output is always reviewed and edited before publishing.

No automated publishing.

⸻

## Customization

Update profile photo

Replace placeholder in components/Hero.js and add image to /public.

Update metadata

Modify structured data in /data or frontmatter in /posts.

Add new analysis

Add markdown file to /posts and update metadata schema if needed.

⸻

## Roadmap
	•	Replace static metrics with computed values
	•	Automate theme counting
	•	Implement structured AI summary generation
	•	Improve dashboard UI hierarchy
	•	Add lightweight analytics

⸻

## Philosophy

This site is an experiment in AI-augmented product thinking.

The objective is not automation for its own sake, but leverage. Structure first. Iteration second. Systems over decoration.

⸻

Built and maintained by Dena Murr.
