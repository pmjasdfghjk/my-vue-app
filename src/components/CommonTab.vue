<template>
  <div class="tags">
    <el-tag>
      <el-tag 
      v-for="(tag,index) in tags" 
      :key="tag.name" 
      :closable="tag.name!=='home'"
      :effect="route.name===tag.name?'dark':'plain'"
      @click="handleMenu(tag)"
      @close="handleClose(tag,index)"
      >{{ tag.label }}</el-tag>
    </el-tag>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { useAllDataStore } from '../stores';
const router=useRouter()
const store=useAllDataStore()
const route=useRoute()
const tags=computed(()=>store.state.tags)
const handleMenu=(tag)=>{
  router.push(tag.name)
  store.selectMenu(tag)
}
// 关闭标签
const handleClose=(tag,index)=>{
  // 因为标签是通过pinia管理的，所以要添加删除标签都要通过pinia
  // 如果关闭的标签不是当前页面，那就直接关闭，但是如果是当前页面，那就要跳转
  store.updateMenu(tag)

  if(tag.name!==route.name){

    return
  }
  if(index===store.state.tags.length){
    // 上面这个说明已经不是主页了。所以我们判断是不是最后一个，length因为已经剪了1了，所以直接就等于index
    store.selectMenu(tags.value[index-1])
    // 严重怀疑上面这句可以不屑
    router.push(tags.value[index-1].name)
  
  }else{
    store.selectMenu(tags.value[index])
    // 严重怀疑上面可以不写，这个方法适用于更新tag标签的，看看是不是home，以及有没有重复来选择
    // 是否渲染，但是都已经有那个标签了，所以不是直接跳转就好了嘛
    router.push(tags.value[index].name)
  }
}
</script>

<style lang="less" scoped>
.tags{
  margin:20px 0 0 20px;
}
.el-tag{
  margin-right: 10px;
}
</style>