<script setup>

import {onMounted, ref} from "vue";
import userInfo from "@/stores/userInfo.js";
import url from '@/assets/3.jpg'
// const url = 'src/assets/3.jpg'

const showArticle=ref(false)

const Userarticles=ref([{
    id:'',
    title:'',
    content:'',
    createTime:'',
}])

import useUsersInfoStore from "@/stores/userInfo.js";
import {articledelectByIdSerivce, articleSelectByUserIdSerivce} from "@/api/article.js";
import {releasesNumberService} from "@/api/user.js";
import {ElMessage} from "element-plus";
import { useRouter } from "vue-router";
const router=useRouter();
const userInfoStore=useUsersInfoStore();

const count=ref("");

onMounted(async () => {
    let result= await articleSelectByUserIdSerivce(userInfoStore.info.id)
    // if(result.data===null){
    //     showArticle=0
    // }
    Userarticles.value=result.data
    let counts= await releasesNumberService(userInfoStore.info.id)
    count.value=counts.data
    showArticle.value=true
})

const befContext=(context)=>{
    if (!context) return ''; // 如果 context 为空，返回空字符串
    const text= context.replace(/<\/?[^>]+(>|$)/g, "")
    const length=80;
    return  text.length>length? text.substring(0,length)+'...':text;

}

const onSubmit=async (id) => {
    await articledelectByIdSerivce(id)
    ElMessage.success('删除成功')
    router.go(0)
}



</script>




<template>
    <div style="display: flex;justify-content: center;background-color: #f8f8f8;" class="doublenone">

        <div style="width:50%;min-height: 930px;background-color: #ffffff;">
            <div style="width: 100%;height: 50px;margin-top: 15px;">
                <p style="padding: 10px 0 0 20px;width: 100%;height: 100%;">全部稿件 {{ count }}</p>
            </div>
            <div style="width: 80%;height: 980px;margin:20px 0 0 10%" v-if="showArticle">
                  <div style="width: 100%;height: 150px;" v-for="article in Userarticles" :key="article.id">

                      <el-divider/>

                      <el-row style="height: 150px">
                          <el-col :xs="24" :sm="12" :md="5">
                              <div style="margin: 0;align-items: center;width: 100%; height:100%;" >
                                  <el-image style="width: 100%; height: 100%;border-radius: 14px" :src="url" fit=scale-down />
                              </div>
                          </el-col>
                          <el-col :xs="24" :sm="12" :md="14">
                              <div style="width: 100%;height: 100%;padding-left:10px">
                                  <div style="height: 95px;margin-bottom: 20px">

                                          <h3 style="margin: 10px 0 0 0;font-weight: 400;font-size: 18px;color: black">{{article.title}}</h3>


                                      <p style="font-size: 14px;color: #3b3b3b;margin: 0;padding: 5px 0 0 0">
                                          {{ befContext(article.content)}}
                                      </p>
                                  </div>
                                  <div >
                                      <p style="margin: 0;font-size:13px;font-weight: 400;color: #3b3b3b ">
                                          创建时间：{{article.createTime}}
                                      </p>
                                  </div>
                              </div>
                          </el-col>
                          <el-col :xs="24" :sm="12" :md="5" style="align-items: center;display: flex;justify-content: center" >
                              <div style="width: 80%;height: 50px;">
                                  <el-button style="width: 100%; height: 50px; border-radius: 10px" type="primary" @click="onSubmit(article.id)">
                                      删除
                                  </el-button>
                              </div>

                          </el-col>
                      </el-row>


                  </div>
            </div>



        </div>
    </div>


</template>

<style scoped>
.doublenone{
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

</style>