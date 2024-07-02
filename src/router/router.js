import {createRouter, createWebHistory} from 'vue-router'

import IndexVue from '@/views/Index.vue'
import ArticleVue from "@/views/article/Article.vue";
import PersonalVue from "@/views/user/PersonalCenter.vue"
import ReleaseVue from "@/views/article/Release.vue"
import ModificationPasswordVue from "@/views/user/ModificationPassword.vue";
import ArticleManagementVue  from "@/views/article/ArticleManagement.vue"
const routes = [
    {path: '/', component: IndexVue},
    {path: '/user/personal', component: PersonalVue},
    {path: '/release', component: ReleaseVue},
    {path: '/article/:id', component: ArticleVue},
    {path: '/findPassword',component: ModificationPasswordVue},
    {path: '/articleManage', component:ArticleManagementVue }

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 };
    }
})


export default router
