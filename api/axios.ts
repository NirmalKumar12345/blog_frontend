import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

// 🔐 Request Interceptor (token auto attach)
api.interceptors.request.use((config)=>{
  const token =  typeof window !== "undefined"? localStorage.getItem('token'): null;
  if(token){
    config.headers.Authorization=`Bearer ${token}`
  }
  return config;
},
(error)=>Promise.reject(error)
);

api.interceptors.response.use((response)=>response,
(error)=>{
  if(error.response?.status===401){
    localStorage.removeItem('token');
    window.location.href='/';
  }
  return Promise.reject(error);
}
)

export default api;