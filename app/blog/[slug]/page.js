import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  return filenames.map((filename) => ({
    slug: filename.replace(".md", ""),
  }))
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
    <article className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  )
}