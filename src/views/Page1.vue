<template>


    <el-form>
      <el-form-item>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <input
          type="file"
          ref="fileInput"
          @change="onFileChange"
          style="display: none"
        />
        <el-button type="primary" @click="triggerFileInput">上传照片</el-button>
        <el-button @click="open">点击提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="dialogVisible" title="温馨提示" width="50%" draggable>
    <span>是否要修改密码？1个月仅可修改一次!</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" type="danger">取消</el-button>
        <el-button type="success" @click="SubmitAvatar">确认修改</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const router=useRouter()
const imgUrl = ref('')
const fileInput = ref()
const dialogVisible=ref(false)
const triggerFileInput = () => {
  fileInput.value.click() // 触发文件选择对话框
}

const onFileChange = event => {
  const file = event.target.files[0] // 选择的文件
  if (file) {
    imgUrl.value = URL.createObjectURL(file)
  }
}

const onSelectFile = uploadFile => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
}
const open=()=>{
  dialogVisible.value=true
}
const SubmitAvatar = () => {
  // 提交头像逻辑
  
  if(imgUrl.value.length>0){
    dialogVisible.value=false
    ElMessage({
      showclose:true,
      message:'修改头像成功！',
      type:'success'
    })
    router.push('/home')

  }else{
    alert('请选择图片!')
    dialogVisible.value=false
  }
  // 这里可以添加逻辑来处理头像的提交
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 200px;
      height: 200px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 200px;
      text-align: center;
    }
  }
}
</style>