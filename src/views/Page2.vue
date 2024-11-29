<template>
  <div class="feedback-container">
    <h1 class="big-hand">报错问题提交反馈</h1>
    
    <el-form :model="feedbackForm" :rules="rules" ref="form">
      <el-form-item label="反馈单位" prop="unit">
        <el-select v-model="feedbackForm.unit" placeholder="请选择单位" >
          <el-option label="研发部" value="unit1"></el-option>
          <el-option label="产品管理部" value="unit2"></el-option>
          <el-option label="工程部" value="unit3"></el-option>
          <el-option label="市场营销部" value="unit4"></el-option>
          <el-option label="销售部" value="unit5"></el-option>
          <el-option label="客户支持部" value="unit6"></el-option>
          <el-option label="人力资源部（HR）" value="unit7"></el-option>
          <el-option label="数据分析部" value="unit8"></el-option>
          <el-option label="设计部" value="unit9"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="反馈问题类型" prop="issueType">
        <el-select v-model="feedbackForm.issueType" placeholder="请选择问题类型">
          <el-option label="网络错误" value="type1"></el-option>
          <el-option label="用户输入错误" value="type2"></el-option>
          <el-option label="系统错误" value="type3"></el-option>
          <el-option label=" 客户端错误" value="type4"></el-option>
          <el-option label="API 错误" value="type5"></el-option>
          <el-option label="认证错误" value="type6"></el-option>
          <el-option label="权限错误" value="type7"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="feedbackForm.contact" placeholder="请输入手机号" :prefix-icon="PhoneFilled"></el-input>
      </el-form-item>

      <el-form-item label="办公室楼号" prop="officeLocation">
        <el-input v-model="feedbackForm.officeLocation" placeholder="请输入办公室楼号" :prefix-icon="HomeFilled"></el-input>
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input v-model="feedbackForm.address" placeholder="请输入详细地址" :prefix-icon="OfficeBuilding"></el-input>
      </el-form-item>

      <el-form-item label="具体内容" prop="details" >
        <el-input type="textarea" v-model="feedbackForm.details" placeholder="请输入反馈内容" :rows="5" ></el-input>
      </el-form-item>

      <el-form-item label="照片上传">
  <el-upload
    class="upload-demo"
    drag
    multiple
    action=""  
    :on-remove="handleRemove"
    :on-change="handleChange"
    :file-list="fileList"
    accept="image/*"
    :auto-upload="false">  <!-- 设置为 false，禁止自动上传 -->
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip"  type="info">支持多种格式</div>
  </el-upload>
</el-form-item>
        
    </el-form>

    <!-- 显示已上传的图片 -->
    <div class="uploaded-images">
      <h3></h3>
      <div class="image-list">
        <img v-for="file in fileList" :key="file.uid" :src="file.url || file.preview" class="uploaded-image" />
      </div>
    </div>
  </div>
  <el-dialog
    v-model="sumbitVisible"
    title="温馨提示"
    width="30%"
    destroy-on-close
    center
  >
    <span>
      是否进行提交？
    </span>
    <div>
      
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="sumbitVisible = false">取消</el-button>
        <el-button type="primary" @click="sureSumbit">
          确认提交
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
</template>

<script setup>
import { ref } from 'vue';
import { User, Lock,PhoneFilled,OfficeBuilding,HomeFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';


const sumbitVisible=ref(false)
const form=ref()
const sureSumbit=()=>{
  form.value.resetFields()
  sumbitVisible.value=false
  fileList.value = [];
  ElMessage({
    showClose:true,
    type:'success',
    message:'提交成功！将于3个工作日内联系您！'
  })
}
const feedbackForm = ref({
  unit: 'unit1',
  issueType:'type1',
  contact: '',
  officeLocation: '',
  address: '',
  details: '',
});
const rules=ref({
  unit: [{ required: true, message: '请选择反馈单位', trigger: 'blur' },],
  issueType:[{ required: true, message: '请选择问题类型', trigger: 'blur' },],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' },    {
      pattern:/^1[3-9]\d{9}$/,
      message: '必须是标准格式的手机号码',
      trigger: 'blur',
    },],
  officeLocation: [{ required: true, message: '请输入办公室楼层号', trigger: 'blur' },],
  address: [{ required: true, message: '请写明详细地址', trigger: 'blur' },],
  details: [{ required: true, message: '请描述具体保修内容', trigger: 'blur' },],
})
const fileList = ref([]);

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  if (index !== -1) {
    fileList.value.splice(index, 1);
  }
};

const handleChange = (file, newFileList) => {
  // 更新文件列表
  fileList.value = newFileList;

  // 生成图片预览
  newFileList.forEach((item) => {
    if (!item.url && !item.preview) {
      // 如果没有url和preview，创建一个预览
      const reader = new FileReader();
      reader.onload = (e) => {
        item.preview = e.target.result; // 将预览图像设置为base64
      };
      reader.readAsDataURL(item.raw); // 读取文件作为Data URL
    }
  });
};

const submitFeedback =async () => {
  try{
    await form.value.validate()
  }catch(a){
    alert('请输入正确内容！')
    return 
  }

  sumbitVisible.value=true
};
</script>

<style scoped>
.big-hand{
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: bold;
}
.feedback-container {
  max-width: 600px;
  padding: 20px;
  padding-top: 0px;
}

.uploaded-images {
  margin-top: 20px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
}

.uploaded-image {
  width: 100px; /* 设置图片宽度 */
  height: auto; /* 自适应高度 */
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>