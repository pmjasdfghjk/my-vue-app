<template>
    <el-form style="width: 300px;">
      <el-form-item label="用户名">
        <el-input :value="HomeData.username" disabled>
        </el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input value="2471198294@qq.com" disabled>
        </el-input>
      </el-form-item>
    </el-form>
    <el-form style="width: 300px;" :model="form" :rules="rules" ref="pwdForm">
      <el-form-item label="初始密码" prop="old_pwd">
        <el-input v-model="form.old_pwd">
        </el-input>
      </el-form-item>
      <el-form-item label="输入新密码" prop="new_pwd">
        <el-input type="password" v-model="form.new_pwd">
        </el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input type="password" v-model="form.re_pwd">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="reSet">重置</el-button>
        <el-button type="primary" @click="sureturn">确认修改</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="dialogVisible" title="温馨提示" width="50%" draggable>
    <span>是否要修改密码？1个月仅可修改一次!</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">容我再想想~</el-button>
        <el-button type="success" :icon="Check" circle  @click="sumbitForm"/>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { useAllDataStore } from '../stores';
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const pwdForm=ref(null)
const router=useRouter()
const store=useAllDataStore()
const dialogVisible=ref(false)
const HomeData=ref({})
if(JSON.parse(localStorage.getItem('homedata'))){
  HomeData.value=JSON.parse(localStorage.getItem('homedata'))
}else{
  HomeData.value=store.homeData
}
const form = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: '',
})
const reSet = () => {
  form.value.old_pwd = ''
  form.value.new_pwd = ''
  form.value.re_pwd = ''
}
const rules = {
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码为是6-15为非空字符',
      trigger: 'blur',
    },
  ],
  new_pwd: [
    { required: true, message: '请输入新的密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15为非空字符',
      trigger: 'blur',
    },
  ],
  re_pwd: [
    { required: true, message: '请输再次入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15为非空字符',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.new_pwd) {
          callback(new Error('两次输入的内容不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
const sureturn=()=>{
  dialogVisible.value=true
}
const sumbitForm= async ()=>{
  try{
    await pwdForm.value.validate()
  }catch(err){
    dialogVisible.value=false
    ElMessage({
      showClose:true,
      message:'请输入正确内容！',
      type:'error',
      duration: 3000
    })
    return
  }
  ElMessage({
    showClose:true,
    message:'修改密码成功！token过期即将重新登录',
    type:'success'
  })
  dialogVisible.value=false
  localStorage.clear()
  router.push('/login')
  // 发送请求
}
</script>

<style>

</style>