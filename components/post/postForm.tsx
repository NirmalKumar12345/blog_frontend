"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Formik, FormikProps, FormikHelpers } from "formik"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { createPostService, getPostByIdService, updatePostService } from "@/services/post.services"
import { validationSchema } from "@/app/post/[...slug]/validationSchema"
import { Label } from "../ui/label"

interface PostFormProps {
    mode: "create" | "edit"
    id?: string
}

interface FormValues {
    title: string
    content: string
    tags: string[]
    banner: File | null
    authorDetails: {
        name: string
        profile: File | null
    }
}

export default function PostForm({ mode, id }: PostFormProps) {
    const router = useRouter()

    const isCreate = mode === "create"
    const isUpdate = mode === "edit"

    const [initialValues, setInitialValues] = useState<FormValues>({
        title: "",
        content: "",
        tags: [],
        banner: null,
        authorDetails: {
            name: "",
            profile: null,
        }
    })
    const [selectedTag, setSelectedTag] = useState("")
    const [newTag, setNewTag] = useState("")
    const [loadingFetch, setLoadingFetch] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const previewObjectUrlRef = useRef<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [profilePreview, setProfilePreview] = useState<string | null>(null)
    const profilePreviewObjectUrlRef = useRef<string | null>(null)
    const profileFileInputRef = useRef<HTMLInputElement | null>(null)
    const [originalBannerPath, setOriginalBannerPath] = useState<string | null>(null)

    useEffect(() => {
        if (!isUpdate || !id) return

        const fetchPost = async () => {
            try {
                setLoadingFetch(true)
                const res = await getPostByIdService(id)
                const post = res?.post ?? res

                setInitialValues({
                    title: post?.title ?? "",
                    content: post?.content ?? "",
                    tags: post?.tags ?? [],
                    banner: null,
                    authorDetails: {
                        name: post?.authorDetails?.name ?? "",
                        profile: null,
                    }
                })
                if (post?.banner && post.banner !== "null") {
                    setOriginalBannerPath(post.banner)
                    if (previewObjectUrlRef.current) {
                        try {
                            URL.revokeObjectURL(previewObjectUrlRef.current)
                        } catch (e) { }
                        previewObjectUrlRef.current = null
                    }
                    const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? ''
                    setPreview(`${base}/${post.banner}`)
                    if (post?.authorDetails?.profile) {
                        setProfilePreview(`${base}/${post.authorDetails.profile}`)
                        profilePreviewObjectUrlRef.current = null
                    } else {
                        setProfilePreview(null)
                    }
                } else {
                    setOriginalBannerPath(null)
                    setPreview(null)
                }
            } catch (err: any) {
                toast.error(err?.response?.data?.msg || "Failed to load post")
                router.back()
            } finally {
                setLoadingFetch(false)
            }
        }

        fetchPost()
    }, [isUpdate, id, router])

    const handleSubmit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
        helpers.setSubmitting(true)
        setLoadingSubmit(true)
        try {
            const formData = new FormData()
            formData.append("title", values.title)
            formData.append("content", values.content)
            values.tags.forEach((tag) => formData.append("tags[]", tag))
            if (values.banner) {
                formData.append("banner", values.banner)
            } else if (isUpdate && originalBannerPath && preview === null) {
                formData.append("removeBanner", "true")
            }
            // author details
            formData.append("name", values.authorDetails.name)
            if (values.authorDetails.profile) {
                formData.append("profile", values.authorDetails.profile)
            } else if (isUpdate && profilePreview === null) {
                formData.append("removeProfile", "true")
            }
            if (isCreate) {
                const res = await createPostService(formData)
                toast.success(res?.msg || "Post Created")
            } else if (isUpdate && id) {
                const res = await updatePostService(id, formData)
                toast.success(res?.msg || "Post Updated")
            }

            router.push("/post")
        } catch (err: any) {
            toast.error(err?.response?.data?.msg || "Operation failed")
        } finally {
            helpers.setSubmitting(false)
            setLoadingSubmit(false)
        }
    }

    if (loadingFetch) return <p>Loading post...</p>

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-5">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {(formik: FormikProps<FormValues>) => (
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <Label>Title</Label>
                        <Input
                            placeholder="Title"
                            {...formik.getFieldProps("title")}
                        />
                        {((formik.touched.title && formik.errors.title) || formik.submitCount > 0) && (
                            <p className="text-sm text-red-500">{formik.errors.title}</p>
                        )}
                        <Label>Content</Label>
                        <Textarea
                            placeholder="Content"
                            {...formik.getFieldProps("content")}
                        />
                        {((formik.touched.content && formik.errors.content) || formik.submitCount > 0) && (
                            <p className="text-sm text-red-500">{formik.errors.content}</p>
                        )}
                        <div className="space-y-4">
                            <Label>Technology</Label>
                            <Select
                                value={selectedTag}
                                onValueChange={(value) => {
                                    if (!value) return
                                    if (!formik.values.tags.includes(value)) {
                                        formik.setFieldValue("tags", [...formik.values.tags, value])
                                    }
                                    setSelectedTag("")
                                }}
                            >
                                <SelectTrigger className="cursor-pointer w-full">
                                    <SelectValue placeholder="Select Technology" />
                                </SelectTrigger>

                                <SelectContent className="cursor-pointer">
                                    <SelectItem value="react">React</SelectItem>
                                    <SelectItem value="vue">Vue</SelectItem>
                                    <SelectItem value="angular">Angular</SelectItem>
                                    <SelectItem value="nextjs">Next.js</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="select a technology or add new tech"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            const tag = (newTag || "").trim()
                                            if (!tag) return
                                            if (!formik.values.tags.includes(tag)) {
                                                formik.setFieldValue("tags", [...formik.values.tags, tag])
                                            }
                                            setNewTag("")
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const tag = (newTag || "").trim()
                                        if (!tag) return
                                        if (!formik.values.tags.includes(tag)) {
                                            formik.setFieldValue("tags", [...formik.values.tags, tag])
                                        }
                                        setNewTag("")
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                        {((formik.touched.tags && formik.errors.tags) || formik.submitCount > 0) && (
                            <p className="text-sm text-red-500">{(formik.errors.tags as any) || ""}</p>
                        )}

                        <div className="flex gap-2 flex-wrap">
                            {formik.values.tags.map((tag) => (
                                <div
                                    key={tag}
                                    className="px-3 py-1 bg-gray-200 rounded-full text-sm cursor-pointer"
                                    onClick={() => formik.setFieldValue("tags", formik.values.tags.filter((t) => t !== tag))}
                                >
                                    {tag} ✕
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="space-y-4">
                                <Label>Banner Image</Label>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    className="cursor-pointer pr-14"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null
                                        formik.setFieldValue("banner", file)
                                        if (file) {
                                            if (previewObjectUrlRef.current) {
                                                try {
                                                    URL.revokeObjectURL(previewObjectUrlRef.current)
                                                } catch (e) { }
                                            }
                                            const objUrl = URL.createObjectURL(file)
                                            previewObjectUrlRef.current = objUrl
                                            setPreview(objUrl)
                                        } else {
                                            if (previewObjectUrlRef.current) {
                                                try {
                                                    URL.revokeObjectURL(previewObjectUrlRef.current)
                                                } catch (e) { }
                                                previewObjectUrlRef.current = null
                                            }
                                            setPreview(null)
                                        }
                                    }}
                                />
                                {preview && preview !== "null" ? (
                                    <div className="absolute right-2 bottom-2.5 -translate-y-1/2">
                                        <div className="relative">
                                            <div
                                                role="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="cursor-pointer"
                                            >
                                                <Avatar size="sm">
                                                    <AvatarImage src={preview} alt="Banner preview" />
                                                    <AvatarFallback>Preview</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    formik.setFieldValue("banner", null)
                                                    if (previewObjectUrlRef.current) {
                                                        try {
                                                            URL.revokeObjectURL(previewObjectUrlRef.current)
                                                        } catch (e) { }
                                                        previewObjectUrlRef.current = null
                                                    }
                                                    setPreview(null)
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = ""
                                                    }
                                                }}
                                                className="absolute cursor-pointer -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            {((formik.touched.banner && formik.errors.banner) || formik.submitCount > 0) && (
                                <p className="text-sm text-red-500">{(formik.errors.banner as any) || ""}</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <div className="space-y-4">
                            <Label>Author Name</Label>
                            <Input placeholder="Author name" {...formik.getFieldProps("authorDetails.name")} />
                            {((formik.touched.authorDetails && (formik.touched.authorDetails as any).name && (formik.errors.authorDetails as any)?.name) || formik.submitCount > 0) && (
                                <p className="text-sm text-red-500">{(formik.errors.authorDetails as any)?.name || ""}</p>
                            )}
                            </div>
                        </div>

                        <div className="relative mt-3">
                            <div className="space-y-4">
                            <Label>Author Profile</Label>
                            <Input
                                ref={profileFileInputRef}
                                type="file"
                                className="cursor-pointer pr-14"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null
                                    formik.setFieldValue("authorDetails.profile", file)
                                    if (file) {
                                        if (profilePreviewObjectUrlRef.current) {
                                            try { URL.revokeObjectURL(profilePreviewObjectUrlRef.current) } catch (e) { }
                                        }
                                        const objUrl = URL.createObjectURL(file)
                                        profilePreviewObjectUrlRef.current = objUrl
                                        setProfilePreview(objUrl)
                                    } else {
                                        if (profilePreviewObjectUrlRef.current) {
                                            try { URL.revokeObjectURL(profilePreviewObjectUrlRef.current) } catch (e) { }
                                            profilePreviewObjectUrlRef.current = null
                                        }
                                        setProfilePreview(null)
                                    }
                                }}
                            />

                            {profilePreview ? (
                                <div className="absolute right-2 bottom-2.5 -translate-y-1/2">
                                    <div className="relative">
                                        <div
                                            role="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="cursor-pointer"
                                        >
                                            <Avatar size="sm">
                                                <AvatarImage src={profilePreview} alt="Profile preview" />
                                                <AvatarFallback>Preview</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                formik.setFieldValue("authorDetails.profile", null)
                                                if (profilePreviewObjectUrlRef.current) {
                                                    try {
                                                        URL.revokeObjectURL(profilePreviewObjectUrlRef.current)
                                                    } catch (e) { }
                                                    profilePreviewObjectUrlRef.current = null
                                                }
                                                setProfilePreview(null)
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = ""
                                                }
                                            }}
                                            className="absolute cursor-pointer -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                className="cursor-pointer"
                                variant="outline"
                                onClick={() => router.push("/post")}
                                type="button"
                            >
                                Back
                            </Button>
                            <Button type="submit" disabled={formik.isSubmitting || loadingSubmit} className="cursor-pointer">
                                {formik.isSubmitting || loadingSubmit ? (isCreate ? "Creating..." : "Updating...") : (isCreate ? "Create Post" : "Update Post")}
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}
