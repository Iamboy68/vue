<script setup>

import {ArrowRight} from "@element-plus/icons-vue";
import { ref} from "vue";
import {changeService, sendCodeService} from "@/api/user.js";
import { useRouter } from "vue-router";
import {ElMessage} from "element-plus";
const router=useRouter();
const renewPassword=ref('');

const forminfo = ref({
    phone: '',
    code: '',
    newPassword: ''

})


// 发送验证码
const gettingcode = ref('获取验证码')
const isButtonDisabled = ref(false);
let countdown = 60;
let timer = null;

const getCode = async () => {

    if (!forminfo.value.phone) {
        ElMessage('请输入手机号');
        return;
    }

    if (forminfo.value.phone.length!==11){
        ElMessage('请输入手机号');
        return;
    }

    isButtonDisabled.value = true;
    gettingcode.value = `重新发送(${countdown})`;

    timer = setInterval(() => {
        countdown--;
        gettingcode.value = `重新发送(${countdown})`;
        if (countdown === 0) {
            clearInterval(timer);
            isButtonDisabled.value = false;
            gettingcode.value = '重新验证码';
            countdown = 60;
        }
    }, 1000);


    let result = await sendCodeService(forminfo.value.phone)
    alert(result.data)


}

const exitVue=()=>{
    router.push('/')
}

const onSubmit=async () => {
    if (forminfo.value.newPassword !== renewPassword.value) {
        ElMessage.error('两次密码不一致')
    }
    await changeService(forminfo.value)
    ElMessage.success("修改成功")
    await router.push('/')
}

</script>

<template>
    <div class="common-layout">
        <el-container style="align-items: center;background-color: white">
            <el-main
                    style="height:930px;display: flex;justify-content: center;">
                <div style="width: 750px;height:600px;">

                    <div style="width: 100%;height: 70px;display: flex;align-items: center">
                        <div style="width: 200px;height: 50px;margin-left: 10px">
                            <p>登录
                                <el-icon>
                                    <ArrowRight/>
                                </el-icon>
                                忘记密码
                            </p>
                        </div>
                    </div>

                    <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
                        <div style="width: 430px;height:500px;">
                            <el-form :model="forminfo" label-width="auto" class="el-form">
                                <el-form-item
                                        style="border: 1px #cbcbcb solid;width: 320px;border-radius: 10px;height: 50px;margin-top: 20px;align-items: center">
                                    <div style="width:70px;height: 40%;text-align: left;padding-left: 15px">
                                        <span>新密码</span>
                                    </div>

                                    <el-input
                                            v-model="forminfo.newPassword"
                                            style="width: 225px;"
                                            type="password"
                                            placeholder="6~32位的字母、数字、下划线"
                                            class="custom"/>
                                </el-form-item>


                                <el-form-item
                                        style="border: 1px #cbcbcb solid;width: 320px;border-radius: 10px;height: 50px;align-items: center">
                                    <div style="width:70px;height: 40%;text-align: left;padding-left: 15px">
                                        <span>确认密码</span>
                                    </div>

                                    <el-input
                                            v-model="renewPassword"
                                            style="width: 225px;"
                                            type="password"
                                            placeholder="请再次输入密码"
                                            class="custom"/>
                                </el-form-item>

                                <el-form-item
                                        style="border: 1px #cbcbcb solid;width: 320px;border-radius: 10px;height: 50px;align-items: center">
                                    <div style="width:70px;height: 40%;text-align: left;padding-left: 15px">
                                        <span>手机</span>
                                    </div>

                                    <el-input
                                            v-model="forminfo.phone"
                                            style="width: 225px;"
                                            type="text"
                                            placeholder="注册时的手机号"
                                            class="custom"/>

                                </el-form-item>


                                <el-form-item
                                        style="border: 1px #cbcbcb solid;width: 320px;border-radius: 10px;height: 50px;align-items: center">
                                    <div style="width:70px;height: 40%;text-align: left;padding-left: 15px">
                                        <span>验证码</span>
                                    </div>

                                    <el-input
                                            v-model="forminfo.code"
                                            style="width: 110px;"
                                            type="text"
                                            placeholder="请输入验证码"
                                            class="custom"/>
                                    <div style="width: 100px;margin-left: 15px">
                                        <el-button  :disabled="isButtonDisabled" style="border: 0;width: 100px;height: 100%"
                                                   @click="getCode()">
                                            {{ gettingcode }}
                                        </el-button>

                                    </div>
                                </el-form-item>

                                <el-form-item style="width: 320px; border-radius: 10px; height: 70px; margin-top: 15px;">
                                    <el-form-item style="width: 100px; height: 50px; margin:0  30px 0 15%;">
                                        <el-button style="width: 100%; height: 50px; border-radius: 10px" type="primary" @click="onSubmit()">
                                            重置密码
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