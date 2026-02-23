import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface PostCardProps {
  title: string
  content: string
  banner: string
  slug: string
  id: string
  tags?: string[]
  createdAt?: string
  authorDetails: {
    name: string
    profile?: string | null
  }
}

export function PostCard({ title, id, content, banner, authorDetails, createdAt, tags }: PostCardProps) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? ''
  const hasBanner = Boolean(
    banner &&
      banner !== "null" &&
      banner !== `${apiBase}/null` &&
      banner !== "/null"
  )

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-rose-400" />

      <div className="relative w-full h-48 md:h-56 bg-gray-50">
        <Image
          src={hasBanner ? banner : "/blog.jpg"}
          alt={title}
          width={1200}
          height={600}
          className="w-full h-48 md:h-56 object-contain"
        />

      </div>

      <CardHeader className="px-6 pt-5 flex justify-between gap-3 pb-0">
        <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">{title}</h3>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="text-xs font-medium text-slate-500 bg-gray-200 rounded-full px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="px-6 pt-2 pb-6">
        <p className="text-sm text-slate-500 line-clamp-3 mb-4">{content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            { authorDetails.profile && authorDetails.profile !== `${apiBase}/null` ? (
              <Image
                src={authorDetails.profile}
                alt={authorDetails.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-contain"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow">{authorDetails.name?.[0]?.toUpperCase() ?? "B"}</div>
            )}
            <div>
              <div className="text-sm font-medium text-slate-900">{authorDetails.name}</div>
              <div className="text-xs text-slate-400">{createdAt ? new Date(createdAt).toLocaleDateString() : ""}</div>
            </div>
          </div>

          <Button className="rounded-full px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white shadow-md" asChild>
            <Link href={`/post/view/${id}`}>Read More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
