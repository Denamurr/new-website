import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"

export default function Blog() {
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContents)

    return {
      slug: filename.replace(".md", ""),
      title: data.title,
    }
  })

  return (
    <section id="blog" className="py-16 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Writing
      </h2>

      <div className="flex flex-col space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="text-lg text-gray-900 hover:text-blue-600"
          >
            {post.title}
          </Link>
        ))}
      </div>
    </section>
  )
}
