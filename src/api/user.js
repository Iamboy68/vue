import request from "@/utils/request.js";

export const sendCodeService = (phone) => {
    const params = new URLSearchParams('phone=' + encodeURIComponent(phone))
    return  request.post('/user/register', params)
}

export const registerLogin = (formAll) =>{
    return  request.post('/user/login',formAll)

}

export const loginService=(form)=>{
    return request.post('/user/password',form)
}

export const infoService=(token)=>{
    return request.get(`/user/me`)
}


export const changeService=(forminfo)=>{
    return request.post('/user/changePassword',forminfo)
}

export const releasesNumberService=(userId)=>{
    return request.get('/user/selectAllNumber',{params:{
        userId:userId
        }})
}
export const changeinfoService=(nickname,id)=>{
    return request.get('/user/changeInfo',{params:{
        nickname:nickname,
        id:id
        }})
}
