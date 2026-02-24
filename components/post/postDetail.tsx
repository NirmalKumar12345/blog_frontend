"use client"

import { useEffect, useState } from "react"
import { deletePostService, getPostByIdService } from "@/services/post.services"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Heart } from "lucide-react"
import { set } from "zod"

interface PostDetailProps {
  id: string
}

function tagColor(tag: string) {
  const colors = [
    'linear-gradient(90deg,#6366f1,#ec4899)',
    'linear-gradient(90deg,#06b6d4,#7c3aed)',
    'linear-gradient(90deg,#fb7185,#f97316)',
    'linear-gradient(90deg,#34d399,#10b981)'
  ]
  let hash = 0
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function PostDetail({ id }: PostDetailProps) {
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState<number>(0)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostByIdService(id)
        const data = res?.post ?? res
        setPost(data)
      } catch (err: any) {
        toast.error(err?.response?.data?.msg || "Failed to load post")
        router.back()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, router])
  const handleDelete = async (id: string) => {
    try {
      const res = await deletePostService(id)
      toast.success(res?.msg)
      router.push("/post")
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "Failed to delete post")
    }
  }
  if (loading) return <p>Loading...</p>
  if (!post) return <p>No post found</p>
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? ''
  const hasBanner = Boolean(
    post.banner &&
    post.banner !== "null" &&
    post.banner !== `${apiBase}/null` &&
    post.banner !== "/null"
  )
  const bannerSrc = hasBanner ? (post.banner.startsWith('http') || post.banner.startsWith('//') ? post.banner : `${apiBase}/${post.banner}`) : undefined
  const profileSrc = post.authorDetails?.profile ? (post.authorDetails.profile.startsWith('http') || post.authorDetails.profile.startsWith('//') ? post.authorDetails.profile : `${apiBase}/${post.authorDetails.profile}`) : undefined
  return (
    <div className="p-6 lg:p-12 flex min-h-screen justify-center items-center bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <div className=" w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-10 space-y-6 border border-gray-100">
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src={bannerSrc ?? "/blog.jpg"}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-64 md:h-96 object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-purple-200/20" />
          <div className="absolute left-4 bottom-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center overflow-hidden ring-2 ring-white">
              <Image
                src={profileSrc ?? '/profile.jpg'}
                alt={post.authorDetails?.name || 'Author'}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="text-white">
              <div className="font-semibold drop-shadow-md">{post.authorDetails?.name}</div>
              <div className="text-sm opacity-90">{new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Title and meta */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400 text-transparent bg-clip-text">{post.title}</h1>
          <div className="flex items-center gap-3">
            <button
              aria-pressed={liked}
              onClick={() => {
                setLiked((v) => !v)
                setLikesCount((c) => (liked ? c - 1 : c + 1))
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition transform hover:-translate-y-0.5 cursor-pointer ${liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
              <Heart className={`${liked ? 'fill-red-600' : 'text-gray-700'}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button
              onClick={async () => {
                const url = typeof window !== 'undefined' ? window.location.href : ''
                try {
                  if (navigator.share) {
                    await navigator.share({ title: post.title, url })
                  } else {
                    await navigator.clipboard.writeText(url)
                    toast.success('Link copied to clipboard')
                  }
                } catch (err) {
                  toast.error('Unable to share')
                }
              }}
              className="cursor-pointer px-3 py-2 rounded-full bg-slate-800 text-white text-sm hover:bg-slate-700 transition"
            >
              Share
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {post.tags?.map((tag: string) => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-sm font-medium text-white`}
              style={{ background: tagColor(tag) }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="prose max-w-none text-gray-800 whitespace-pre-line">
          {post.content}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => router.push("/post")}
          >
            Back
          </Button>

          <div className="flex gap-4">
            <Button className="cursor-pointer bg-red-500 hover:bg-red-400 text-white" onClick={() => handleDelete(post._id)}>Delete</Button>
            <Button
              className="cursor-pointer bg-black text-white hover:bg-gray-900 hover:text-white"
              variant="ghost"
              onClick={() => router.push(`/post/edit/${post._id}`)}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

