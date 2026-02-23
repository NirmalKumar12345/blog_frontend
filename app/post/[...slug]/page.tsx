"use client"

import PostForm from "@/components/post/postForm"
import { useParams } from "next/navigation"
import PostDetail from "@/components/post/postDetail"

export default function PostDynamicPage() {
  const params = useParams()
  const slug = params?.slug as string[]

  if (!slug) return null

  // CREATE
  if (slug[0] === "create") {
    return <PostForm mode="create" />
  }

  // EDIT
  if (slug[0] === "edit" && slug[1]) {
    return <PostForm mode="edit" id={slug[1]} />
  }

  // VIEW
  if (slug[0] === "view" && slug[1]) {
    return <PostDetail id={slug[1]} />
  }

  return <div>Not Found</div>
}
