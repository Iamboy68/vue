<script setup>

import {onMounted, ref} from "vue";
import { useRouter } from "vue-router";
const router=useRouter();
const renewPassword=ref('');
const forminfo = ref({
    nickname:''

})
import useUsersInfoStore from "@/stores/userInfo.js";
import {changeinfoService} from "@/api/user.js";
const userInfoStore=useUsersInfoStore();
const exitVue=()=>{
    router.push('/')
}
const onSubmit=async () => {
 let result=await changeinfoService(forminfo.value.nickname,userInfoStore.info.id)
    userInfoStore.info.nickname=result.data
    router.push('/')
}
</script>

<template>
    <div class="common-layout" >
        <el-container style="align-items: center;background-color: white" class="doublenone">
            <el-main
                    style="height:930px;display: flex;justify-content: center;">
                <div style="width: 750px;height:600px;">

                    <div style="width: 100%;height: 70px;display: flex;align-items: center">
                        <div style="width: 200px;height: 50px;margin-left: 10px">
                            <p>个人中心
                            </p>
                        </div>
                    </div>

                    <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
                        <div style="width: 430px;height:500px;">
                            <el-form :model="forminfo" label-width="auto" class="el-form">
                                <el-form-item
                                        style="border: 1px #cbcbcb solid;width: 320px;border-radius: 10px;height: 50px;margin-top: 20px;align-items: center">
                                    <div style="width:70px;height: 40%;text-align: left;padding-left: 15px">
                                        <span>昵称</span>
                                    </div>

                                    <el-input
                                            v-model="forminfo.nickname"
                                            style="width: 225px;"
                                            type="text"
                                            :placeholder="userInfoStore.info.nickname"
                                            class="custom"/>
                                </el-form-item>



                                <el-form-item style="width: 320px; border-radius: 10px; height: 70px; margin-top: 15px;">
                                    <el-form-item style="width: 100px; height: 50px; margin:0  30px 0 15%;">
                                        <el-button style="width: 100%; height: 50px; border-radius: 10px" type="primary" @click="onSubmit()">
                                            保存
                                        </el-button>
                                    </el-form-item>
                                    <el-form-item style="width: 100px; height: 50px;">
                                        <el-button style="width: 100%; height: 50px; border-radius: 10px" @click="exitVue()">
                                            返回
                                        </el-button>
                                    </el-form-item>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>


</template>

<style scoped>
.doublenone{
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.el-form-item {
    width: 100%;
    margin-top: 5px; /* 调整按钮组的间距 */
}

.el-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 350px;
    height: 100%;

}

.custom /deep/ .el-input__wrapper {
    border: 0;
    box-shadow: none; /* 移除输入框的阴影 */
    /*background-color: #eff0f3; !* 可选：为输入框设置背景颜色，使其更明显 *!*/
    /*border-radius: 5px; !* 可选：为输入框设置圆角 *!*/
    padding: 4px; /* 可选：为输入框设置内边距 */
    width: auto;
}


</style>