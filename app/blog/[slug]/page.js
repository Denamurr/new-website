import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import Link from "next/link"
import Image from "next/image"

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  return filenames.map((filename) => ({
    slug: filename.replace(".md", ""),
  }))
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function BlogPost({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const postsDirectory = path.join(process.cwd(), "posts")
  const filePath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, "utf8")

  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(content)

  const contentHtml = processedContent.toString()

  return (
    <main className="pt-24 pb-24 px-6">
      <article className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm transition-colors mb-10 inline-block" style={{ color: '#8899bb' }}
        >
          ← Back
        </Link>

        {data.image && (
          <div className="mb-8">
            <div className="relative w-full aspect-video rounded-sm overflow-hidden">
              <Image
                src={data.image}
                alt={data.image_alt || data.title}
                fill
                className="object-cover"
              />
            </div>
            {data.image_caption && (
              <p className="text-xs text-gray-400 text-center mt-2">
                {data.image_caption}
              </p>
            )}
          </div>
        )}

        <hr className="mb-8" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <h1 className="text-3xl font-bold leading-snug mb-3 text-center" style={{ color: '#e8edf8' }}>
          {data.title}
        </h1>

        {data.date && (
          <p className="text-sm mb-10 text-center" style={{ color: '#8899bb' }}>
            {formatDate(data.date)}
          </p>
        )}

        <hr className="mb-10" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <div
          className="prose max-w-none prose-headings:font-normal prose-p:leading-normal prose-p:text-justify prose-hr:border-opacity-10 prose-img:rounded-xl prose-img:mx-auto prose-img:block"
          style={{ '--tw-prose-body': '#c8d4e8', '--tw-prose-headings': '#e8edf8', '--tw-prose-bold': '#e8edf8', '--tw-prose-hr': 'rgba(255,255,255,0.08)' }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {data.tool_href && (
          <div className="mt-16 border border-gray-200 rounded-sm p-8 text-center">
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Try it yourself</p>
            <p className="text-gray-700 mb-5">Use the {data.tool_label} to score your AI features with these adjustments in mind.</p>
            <Link
              href={data.tool_href}
              className="inline-block text-sm font-medium text-gray-900 border border-gray-900 px-5 py-2 hover:bg-gray-900 hover:text-white transition-colors"
            >
              Open the {data.tool_label} →
            </Link>
          </div>
        )}
      </article>
    </main>
  )
}
