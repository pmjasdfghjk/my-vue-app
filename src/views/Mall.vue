<template>
  <div class="product-management">
    <el-row class="header">
      <el-col :span="8">
        <el-form-item label="搜索商品">
          <el-input
            placeholder="请输入商品名称"
           v-model="searchTerm"
           clearable
           style="flex: 1; margin-right: 8px;"
           />
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="8" class="text-right">
        <el-button type="primary" @click="openAddProductDialog">添加商品</el-button>
      </el-col>
    </el-row>

    <el-table :data="paginatedData" style="width: 100%" stripe>
      <el-table-column type="index" label="页序号" width="250"></el-table-column>
      <el-table-column prop="id" label="商品ID" width="250"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="250"></el-table-column>
      <el-table-column prop="price" label="价格" width="250"></el-table-column>
      <el-table-column prop="stock" label="库存" width="250"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          
            <el-button @click="editProduct(row)"  size="small" type="primary" plain>编辑</el-button>
          <el-button @click="deleteProduct(row.id)" size="small" type="danger" plain>删除</el-button>
          
        </template>
      </el-table-column>
    </el-table>
  <el-pagination
   :current-page="currentPage"
    size="small"
    background
    layout="prev, pager, next"
    :total="filteredProducts.length"
    class="m-4"
    :page-size="pageSize"
    @current-change="handleCurrentChange"

  />

  <el-dialog title="添加商品" v-model="addProductDialogVisible" style="width: 500px;">
  <div class="dialog-content">
    <el-form :model="newProduct" :rules="rules" ref="form">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="newProduct.name" placeholder="请输入商品名称" style="width: 272px;"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="newProduct.price" placeholder="请输入价格" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="newProduct.stock" placeholder="请输入库存" style="width: 300px;"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="closeAdd">取消</el-button>
      <el-button type="primary" @click="addProduct(type)">确定</el-button>
    </div>
  </template>
</el-dialog>
<el-dialog
    v-model="centerDialogVisible"
    title="温馨提示"
    width="30%"
    destroy-on-close
    center
  >
    <span>
      是否要删除该选项？
    </span>
    <div>
      <strong>(删除后无法恢复)</strong>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="daelteMall(productDelteId)">
          确认删除
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, computed,onMounted } from 'vue';
import { getCurrentInstance } from 'vue';
const centerDialogVisible = ref(false)
const form=ref()
const type=ref('')
const rules={
  name:[
  { required: true, message: '请输入商品名称', trigger: 'blur' },
  ],
  price:[
  { required: true, message: '请输入商品价格', trigger: 'blur' },
  { 
      pattern: /^\d+(\.\d+)?$/, // 允许整数或小数
      message: '价格必须是数字', 
      trigger: 'blur' 
    }
  ],
  stock:[ { required: true, message: '请输入库存数量', trigger: 'blur' },
  { 
      pattern: /^\d+$/, // 仅允许整数
      message: '库存数量必须是数字', 
      trigger: 'blur' 
    }
  ]
}
const handleCurrentChange=(page)=>{
  // 改变页码的时候就会出发这个方法，并且page是数字，是具体的页码
  currentPage.value = page;
  
}
const pageSize=ref(10)
const {proxy}=getCurrentInstance()
const fetchProducts=()=>{
  
}
const searchTerm = ref('');
const products = ref([
]);
// 我是搜索功能

const filteredProducts = computed(() => {
  return products.value.filter(product => 
    product.name.includes(searchTerm.value)
  );
});
onMounted(async ()=>{
  const res=await proxy.$api.getMallData()
  products.value=res.mallList
})
const addProductDialogVisible = ref(false);
const closeAdd=()=>{
  
}
const newProduct = ref({
  name: '',
  price: '',
  stock: ''
});

const openAddProductDialog = () => {
  type.value='add'
  addProductDialogVisible.value = true;
  newProduct.value = { name: '', price: '', stock: '' };
};

const addProduct =async (type) => {
  if(type==='add'){
    await form.value.validate()
  const id = Date.now() % 100000; // 取后5位数
  products.value.push({ ...newProduct.value, id });
  addProductDialogVisible.value = false;
  ElMessage({
    message:'添加成功'
  })
  }
  if(type==='edit'){
    await form.value.validate()
    products.value.map((item,index)=>{
      if(item.id===newProduct.value.id){
        item.name=newProduct.value.name
        item.price=newProduct.value.price
        item.stock=newProduct.value.stock
      }
    })
    addProductDialogVisible.value=false
    ElMessage({
      message:'编辑成功',
      type:'success'
    })
  }
};

const editProduct =async (a) => {
  // 编辑商品的逻辑
  type.value='edit'
  addProductDialogVisible.value=true
  newProduct.value.name=a.name
  newProduct.value.price=a.price
  newProduct.value.stock=a.stock
  newProduct.value.id=a.id
  // newProduct.value = { name: '', price: '', stock: '' };
};
const productDelteId=ref()
const deleteProduct = (productId) => {
  // 我是删除功能
  centerDialogVisible.value=true
  productDelteId.value=productId
};

const daelteMall=(productId)=>{
  // 弹出框按钮删除
  products.value = products.value.filter(product => product.id !== productId);
  centerDialogVisible.value=false
  ElMessage({
    message:'删除成功',
    type:'success'
  })
}
const currentPage=ref(1)
const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredProducts.value.slice(start, start + pageSize.value);
    });

</script>

<style scoped>
.product-management {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中输入框 */
}

.dialog-footer {
  display: flex;
  justify-content: space-between; /* 按钮左右对齐 */
  width: 100%; /* 确保按钮占满对话框的宽度 */
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>