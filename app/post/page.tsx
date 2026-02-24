"use client"

import { Header } from "@/components/header"
import { PostCard } from "@/components/post/postCard"
import PostHeader from "@/components/postHeader"
import { getAllPostService } from "@/services/post.services"
import { useEffect, useState } from "react"
import type { Post } from "@/api/types/post.model"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export default function Post() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/')
      return
    }

    const fetchPost = async () => {
      try {
        const res = await getAllPostService(search)
        setPosts(res?.data?.post ?? res?.post ?? [])
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [search])

  if (loading) return <p>Loading...</p>

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <div className="px-10 py-3 flex-col flex gap-4">
        <PostHeader search={search} setSearch={setSearch} />
        <div className="flex pt-5 justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.length === 0 ? <p className="flex justify-center text-center items-center font-bold">No posts found</p> : posts.map((post) => {
              const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? ''
              const bannerUrl = post.banner && (post.banner.startsWith('http') || post.banner.startsWith('//')) ? post.banner : `${apiBase}/${post.banner}`
              const profileUrl = post?.authorDetails?.profile && (post.authorDetails.profile.startsWith('http') || post.authorDetails.profile.startsWith('//')) ? post.authorDetails.profile : `${apiBase}/${post?.authorDetails?.profile}`
              return (
                <PostCard
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  tags={post.tags}
                  content={post.content}
                  banner={bannerUrl}
                  slug={post.slug}
                  createdAt={post.createdAt}
                  authorDetails={{
                    name: post?.authorDetails?.name ?? "",
                    profile: post?.authorDetails?.profile ? profileUrl : null,
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
