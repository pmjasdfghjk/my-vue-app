<template>
<div class="common-layout">
  <el-container class="lay-container">
    <CommonAside/>
    <el-container>
      <el-header class="el-header">
        <CommonHeader/>
      </el-header>
      <CommonTab></CommonTab>
      <el-main class="right-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script setup>
import CommonAside from '../components/CommonAside.vue';
import CommonHeader from '../components/CommonHeader.vue';
import CommonTab from '../components/CommonTab.vue';
</script>

<style scoped lang="less">
.common-layout,.lay-container{
  height: 100%;
}
.el-header{
  background-color: #333;
}
</style>