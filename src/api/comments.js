import request from "@/utils/request.js";


export const SelectbyIdComments=(article_id)=>{
    return request.get('/comments/selectByIdComments',{
        params:{
            article_id:article_id
        }
    })
}