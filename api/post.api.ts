import api from "./axios";

export const getAllPostApi = (search?: string) => {
    return api.get('/post/getPosts', { params: { search } });
}

export const getPostByIdApi = (id: string) => {
    return api.get(`/post/getPostById/${id}`);
}

export const createPostApi = (data: FormData) => {
    return api.post("/post/create", data);
}
export const updatePostApi = (id: string, data: FormData) => {
    return api.patch(`/post/update/${id}`, data);
}
export const deletePostApi = (id: string) => {
    return api.delete(`/post/delete/${id}`);
}