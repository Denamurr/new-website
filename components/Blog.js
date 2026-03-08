import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"

export default function Blog() {
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  const posts = filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data } = matter(fileContents)

      return {
        slug: data.slug || filename.replace(".md", ""),
        title: data.title,
        date: data.date || "",
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section id="blog" className="py-16 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Writing
      </h2>

      <div className="flex flex-col divide-y divide-gray-100">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex items-baseline justify-between py-4 group"
          >
            <span className="text-base text-gray-900 group-hover:text-blue-600 transition-colors">
              {post.title}
            </span>
            {post.date && (
              <span className="text-sm text-gray-400 ml-6 shrink-0">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
