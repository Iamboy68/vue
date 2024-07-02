import axios from "axios";
import { ElMessage } from 'element-plus'
const baseURL='/api';
const instance =axios.create({baseURL})

import { useTokenStore } from '@/stores/token.js';
instance.interceptors.request.use(
    (config)=>{
        let tokenStore =useTokenStore();
        if(tokenStore.token){
            config.headers.Authorization=tokenStore.token
        }
        return config;
    },
    (error)=>{
        Promise.reject(error)
    })


instance.interceptors.response.use(
    result=>{
        if(result.data.code===0){
            return  result.data;
        }
        ElMessage.error(result.data.message?result.data.message:'服务异常')
        return Promise.reject(result.data) ;
    },
    error =>{
        alert('服务异常')
        return Promise.reject(error);
    }
)
export default instance