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
          href="/#blog"
          className="text-sm text-gray-400 hover:text-gray-900 transition-colors mb-10 inline-block"
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

        <hr className="border-gray-200 mb-8" />

        <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-3 text-center">
          {data.title}
        </h1>

        {data.date && (
          <p className="text-sm text-gray-400 mb-10 text-center">
            {formatDate(data.date)}
          </p>
        )}

        <hr className="border-gray-200 mb-10" />

        <div
          className="prose prose-gray max-w-none prose-headings:font-normal prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-justify prose-strong:text-gray-900 prose-hr:border-gray-200 prose-li:text-gray-700"
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
