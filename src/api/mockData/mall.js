import Mock from 'mockjs';

// 品牌名称数组
const brands = [
  '小米', '华为', '苹果', '联想', '三星', 
  'oppo', 'vivo', '索尼', '一加', 'LG',
  '诺基亚', '谷歌', '锤子', '美的', '华硕', 
  '中兴', '特斯拉', 'Realme'
];

// 商品名称数组
const products = [
  '蓝牙耳机', '头戴式耳机', '手机', '平板', '智能手表', 
  '笔记本电脑', '台式电脑', '平面显示器', '游戏机', '路由器',
  '智能音箱', '投影仪', 'VR头盔', '摄像头', '电子书',
  '智能家居设备', '移动电源'
];

// 生成不重复的五位数ID
const generateUniqueIds = (num) => {
  const ids = new Set();
  while (ids.size < num) {
    const id = Mock.Random.integer(10000, 99999); // 生成五位数随机整数
    ids.add(id);
  }
  return Array.from(ids);
};

const generateProducts = (num) => {
  const ids = generateUniqueIds(num); // 生成不重复的五位数ID
  return Array.from({ length: num }, (_, index) => ({
    id: ids[index], // 使用生成的唯一ID
    name: `${Mock.Random.pick(brands)}${Mock.Random.pick(products)}`, // 随机组合品牌和商品名称
    price: Mock.Random.integer(500, 3000), // 随机价格在50到500之间
    stock: Mock.Random.integer(0, 100),  // 随机库存在0到100之间
  }));
};

export default {
  getMallData: (config) => {
    const mallList = generateProducts(100); // 生成100条商品数据
    return {
      code: 200,
      data: {
        mallList,
        message: '获取商品数据成功'
      }
    };
  }
};