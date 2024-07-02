<script setup>
import {ref, computed, onMounted, reactive} from 'vue'
import {
    Search,
    User,
    HomeFilled,
    View,
    Hide,
    ArrowRightBold,
    FolderOpened, SwitchButton
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const input = ref('')
const disEyes = ref(true)
const isPasswordVisible = ref(false);
const loginRegister = ref(true)
const dialogVisible = ref(false)
const isClicked = ref(false);
const ShowAvatar = ref(false)
const isCardVisible = ref(false);
const token = ref(null);
const form = ref({
    phone: '',
    code: '',
    password:''

})

// const user=ref({
//     id:'',
//     nickname:'',
//     userPic:''
// })

import {useTokenStore} from "@/stores/token.js";
import avatar from '@/assets/2.jpg'
import useUsersInfoStore from "@/stores/userInfo.js";
const userInfoStore=useUsersInfoStore();
const tokenStore=useTokenStore();
import { useRouter } from "vue-router";
const router=useRouter();

onMounted(() => {
    handleClick()
    // const token=localStorage.getItem('token')
    if (tokenStore.token !== '') {
        ShowAvatar.value = true
        releasesNumber(userInfoStore.info.id)
    }



})


const countNumber = ref("");
const releasesNumber=async (userId) => {
    let result=  await releasesNumberService(userId)
    countNumber.value=result.data
};


// clear
const clear=()=>{
    form.value={
        password: '',
        phone: '',
        code: ''
    }
}




//退出登录
const removeToken=()=>{
    // localStorage.removeItem('token')
    tokenStore.removeToken();
    userInfoStore.removeInfo();
    ShowAvatar.value=false



}
// 发布
const releaseBtn=()=>{
    if (ShowAvatar.value===true){
        router.push('/release')
    }else {
        hideDropdown()
    }
}


// 登录
 const hideDropdown = () => {
    // 密码登录显示样式
    isClicked.value = true;
    loginRegister.value = true;
    // disEyes
    disEyes.value = true
    //显示dialog
    dialogVisible.value = true;
};

import {sendCodeService, registerLogin, loginService, infoService, releasesNumberService} from '@/api/user.js'
// 登录
const onSubmit1=async () => {
    if (!form.value.phone ) {
        ElMessage.error("请输入账号")
    }
    if (!form.value.password) {
        ElMessage.error("请输入密码")
    }
    let result = await loginService(form.value)
    tokenStore.setToken(result.data)
    localStorage.setItem('token',tokenStore.token)
    ElMessage.success('登录成功')
    dialogVisible.value=false
    await befologin()
    await releasesNumber(userInfoStore.info.id)
    ShowAvatar.value=true
}

const befologin=async ()=>{
    let result = await infoService(tokenStore.token)
    result.data.phone=''
    userInfoStore.setInfo(result.data)
}

// 登录\注册
const onSubmit = async () => {
    if (!form.value.code) {
        ElMessage.error('请输入验证码')
    }
    if (form.value.phone.length!==11){
        ElMessage('手机号不正确');
        return;
    }
    let result = await registerLogin(form.value)
    tokenStore.setToken(result.data)
    ElMessage.success('登录成功')
    dialogVisible.value=!dialogVisible.value
    await befologin()
    ShowAvatar.value=!ShowAvatar.value
    await releasesNumber(userInfoStore.info.id)


}


// 发送验证码
const gettingcode=ref('获取验证码')
const isButtonDisabled = ref(false);
let countdown = 60;
let timer = null;

const getCode = async () => {

    if (!form.value.phone) {
        ElMessage('请输入手机号');
        return;
    }
    if (form.value.phone.length!==11){
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

    let result= await sendCodeService(form.value.phone)
    alert(result.data)


}



const password1Click = () => {
    isClicked.value = true;
    loginRegister.value = true;
    form.value={
        password: '',
        phone: '',
        code: ''
    }
};
const password2Click = () => {
    isClicked.value = false;
    loginRegister.value = false;
    form.value={
        password: '',
        phone: '',
        code: ''
    }

};


const PasswordEyes1 = () => {
    isPasswordVisible.value = true;
    disEyes.value = false
}
const PasswordEyes2 = () => {
    isPasswordVisible.value = false;
    disEyes.value = true
}

const passwordFieldType = computed(() => {
    return isPasswordVisible.value ? 'text' : 'password';
});


const showCard = () => {
    isCardVisible.value = true;
}

const hideCard = () => {
    isCardVisible.value = false;
}




// main
// btn-style
const buttons = ref(2)
const  selectedButton= ref(null);
const activeName = ref('first')




import url from '@/assets/3.jpg'
import WeiXUrl from '@/assets/2.jpg'
import codeUrl from '@/assets/qrcode.jpg'



// const url = 'src/assets/3.jpg'


// const WeiXUrl='src/assets/2.jpg'
// const codeUrl='src/assets/qrcode.jpg'




// btn-style
const selectButton=(index) =>{
    selectedButton.value = index;
}


const articles=ref([{
    id:'',
    title:'',
    content:'',
    nickname:'',
}])

const searcharticles=ref([{
    id:'',
    title:'',
    content:'',
    nickname:'',
}])

const befarticles=ref([])

const shufflearticles=()=>{
    befarticles.value=articles.value
        .slice()
        .sort(()=>Math.random()-0.5);
}

const befContext=(context)=>{
    if (!context) return ''; // 如果 context 为空，返回空字符串
    const text= context.replace(/<\/?[^>]+(>|$)/g, "")
    const length=130;
    return  text.length>length? text.substring(0,length)+'...':text;

}
import {articleSelectAllSerivce, articleSelecttextService} from '@/api/article.js'
const handleClick = async () => {
    shufflearticles()
    let result = await articleSelectAllSerivce();
    articles.value=result.data
}
handleClick();
const articlelist=ref(false)
const searchinput=async () => {
  let result= await articleSelecttextService(input.value)
    searcharticles.value=result.data
    articlelist.value = true
}
const cdindex=()=>{
    articlelist.value=false
    router.push('/')
}
</script>

<template>
    <div class="common-layout"  >
        <el-container style="overflow: hidden;">
            <!--导航栏-->
            <el-header class="custom-header">
                <el-row :gutter="2" class="header-content"  >
                    <el-col :xs="24" :sm="12" :md="4" style="margin-left: 22%">
                        <div class="grid-content ep-bg-purple">
                            <ul class="menu-list-pre">
                                <li class="menu-item">
                                    <div class="menu-link-container header-font-link index-icon">
                                        <el-icon

                                        >
                                            <HomeFilled/>
                                        </el-icon>
                                        <span style="cursor: pointer;"
                                              @click.stop="cdindex()">首页</span>
                                    </div>
                                </li>
                                <li class="menu-item">
                                    <div class="menu-link-container header-font-link">
                                        <span>...</span>
                                    </div>
                                </li>

                                <li class="menu-item">
                                    <div class="menu-link-container header-font-link">
                                        <span>...</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="5">
                        <h2 class="h-title">大作业 论坛</h2>
                        <div class=" ep-bg-purple on-top ">

                            <el-input
                                    v-model="input"
                                    style="width: 400px"
                                    size="large"
                                    placeholder="搜索一下"
                                    class="rounded-input-wrapper"
                                    @keyup.enter="searchinput()"
                            >
                                <template #suffix>
                                    <el-icon class="el-input__icon" @click="searchinput()" style="cursor: pointer; ">
                                        <search/>
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="5">
                        <div class="grid-content ep-bg-purple">
                            <ul class="menu-list">
                                <!--头像-->
                                <li class="menu-item" v-if="ShowAvatar">
                                    <div class="profile-container" @mouseover="showCard" @mouseleave="hideCard">
                                        <div class="avatar-container">
                                            <img class="avatar" :class="{ enlarged: isCardVisible }"
                                                 :src=" userInfoStore.info.userPic ?  userInfoStore.info.userPic :avatar " alt="Avatar"/>
                                        </div>
                                        <transition name="fade">
                                            <div v-if="isCardVisible" class="card-container">
                                                <el-card class="box-card box-card-DbCilk" shadow="hover"
                                                         style="border-radius: 15px" >
                                                    <div class="user-info" >
                                                        <div class="username">{{ userInfoStore.info.nickname }}</div>
                                                        <div class="follower-info">
<!--                                                            <div class="follower-item follower-click">-->
<!--                                                                <div class="follower-count">28</div>-->
<!--                                                                <div class="follower-label">关注</div>-->
<!--                                                            </div>-->
<!--                                                            <div class="follower-item follower-click">-->
<!--                                                                <div class="follower-count">0</div>-->
<!--                                                                <div class="follower-label">粉丝</div>-->
<!--                                                            </div>-->
                                                            <div class="follower-item follower-click" style="cursor: pointer; "  @click="router.push('/articleManage')">
                                                                <div class="follower-count">{{countNumber}}</div>
                                                                <div class="follower-label">发布</div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div class="actions">
                                                        <div>
                                                            <div>
                                                                <el-button

                                                                        text
                                                                        class="actions-btn"
                                                                        @click="router.push('/user/personal')"
                                                                >
                                                                    <el-icon
                                                                            class="actions-icon1"
                                                                            size="large">
                                                                        <User/>
                                                                    </el-icon>
                                                                    个人中心
                                                                    <el-icon class="actions-icon2">
                                                                        <ArrowRightBold/>
                                                                    </el-icon>
                                                                </el-button>

                                                            </div>
                                                            <div>
                                                                <el-button
                                                                        class="actions-btn"
                                                                        text
                                                                        @click="router.push('/articleManage')"
                                                                >
                                                                    <el-icon
                                                                            class="actions-icon1"
                                                                            size="large">
                                                                        <FolderOpened/>
                                                                    </el-icon>
                                                                    投稿管理
                                                                    <el-icon class="actions-icon2">
                                                                        <ArrowRightBold/>
                                                                    </el-icon>
                                                                </el-button>

                                                            </div>
                                                            <el-divider
                                                                    style="width:320px ;align-items: center"></el-divider>
                                                            <div>
                                                                <el-button
                                                                        class="actions-btn"
                                                                        text
                                                                        @click.stop="removeToken()"
                                                                >
                                                                    <el-icon
                                                                            class="actions-icon1"
                                                                            size="large">
                                                                        <SwitchButton/>
                                                                    </el-icon>
                                                                    退出登录
                                                                    <el-icon
                                                                            class="actions-icon2"
                                                                    >
                                                                        <ArrowRightBold/>
                                                                    </el-icon>
                                                                </el-button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </el-card>
                                            </div>
                                        </transition>
                                    </div>
                                </li>

                                <!--登录-->
                                <li class="menu-item" v-else>
                                    <div class="menu-link-container">
                                        <span class="menu-link header-font-link " style="cursor: pointer;"
                                              @click.stop="hideDropdown">登录</span>
                                    </div>
                                </li>


                                <!--发布-->
                                <li class="menu-item">
                                    <div class="menu-link-container">
                                        <div>
                                            <span class="menu-link header-font-link" style="cursor: pointer; "
                                                  @click.stop="releaseBtn">发布</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
                <!--login-dialog-->
                <el-dialog
                        v-model="dialogVisible"
                        width="30%"
                        align-center
                        :close-on-click-modal="false"
                        @open="clear"
                        @close="clear"
                >
                    <el-row>

                        <!--弹窗-->
                        <el-col :xs="24" :sm="12" :md="24">
                            <div class="grid-content-right ep-bg-purple">
                                <div class="line-wrapper">
                                    <el-col :xs="24" :sm="12" :md="10 ">
                                        <h3 class="title-left"

                                            :style="{ color: isClicked ? '#59a3d6' : 'black' }"
                                            @click="password1Click">
                                            密码登录
                                        </h3>

                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="4" class="line-container">
                                        <div class="vertical-line-center"></div>
                                    </el-col>
                                    <el-col :xs="24" :sm="12" :md="10">
                                        <h3 class="title-right"

                                            :style="{ color: isClicked ?  'black' :'#59a3d6' }"
                                            @click="password2Click">
                                            短信登录
                                        </h3>
                                    </el-col>
                                </div>


                                <el-form :model="form" label-width="auto" class="el-form" v-if="loginRegister">
                                    <div class="input-container">
                                        <div class="input-group">
                                            <label class="input-label-left">账号</label>
                                            <el-input class="custom-input" v-model="form.phone"
                                                      placeholder="请输入账号"/>
                                        </div>
                                        <div class="name-password-center"></div>

                                        <div class="input-group">
                                            <label class="input-label-left">密码</label>
                                            <el-input class="custom-input" v-model="form.password"
                                                      :type="passwordFieldType"
                                                      placeholder="请输入密码"/>
                                            <el-icon style="cursor: pointer; " @click="PasswordEyes1" size="18px"
                                                     v-if="disEyes">
                                                <Hide/>
                                            </el-icon>
                                            <el-icon style="cursor: pointer;" @click="PasswordEyes2" size="18px" v-else>
                                                <View/>
                                            </el-icon>
                                            <div style="margin-left:15px ;margin-right:5px;">
                                                <el-dropdown trigger="click">
                                                <span class="el-dropdown-link">
                                                忘记密码
                                                </span>
                                                    <template #dropdown>
                                                        <el-dropdown-menu style="width:350px" class="el-dropdown-close">
                                                            <div style="margin: 10px 0 10px 8%;cursor: pointer; "
                                                                 @click="password2Click"
                                                            >
                                                                <span style="font-size: 16px;font-weight: bold">
                                                                    验证码登录
                                                                </span>
                                                                <br>
                                                                <span style="font-size: 13px">不需要密码，通过验证码直接登录</span>
                                                            </div>

                                                            <div style="margin: 10px 0 10px 8%;cursor: pointer;"
                                                            @click="router.push('/findPassword')"
                                                            >
                                                                <span style="font-size: 16px;font-weight: bold">
                                                                    找回密码
                                                                </span>
                                                                <br>
                                                                <span style="font-size: 13px">通过绑定的手机号重置密码</span>
                                                            </div>
                                                        </el-dropdown-menu>
                                                    </template>
                                                </el-dropdown>

                                            </div>
                                        </div>
                                    </div>
                                    <el-form-item class="el-form-item">
                                        <div class="button-group">
                                            <el-button
                                                    class="button-left"
                                                    @click.stop="password2Click;clear"
                                            >
                                                注册
                                            </el-button>
                                            <el-button class="button-right"
                                                       type="primary"
                                                       @click="onSubmit1()">
                                                登录
                                            </el-button>
                                        </div>

                                    </el-form-item>
                                </el-form>


                                <el-form  :model="form" label-width="auto" class="el-form" v-else>
                                    <div class="input-container">
                                        <div class="input-group">

                                            <label class="input-label-right">手机号</label>
                                            <el-input class="custom-input-phone" v-model="form.phone"
                                                      placeholder="请输入手机号"/>
<!--                                            <div class="vertical-line-phone"></div>-->

                                            <el-button   :disabled="isButtonDisabled"  style="border: 0;" @click="getCode()">
                                                {{gettingcode}}
                                            </el-button>

                                        </div>
                                        <div class="name-code-center"></div>

                                        <div class="input-group">
                                            <label class="input-label-right">验证码</label>
                                            <el-input class="custom-input-phone" v-model="form.code"
                                                      placeholder="请输入验证码"/>

                                        </div>
                                    </div>
                                    <el-form-item>
                                        <div class="button-group-right">
                                            <el-button class="button-center"
                                                       style="width: 160px;
                                                              height: 40px"
                                                       type="primary" @click.stop="onSubmit()">
                                                登录/注册
                                            </el-button>
                                        </div>

                                    </el-form-item>
                                </el-form>
                            </div>


                        </el-col>
                    </el-row>


                </el-dialog>

            </el-header>
            <!--主体-->
            <el-main>
                <div class="main-one" style="display: flex;justify-content: space-between;padding-top: 190px;min-height:700px;">
                <!--left-->
<!--                    <div style="width:10%;height: 600px;background-color: white;margin:20px 20px 0 0;display: flex;justify-content: center; ">-->
<!--                        <div style="width: 75%;height: 45px;border-radius: 15px;margin-top: 10px;">-->
<!--                            <div  style="margin: 0 0 5px 0"  v-for="(button,index) in buttons">-->
<!--                                <el-button-->
<!--                                    class="left-btn-style"-->
<!--                                    :type="selectedButton === index ? 'primary' : ''"-->
<!--                                    @click="selectButton(index)"-->
<!--                                >-->
<!--                                    黑神话悟空-->
<!--                                </el-button>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->


                    <div style="min-height:700px;width: 70%" v-if="articlelist">
                                <div v-for="article in searcharticles" :key="article.id">
                                    <el-row :gutter="3"  style="height: 140px; cursor: pointer; " @click="router.push(`/article/${article.id}`)" >
                                        <el-col :xs="24" :sm="12" :md="5" style="padding:0;display: flex;
                                justify-content: center;align-items: center;">
                                            <div style="margin: 0;align-items: center;width: 180px; height:120px;" >
                                                <el-image style="width: 100%; height: 100%;border-radius: 14px" :src="url" fit=scale-down />
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" :sm="12" :md="19" style="display: flex;justify-content: center;align-items: center;">
                                            <div style="width: 100%;height: 120px;">
                                                <div style="height: 95px;">
                                                    <el-link type="info" @click="router.push(`/article/${article.id}`)">
                                                        <h3 style="margin: 0;font-weight: 400;font-size: 18px;color: black">{{article.title}}</h3>
                                                    </el-link>

                                                    <p style="font-size: 14px;color: #3b3b3b;margin: 0;padding: 5px 0 0 0">
                                                        {{ befContext(article.content)}}
                                                    </p>
                                                </div>
                                                <div >
                                                    <p style="margin: 0;font-size:13px;font-weight: 400;color: #3b3b3b ">
                                                        作者：{{article.nickname}}
                                                    </p>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-divider/>
                                </div>
                    </div>

                <!--center-->
                    <div style="min-height:950px;width: 70%" v-else>
                        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                            <el-tab-pane label="推荐" name="first">
                                <div v-for="article in articles" :key="article.id">
                                    <el-row :gutter="3"  style="height: 140px; cursor: pointer; " @click="router.push(`/article/${article.id}`)" >
                                        <el-col :xs="24" :sm="12" :md="5" style="padding:0;display: flex;
                                justify-content: center;align-items: center;">
                                            <div style="margin: 0;align-items: center;width: 180px; height:120px;" >
                                                <el-image style="width: 100%; height: 100%;border-radius: 14px" :src="url" fit=scale-down />
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" :sm="12" :md="19" style="display: flex;justify-content: center;align-items: center;">
                                            <div style="width: 100%;height: 120px;">
                                                <div style="height: 95px;">
                                                    <el-link type="info" @click="router.push(`/article/${article.id}`)">
                                                        <h3 style="margin: 0;font-weight: 400;font-size: 18px;color: black">{{article.title}}</h3>
                                                    </el-link>

                                                    <p style="font-size: 14px;color: #3b3b3b;margin: 0;padding: 5px 0 0 0">
                                                        {{ befContext(article.content)}}
                                                    </p>
                                                </div>
                                                <div >
                                                    <p style="margin: 0;font-size:13px;font-weight: 400;color: #3b3b3b ">
                                                        作者：{{article.nickname}}
                                                    </p>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-divider/>
                                </div>

                            </el-tab-pane>
                            <el-tab-pane label="热榜" name="second">
                                <div v-for="article in befarticles" :key="article.id">
                                    <el-row :gutter="3"  style="height: 140px; cursor: pointer; ">
                                        <el-col :xs="24" :sm="12" :md="5" style="padding:0;display: flex;
                                justify-content: center;align-items: center;">
                                            <div style="margin: 0;align-items: center;width: 180px; height:120px;" >
                                                <el-image style="width: 100%; height: 100%;border-radius: 14px" :src="url" fit=scale-down />
                                            </div>
                                        </el-col>
                                        <el-col :xs="24" :sm="12" :md="19" style="display: flex;justify-content: center;align-items: center;">
                                            <div style="width: 100%;height: 120px;">
                                                <div style="height: 95px;">
                                                    <el-link type="info" @click="router.push(`/article/${article.id}`)">
                                                        <h3 style="margin: 0;font-weight: 400;font-size: 18px;color: black">{{article.title}}</h3>
                                                    </el-link>

                                                    <p style="font-size: 14px;color: #3b3b3b;margin: 0;padding: 5px 0 0 0">
                                                        {{ befContext(article.content)}}
                                                    </p>
                                                </div>
                                                <div >
                                                    <p style="margin: 0;font-size:13px;font-weight: 400;color: #3b3b3b ">
                                                        作者：{{article.nickname}}
                                                    </p>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-divider/>
                                </div>
                            </el-tab-pane>
<!--                            <el-tab-pane label="Role" name="third">Role</el-tab-pane>-->
<!--                            <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>-->
                        </el-tabs>



                    </div>
<!--right-->
                <div style="width: 25%;min-height: 1000px;margin-left:30px;margin-top: 55px">
                        <div style="width: 100%;height: 400px;background-color: #917979">
                            <div class="block text-center"  m="t-4">
                                <el-carousel trigger="click" height="400px">
                                    <el-carousel-item v-for="item in 4" :key="item">
                                        <h3 class="small justify-center" text="2xl">广告位</h3>
                                    </el-carousel-item>
                                </el-carousel>
                            </div>
                        </div>


                        <div style="width: 100%;height: 100px;background-color: #ffffff;border-radius: 15px;margin-top:50px;display: flex;
                                 align-items: center;">
                            <div style="width:19% ;height: 60%;margin-left: 15px;border-radius: 20px" >
                                <el-image style="width: 100%; height: 100%;border-radius: 20px" :src="WeiXUrl" fit=scale-down />
                            </div>

                            <div style="width: 35%;height: 80%;margin-left: 10px">
                               <h3 style="font-size: 15px;margin:15px 0 0 0">
                                   关注微信公众号
                               </h3>
                                <p style="font-size: 13px;margin: 10px 0 0 0 ;color: #989595">
                                    荷包damn 炒饭
                                </p>
                            </div>

                            <div style="width: 25%;height: 80%;margin-left: 10px">
                                <el-image style="width: 100%; height: 100%;" :src="codeUrl" fit=scale-down />
                            </div>

                        </div>
                </div>

                </div>
            </el-main>
            <!--页尾-->
            <el-footer height="150px">
                <div class="footer-content">
                    <p>&copy; 2024 XXXXXXXX All rights reserved.</p>

                </div>

            </el-footer>
        </el-container>
    </div>
</template>


<style scoped>

/*main*/

.left-btn-style{
    width: 100%;
    height: 45px;
    border-radius: 15px;
    font-size: 15px;
    font-weight: 400;
    border: 0;
}


.el-carousel__item h3 {
    color: #1c1c1c;
    opacity: 0.75;
    line-height: 400px;
    margin: 0;
    text-align: center;
}



::v-deep .el-tabs__item {
    color: #7e7e7e !important;                /* 文字颜色 */
    font-size: 17px;
    padding: 20px 45px !important;          /* 内边距 */
    margin: 10px 20px !important;               /* 外边距 */
    cursor: pointer !important;             /* 鼠标指针 */
}

::v-deep .el-tabs__item:focus{
    color: #000000 !important;  /* 悬停时的背景颜色 */
}


/*.main-header-span{*/
/*    height: 50px;*/
/*    width: 100px;*/
/*    background-color: chartreuse;*/
/*    display: flex;*/
/*    justify-content: center;*/
/*    align-items: center;*/
/*    cursor: pointer;*/
/*}*/


/*.main-header-style{*/
/*    display: flex;*/
/*    padding: 0;*/
/*    margin: 0;*/
/*    list-style-type: none;*/

/*}*/




/*按钮图标*/
.actions-icon1 {
    margin-right: 25px;
    text-align: left;
    font-size: 20px
}

.actions-icon2 {
    margin-left: 120px
}

/*头像按钮*/
.actions-btn {
    width: 280px;
    height: 45px;
    margin: 0 0 5px 10px;
    justify-content: flex-start;
    font-size: 15px;
    background-color: transparent;
}

/*列表*/
.profile-container {
    position: relative;
    display: inline-block;
}

.avatar-container {
    display: inline-block;
    position: relative;
    z-index: 20; /* 保证头像在卡片上方 */
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.25s ease-in-out;
}

.avatar.enlarged {
    transform: scale(2.1) translate(-9px, 14px);
    z-index: 30; /* 保证放大的头像在最上层 */
}

.card-container {
    position: absolute;
    top: 60px; /* 调整卡片位置，使其与头像重叠 */
    left: 50%;
    transform: translateX(-55%);
    z-index: 10;
    width: 350px;
    pointer-events: auto; /* 确保卡片能够点击 */
}

.user-info {
    text-align: center;
    padding: 10px;

}

.username {
    font-size: 1.2em;
    font-weight: bold;
    margin-top: 10px;
}

.follower-click {
    cursor: pointer;
}

.follower-info {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
}

.follower-item {
    text-align: center;
}

.follower-count {
    font-size: 1.2em;
    font-weight: bold;
}

.follower-label {
    color: #888;
}



.actions {
    margin-top: 40px;
    display: flex;
    justify-content: flex-start;
    /*padding:10px;*/
}


/*用户弹窗*/
.box-card-DbCilk {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */

}

/*双击不选中*/
.el-dropdown-close {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

/*双击不选中*/
.common-layout {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}



.custom-input-phone {
    flex: 1;
    width: 140px;
}

.custom-input {
    flex: 1;
    /*width:140px;*/
}


.button-group-right {
    display: flex;
    justify-content: center; /* 确保按钮两端对齐 */
    width: 270px; /* 按钮组宽度占90% */
    margin: 0 auto; /* 居中对齐 */

}


.button-group {
    display: flex;
    justify-content: space-between; /* 确保按钮两端对齐 */
    width: 270px; /* 按钮组宽度占90% */
    margin: 0 auto; /* 居中对齐 */
}

.button-left {
    height: 40px;
    width: 48%; /* 每个按钮占48% */
}

.button-right {
    height: 40px;
    width: 48%; /* 每个按钮占48% */
}

.button-center {
    width: 50%; /* 每个按钮占48% */
}

.el-form-item {
    width: 100%;
    margin-top: 20px; /* 调整按钮组的间距 */
}

.el-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.input-group {
    display: flex;
    align-items: center;
    margin: 1px;
    /*控制form框等宽*/
    width: 300px;
}

.input-label-left {
    margin-right: 20px; /* 控制标签和输入框之间的间距 */
    width: 40px; /* 标签宽度，可以根据需要调整 */
    text-align: right; /* 右对齐文本 */
    font-size: 14px;
    font-weight: bold;
}

.input-label-right {
    margin-right: 15px; /* 控制标签和输入框之间的间距 */
    width: 55px; /* 标签宽度，可以根据需要调整 */
    text-align: right; /* 右对齐文本 */
    font-size: 14px;
    font-weight: bold;
}

.name-password-center {
    border-top: 1px #bebebe solid;
    max-width: 300px;
    padding: 0;
}

.name-code-center {
    border-top: 1px #bebebe solid;
    max-width: 415px;
    padding: 0;
}

.custom-input /deep/ .el-input__wrapper {
    border: 0;
    box-shadow: none; /* 移除输入框的阴影 */
    /*background-color: #f5f5f5; !* 可选：为输入框设置背景颜色，使其更明显 *!*/
    /*border-radius: 5px; !* 可选：为输入框设置圆角 *!*/
    padding: 4px; /* 可选：为输入框设置内边距 */
}

.custom-input-phone /deep/ .el-input__wrapper {
    border: 0;
    box-shadow: none; /* 移除输入框的阴影 */
    /*background-color: #f5f5f5; !* 可选：为输入框设置背景颜色，使其更明显 *!*/
    /*border-radius: 5px; !* 可选：为输入框设置圆角 *!*/
    padding: 4px; /* 可选：为输入框设置内边距 */
    width: auto;
}


.input-container {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    /*justify-content: center;*/
    /*align-items: center;*/
    gap: 3px; /* 控制两个输入框之间的间距 */
    padding: 5px; /* 给容器添加一些内边距 */
    border: 1px solid #cccccc; /* 添加边框 */
    border-radius: 7px; /* 设置圆角 */
    /*background-color: #fff; !* 背景颜色 *!*/
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); !* 添加阴影效果 *!*/

}


.line-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%; /* 确保行内元素居中 */
}

.title-left {
    text-align: right;
    font-weight: 450;
    cursor: pointer;

}

.title-right {
    text-align: left;
    font-weight: 450;
    cursor: pointer; /* 提示用户该元素是可点击的 */
}


.line-container {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}

.vertical-line-center {
    height: 21px; /* 或者你可以设置一个固定的高度，例如 '300px' */
    border-left: 1px solid #000; /* 竖线的颜色和宽度 */
}

.vertical-line-phone {
    height: 21px; /* 或者你可以设置一个固定的高度，例如 '300px' */
    border-left: 1px solid #000; /* 竖线的颜色和宽度 */
    width: 1px;
    margin: 0 10px;
}

.grid-content-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%; /* 确保父容器的高度被设置以实现垂直居中 */
}

img {
    height: 150px;
    width: 150px;
}

/*dialog-style*/
/deep/ .el-dialog {
    border-radius: 15px;
}

/* Footer styles */
.footer-content {
    text-align: center;
    padding: 20px;
    color: #333;
}

.footer-links {
    margin: 10px 0;
}

.footer-links a {
    color: #333;
    margin: 0 10px;
    text-decoration: none;
}

.footer-links a:hover {
    text-decoration: underline;
}

.social-media {
    margin-top: 10px;
}

.social-media a {
    color: #333;
    margin: 0 10px;
    text-decoration: none;
}

.social-media a:hover {
    text-decoration: underline;
}




.main-one {
    padding: 0;
    min-height: 2000px;
    width: 85%;
    margin: 0 auto;
    /*background-color: #a6a6a6;*/
    /*background-color: #007bff;*/
}



.message-lo1 p {
    margin-top: 15px;
    color: #b4b2b2;
}



.login-button .el-button {
    width: 310px;
    height: 40px;
}



.login-button1 .el-button {
    width: 310px;
    height: 35px;

}
/*首页和图标对齐*/
.index-icon {
    display: flex;
    align-items: center;
}

.index-icon el-icon {
    display: flex;
    align-items: center; /* 确保图标也垂直居中 */
}

/*首页和图标对齐*/
.index-icon span {
    display: inline-block;
    vertical-align: middle; /* 垂直对齐 */
}
.header-font-link {
    font-size: 17px; /* 设置登录链接的字体大小 */
}

.menu-list {

    list-style-type: none; /* 移除默认的无序列表样式 */
    padding: 0; /* 移除默认的填充 */
    margin-top: 80px; /* 移除默认的外边距 */
    margin-left: 150px;
    display: flex; /* 使用 Flexbox 布局 */
    gap: 35px; /* 列表项之间的间隔 */
    position: relative;

}

.menu-list-pre {

    list-style-type: none; /* 移除默认的无序列表样式 */
    padding: 0; /* 移除默认的填充 */
    margin-top: 80px; /* 移除默认的外边距 */
    margin-left: 50px;
    display: flex; /* 使用 Flexbox 布局 */
    gap: 35px; /* 列表项之间的间隔 */
    position: relative;

}

.menu-item {
    position: relative;

}

.menu-link-container {
    position: relative;
}

.menu-link {
    text-decoration: none; /* 移除默认的超链接下划线 */
    color: #ffffff; /* 字体颜色 */
    cursor: pointer; /* 鼠标悬停时显示指针 */
    transition: background-color 0.3s; /* 背景色过渡效果 */
}


.grid-content {
    border-radius: 4px;
    min-height: 50px;
}


.on-top {
    margin-top: 30px;
}

.custom-header {
    background-color: rgba(38, 32, 32, 0.99);
    height: 160px; /* Adjust height as needed */
    width: 100%;
    z-index: 1000;
    position: fixed;
}

.header-content {
    color: white; /* 根据背景图片调整文字颜色 */
}

.h-title {
    text-align: center;
}

.rounded-input-wrapper /deep/ .el-input__wrapper {
    border-radius: 15px !important;
    overflow: hidden; /* 确保子元素不溢出显示 */
}

/* 确保 input 内部没有圆角 */
.rounded-input-wrapper /deep/ .el-input__inner {
    border-radius: 0 !important;
}


@media (max-width: 768px) {
    .menu-list {
        flex-direction: column; /* 小屏幕时竖直排列 */
        gap: 5px;
    }

    .dropdown-menu {
        flex-direction: column; /* 小屏幕时竖直排列 */
        min-width: auto; /* 取消最小宽度 */
    }
}


</style>
