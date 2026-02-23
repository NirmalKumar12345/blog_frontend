import { createPostApi, deletePostApi, getAllPostApi, getPostByIdApi, updatePostApi } from "@/api/post.api"


export const getPostByIdService =async(id:string)=>{
    const res= await getPostByIdApi(id);
    return res.data;
}

export const getAllPostService =async(search?: string)=>{
    const res= await getAllPostApi(search);
    return res.data;
}

export const createPostService = async(data: FormData)=>{
  const res=await createPostApi(data);
  return res.data;
}

export const updatePostService=async(id:string,data: FormData)=>{
  const res=await updatePostApi(id,data);
  return res.data;
}

export const deletePostService =async(id:string)=>{
    const res= await deletePostApi(id);
    return res.data;
}