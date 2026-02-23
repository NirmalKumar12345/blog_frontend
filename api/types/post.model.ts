export type Post = {
  _id: string
  title: string
  slug: string
  content: string
  tags?: string[]
  banner?: string | null
  author?: {
    name: string
    email: string
  },
  authorDetails: {
    name: string
    profile?: string | null
  },
  createdAt: string
}