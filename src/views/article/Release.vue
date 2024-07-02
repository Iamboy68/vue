<script  setup>
import {reactive, ref} from 'vue'
import {Plus} from "@element-plus/icons-vue";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';

const form = ref({
    title: '',
    // coverImg: '',
    // categoryId: '',
    content: ''
})





// const clear=(form)=>{
// for (const key in form){
//     if (form.hasOwnProperty(key)){
//         form[key]='';
//     }
// }
// }
const editorOptions = {
    theme: 'snow',
    modules: {
        toolbar: [
            [{'font': []}],
            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{'color': []}, {'background': []}],          // dropdown with defaults from theme
            [{'script': 'sub'}, {'script': 'super'}],     // superscript/subscript
            ['blockquote', 'code-block'],
            [{'header': 1}, {'header': 2}],               // custom button values
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'indent': '-1'}, {'indent': '+1'}],         // outdent/indent
            [{'direction': 'rtl'}],                         // text direction
            [{'align': []}],
            ['link', 'image', 'video'],
            ['clean']                                         // remove formatting button
        ]
    }
};

import { useRouter } from "vue-router";
const router=useRouter();
const Exit=()=>{
    router.push('/')
    // clear(form)
}
import {articleAddService} from "@/api/article.js";
import {ElMessage} from "element-plus";

const addArticle = async () => {
   let result= await articleAddService(form.value);
    ElMessage.success('添加成功');
    await router.push('/')

//     刷新首页
}

</script>

<template>
    <div style="width: 80%;min-height: 1000px;border: 1px;margin-left: 10%">
        <el-form :model="form" style="width: 100%;border: 1px #b4b2b2 solid;border-radius: 10px;padding: 4px">
            <div style="width: 100%;height: 290px;">
                <div style="width: 100%;height: 70px;">
                    <el-form-item style="height: 100%; margin: 0;">
                        <el-input v-model="form.title"
                                  placeholder="请输入文章标题..."
                                  style="width: 100%;height: 100%; box-sizing: border-box;
                                            padding: 0;border: none;font-size: 20px;"/>
                    </el-form-item>
                </div>
<!--                <div style="width: 100%;height: 220px;margin: 0;display: flex;">-->
<!--                    <div style="width: 50%;height: 100%;display: flex;justify-content: center;align-items: center">-->
<!--                        <div style="width: 350px;height:190px;padding: 0">-->
<!--                            <el-form-item label="文章封面">-->
<!--                                <el-upload-->
<!--                                        class="avatar-uploader"-->
<!--                                        :auto-upload="false" :show-file-list="false">-->
<!--                                    <img v-if="form.coverImg" :src="form.coverImg" alt="封面图片"/>-->
<!--                                    <el-icon v-else class="avatar-uploader-icon">-->
<!--                                        <Plus/>-->
<!--                                    </el-icon>-->
<!--                                </el-upload>-->
<!--                            </el-form-item>-->
<!--                        </div>-->
<!--                    </div>-->

<!--                    <div style="width: 50%;height: 100%;display: flex;">-->

<!--                        <div style="width: 50%;height: 25%;margin: 25px 0 0 150px ">-->
<!--                            <el-form-item label="文章分类">-->
<!--                                <el-select placeholder="请选择" v-model="form.categoryId" size="large">-->
<!--                                    <el-option v-for="c in form" :key="c.id" :label="c.categoryName" :value="c.id">-->

<!--                                    </el-option>-->
<!--                                </el-select>-->
<!--                            </el-form-item>-->
<!--                        </div>-->


<!--                    </div>-->
<!--                </div>-->
            </div>

            <el-divider/>

            <div style="width: 100%;min-height: 750px;">


                <el-form-item>
                    <div class="editor">
                        <quill-editor
                                v-model:content="form.content"
                                contentType="html"
                                :options="editorOptions"
                                theme="snow"
                        >

                        </quill-editor>


                    </div>
                </el-form-item>


            </div>
            <div style="width: 100%;height: 70px;display: flex;justify-content: center;align-items: center">
                <div style="width: 100px;height:50px;border-radius: 15px;margin-right: 100px">
                    <el-form-item style="width: 100%;height: 100%">
                        <el-button style="width: 100%;height: 100%;border-radius: 15px" type="primary" @click="addArticle()">发布</el-button>
                    </el-form-item>
                </div>
                <div style="width: 100px;height:50px;border-radius: 15px">
                    <el-form-item style="width: 100%;height: 100%">
                        <el-button style="width: 100%;height: 100%;border-radius: 15px" @click="Exit()">退出</el-button>
                    </el-form-item>
                </div>
            </div>


        </el-form>


    </div>
</template>

<style scoped>


.editor {
    width: 100%;
    height: 690px;
}
</style>

<style>
.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    height: 140px;
    text-align: center;
}

.avatar-uploader .el-upload {
    border: 1px dashed black;
    border-radius: 8px;
    margin: 30px 0 0 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}
</style>