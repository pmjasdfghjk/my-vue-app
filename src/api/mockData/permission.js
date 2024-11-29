import Mock from 'mockjs'
function formatCurrentDate() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日${hours}：${minutes}`;
}

export default {
  getMenu: (config) => {
    const { username, password } = JSON.parse(config.body)
    if (username === 'admin' && password === 'admin') {
      return {
        code: 200,
        data: {
          time:formatCurrentDate(),
          userid:'超级管理员',
          username:'AdminSuper',
          menuList: [
            {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home'
            },
            {
              path: '/mall',
              name: 'mall',
              label: '商品管理',
              icon: 'video-play',
              url: 'Mall'
            },
            {
              path: '/user',
              name: 'user',
              label: '用户管理',
              icon: 'user',
              url: 'User'
            },
            {
              path: 'other',
              label: '其他',
              icon: 'location',
              children: [
                {
                  path: '/page1',
                  name: 'page1',
                  label: '头像修改',
                  icon: 'Setting',
                  url: 'Page1'
                },
                {
                  path: '/page2',
                  name: 'page2',
                  label: '报错反馈',
                  icon: 'WarnTriangleFilled',
                  url: 'Page2'
                },
                {
                  path: '/password',
                  name: 'password',
                  label: '用户中心',
                  icon: 'Edit',
                  url: 'password'
                },
              ]
            }
          ],
          token: Mock.Random.guid(),
          message: '登录成功:超级管理员'
        }
      }
    } else if (username === 'smalluser' && password === 'smalluser') {
      return {
        code: 200,
        data: {
          time:formatCurrentDate(),
          userid:'普通使用者',
          username:'OrdinaryUsers',
          menuList: [
            {
              path: '/home',
              name: 'home',
              label: '首页',
              icon: 'house',
              url: 'Home'
            },
            {
              path: '/mall',
              name: 'mall',
              label: '商品管理',
              icon: 'video-play',
              url: 'Mall'
            },
            {
              path: 'other',
              label: '其他',
              icon: 'location',
              children: [
                {
                  path: '/page2',
                  name: 'page2',
                  label: '报错反馈',
                  icon: 'setting',
                  url: 'Page2'
                }
              ]
            }
          ],
          token: Mock.Random.guid(),
          message: '登录成功，普通用户'
        }
      }
    }else {
      return {
        code: 200,
        data: {
          message: '密码错误'
        }
      }
        
    }

  }
}