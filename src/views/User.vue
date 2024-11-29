<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="搜索用户">
        <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    
  </div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
    <el-table-column 
      v-for="item in tabelLabel"
      :key="item.prop"
      :width="item.width?item.width:150"
      :prop="item.prop"
      :label="item.label"
    />
    <el-table-column fixed="right" label="Operations" width="160">
      <template #="scoped">
        <el-button  type="danger" size="small" @click="handleDelete(scoped.row)">删除</el-button>
        <el-button  type="primary" size="small" @click="handleEdit(scoped.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination 
  background 
  layout="prev, pager, next" 
  :total="config.total" 
  size="small"
  @current-change="handleChange"
  class="pager"
  />
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
       <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form :inline="true"  :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select  v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="地址"
          prop="addr"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref,reactive,nextTick} from 'vue'
import { getCurrentInstance,onMounted } from 'vue';
import { ElMessage,ElMessageBox } from 'element-plus';
import { time } from 'echarts';
import { UserFilled } from '@element-plus/icons-vue';
import { useAllDataStore } from '../stores';
import { useRoute } from 'vue-router';
const route=useRoute()
const store=useAllDataStore()
const UserPathMessage={
            path: '/user',
            name: 'user',
            label: '用户管理',
            icon: 'user',
            url: 'User'
}
store.selectMenu(UserPathMessage)
const action=ref('')
const dialogVisible=ref(false)
const turnZio={
  sex:'1'
}
const formUser=reactive({
  sex:'1'
})
const rules = reactive({

  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr:[{ required: true, message: '地址是必填项' }]
})
const handleClose=()=>{
  // 获取表单，重置表单
  dialogVisible.value=false
  proxy.$refs['userForm'].resetFields()
}
const handleCancel=()=>{
  dialogVisible.value=false
}

const formInline=reactive({
  keyWord:''
})

const config=reactive({
  total:0,
  name:'',
  page:1,
})
const tableData =ref([])
const getUserList=async (a)=>{
  
  let res=await proxy.$api.getUserList(a)
  tableData.value=res.list.map(item=>({
    ...item,
    sexLabel:item.sex=='1'?'男':'女'

    })
  )
    config.total=res.count

}
const handleSearch=()=>{
  config.name=formInline.keyWord
  getUserList(config)
}
const tabelLabel=reactive([
  {
    prop:'name',
    label:'姓名'
    ,width:100
  },
  {
    prop:'age',
    label:'年龄'
    ,width:100
  },
  {
    prop:'sexLabel',
    label:'性别'
    ,width:100
  },
  {
    prop:'birth',
    label:'出生日期'
    ,width:200
  },
  {
    prop:'addr',
    label:'地址'
    ,width:300
  },
])
const {proxy}=getCurrentInstance()
const handleDelete = (row) => {
  ElMessageBox.confirm('你确定要删除吗').then(async ()=>{
    await proxy.$api.deleteUserList({id:row.id})
    ElMessage({
      showClose:true,
      message:'删除成功',
      type:'success'
    })
    getUserList({})
  })
}
const timeformat=(time)=>{
  var times=new Date(time)
  var year=times.getFullYear()
  var month=times.getMonth()+1    
  var date =times.getDate()
  function add(m){
    return m<10?'0'+m:m
  }
  return year+'-'+add(month)+'-'+add(date)
}
const handleEdit=(a)=>{
  a.sex=String(a.sex)
  action.value='edit'
  dialogVisible.value=true
  nextTick(()=>{
    Object.assign(formUser,a)
  })
  // 如果直接这样写的话，因为你这个变为true的时候才会进行渲染操作，但是直接就渲染了，导致
  // 系统误以为这个赋值后的formUser才是系统原始值，所以后面进行的抹零操作就失去了效果，
  // 我们可以使用nexttick直接使得这个操作变成下一步执行，这样就可以解决这个问题，或者在加一个后边重置操作

}
const onSubmit=()=>{
  proxy.$refs['userForm'].validate(async (valid)=>{
    if(valid){
      let res=null;
      formUser.birth=/^\d{4}-\d{2}-\d{}/.test(formUser.birth)?formUser.brith:timeformat(formUser.birth)
      if(action.value=='add'){
        res=await proxy.$api.addUser(formUser)
        if(res){
          dialogVisible.value=false
          proxy.$refs['userForm'].resetFields()
          getUserList()
          ElMessage({
            showClose:true,
            message:'添加成功'
          })
        }
      }else{
        // proxy.$refs['userForm'].resetFields()
        res=await proxy.$api.editUser(formUser)
        dialogVisible.value=false
        getUserList()
        ElMessage({
          showClose:true,
          message:'编辑成功',
          type:'success'
        })
      }
    }else{
      ElMessage({
        showClose:true,
        message:'请输入正确的内容',
        type:'error'
      })

    }
  })
}
onMounted(()=>{
  getUserList()
})
const handleChange=(page)=>{
  config.page=page
  getUserList(config)
}
const handleAdd=()=>{
  Object.assign(formUser,turnZio)
  dialogVisible.value=true
  action.value='add'
}
</script>

<style scoped lang="less">
.user-header{
  display: flex;
  justify-content: space-between;
}
.table{
  position: relative;
  height: 495px;
  .pager{
    position: absolute;
    right: 10px;
    bottom:30px;
  }
  .el-table{
    width: 100%;
    height: 475px;
  }
}
.select-clearn{
  display:flex;
}
</style>

