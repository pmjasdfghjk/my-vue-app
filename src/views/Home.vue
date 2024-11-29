<template>
  <!-- gutter是用来设置烈玉烈之间的距离的 -->
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px;">
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user">
          <div class="user-info">
            <p class="user-info-admin">{{ HomeData.username }}</p>
            <p class="uesr-info-p">{{ HomeData.userId }}</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间:
            <span>{{ HomeData.time }}</span>
          </p>
          <p>上次登陆地点：<span>广东省广州市</span></p>
        </div>
      </el-card>
      <!-- 下方拉片 -->
      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData">
          <!-- label表示这一列的列名是什么，prop表示的是这一列的数据在上面的data导入的数据的名字是什么，比如 -->
          <!-- 你在这里的prop是name，那么就会去tableData中找到name的值所以prop要和外边抱着的data里面的值对应 -->
          <el-table-column
          v-for="(val,key) in tableLabel"
          :key="key"
          :prop="key"
          :label="val"
          ></el-table-column>

        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px;">
      <div class="num">
        <el-card 
      :body-style="{display:'flex',padding:0}"
      v-for="item in countData"
      :key="item.name"

      >
      <component :is="item.icon" class="icons" :style="{background:item.color}"></component>
      <div class="detail">
        <p class="num">￥{{ item.value }}</p>
        <p class="txt">￥{{ item.name }}</p>
      </div>
      <!-- 上面这个el-card是上面的留个卡片 -->

      </el-card>
      </div>
             <el-card class="top-echart">
        <div ref="echart" style="height: 280px"></div>
       </el-card>
       <div class="graph">
        <el-card>
          <div ref="userEchart" style="height: 240px;"></div>
        </el-card>
        <el-card>
          <div ref="videoEchart" style="height: 240px;"></div>
        </el-card>
       </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, getCurrentInstance,onMounted,reactive, onRenderTracked } from 'vue';
import * as echarts from 'echarts'
import { useAllDataStore } from '../stores';
const store=useAllDataStore()
const observer=ref(null)
const {proxy}=getCurrentInstance()
const HomeData=ref({
  username:'111',
  userid:'',
  time:''
})

if(JSON.parse(localStorage.getItem('homedata'))){
  HomeData.value=JSON.parse(localStorage.getItem('homedata'))
}else{
  HomeData.value=store.homeData
}

// 获取全局属性
const getTableData=async ()=>{
  const data=await proxy.$api.getTableData()
  tableData.value=data.tableData
}
const getCountData=async ()=>{
  const data=await proxy.$api.getCountData()
  countData.value=data
}
const getChartData=async ()=>{
  const {orderData,userData,videoData}=await proxy.$api.getChartData()
  // 对第一个图表进行x轴和series赋值
  xOptions.xAxis.data=orderData.date
  xOptions.series = Object.keys(orderData.data[0]).map(val => ({
    name: val,
    data: orderData.data.map(item => item[val]),
    // 取出里面名字是【val】的
    type: 'line'
}));
  const oneEchart=echarts.init(proxy.$refs['echart'])
  oneEchart.setOption(xOptions)
  // 对第二个表格进行渲染
  xOptions.xAxis.data=userData.map(item=>item.date)
  xOptions.series=[
    {
      name:'新增用户',
      data:userData.map(item=>item.new),
      type:'bar'

    },
    {
      name:'活跃用户',
      data:userData.map(item=>item.active),
      type:'bar'

    }
  ]
  const twoEchart=echarts.init(proxy.$refs['userEchart'])
  twoEchart.setOption(xOptions)
  // 对第三个饼状图进行渲染
  pieOptions.series=[
    {
      data:videoData,
      type:'pie'
    }
  ]
  const threeEchart=echarts.init(proxy.$refs['videoEchart'])
  threeEchart.setOption(pieOptions)

  // 设置页面监听，使得页面变化时可以完整的展示表格
  observer.value=new ResizeObserver((en)=>{
    oneEchart.resize()
    twoEchart.resize()
    threeEchart.resize()
  })
  if(proxy.$refs['echart']){
    observer.value.observe(proxy.$refs['echart'])
  }
}
//这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      legend: {},
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
})

const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})
onMounted(()=>{
  getTableData()
  getCountData()
  getChartData()
})
const tableData = ref([])
const countData=ref([])
const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})
const getImageUrl=(user)=>{
  return new URL(`../assets/images/${user}.png`,import.meta.url).href
}

</script>

<style scoped lang="less">
.home{
  height: 100%;
  overflow: hidden;
  .user{
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom:20px;
    img{
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .user-info{
      p{
        line-height: 40px;
      }
      .uesr-info-p{
        color:#999;
      }
      .user-info-admin{
        font-size: 35px;
      }

    }
  }
  .login-info{
    p{
      line-height: 30px;
      font-size: 14px;
      color:#999;
      span{
        color:#666;
        margin-left: 60px;
      }
    }
  }
}
.user-table{
  margin-top: 20px;
}
.num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 14px;
        text-align: center;
        color: #999;
      }
    }
  }
  .graph{
    margin-top:20px;
    display:flex;
    justify-content: space-between;
    .el-card{
      width: 48%;
      height: 260px;
    }
  }
</style>