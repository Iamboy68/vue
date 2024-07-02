import request from "@/utils/request.js";

export const articleAddService=(articleData)=>{
    return request.post('/article',articleData)
}

export const articleSelectAllSerivce=()=>{
    return request.get('/article/list')
}

export const articleSelectByUserIdSerivce=(id)=>{
    return request.get('/article/listByUserId',{
        params:{
            id:id
        }
    })
}
export const articledelectByIdSerivce=(id)=>{
    console.log("asdasda")
    return request.get('/article/delById',{
        params:{
            id:id
        }
    })
}

export const articleCommentsService=(form)=>{
    return request.post('/article/insertComments',form)
}

export const articleSelecttextService=(title)=>{
    return request.get('/article/listTitle',{
        params:{
            title:title
        }
    })
}

export const articleSelectOneSerivce=(Id)=> {
    return request.get('/article/ListOne',{
        params: {
            Id: Id
        }})

}


