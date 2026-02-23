"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"

interface Props {
  search: string
  setSearch: (value: string) => void
}

export default function PostHeader({ search, setSearch }: Props) {
  const router = useRouter()

  return (
    <div className="flex justify-between gap-4 items-center">
      <Input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64"
      />
      <Button
        type="button"
        className="cursor-pointer w-35 px-2"
        onClick={() => router.push("/post/create")}
      >
        <Plus /> Create New
      </Button>
    </div>
  )
}
