<template>
  <div class="body-login">
    <el-form :model="loginForm" class="login-container">
      <h1>欢迎登录</h1>
      <el-form-item>
        <el-input type="input" placeholder="请输入账号" v-model="loginForm.username" :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="请输入密码" v-model="loginForm.password" :prefix-icon="Lock" @keyup.enter="handleLogin"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin" >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import {reactive, ref} from 'vue'
import { useAllDataStore } from '../stores';
import { getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { User, Lock } from '@element-plus/icons-vue'
const store=useAllDataStore()
const loginForm=reactive({
  username:'',
  password:''
})
const router=useRouter()

const {proxy}=getCurrentInstance()
const handleLogin=async ()=>{
  const res=await proxy.$api.getMenu(loginForm)
  store.homeData.username=res.username
  store.homeData.userId=res.userid
  store.homeData.time=res.time
  localStorage.setItem('homedata', JSON.stringify(store.homeData));
  ElMessage({
    showClose:true,
    type:'info',
    message:res.message
  })

  store.updateMenuList(res.menuList)
  store.state.token=res.token
  
  if(res.message!=='密码错误'){
    store.addMenu(router)
    router.push('/home')
    
  }
}
</script>

<style lang="less" scoped>
.body-login{
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/background.png");
  background-size: 100%;
  overflow:hidden;
}
.login-container{
  width:400px;
  background-color: #fff;
  border:1px solid #eaeaea;
  border-radius: 15px;
  padding:35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin:250px auto;
  h1{
    text-align: center;
    margin-bottom: 20px;
    color:#505450;

  }
  // deep用于解决封装了的子组件，（相当于把el-form-item变成一个子组件，无法直接访问到里面的
  // 子元素，所以直接使用deep就可以了。
  :deep(.el-form-item__content){
    justify-content: center;
  }
}
</style>