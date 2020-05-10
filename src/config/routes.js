/* eslint-disable */

// 工具
import util from '@/libs/util.ice';
import utils from '@/libs/util.js'

// 页面和布局
import Index from '@/pages/Index';
import Login from '@/pages/Login'
import Error404 from '@/pages/Error404';
import Workplace from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import TypeManagement from '@/pages/Admin/TypeManagement/TypeManagement';
import LogManagement from '@/pages/Admin/LogManagement/LogManagement';
import Center from '@/pages/account/Center';
import Settings from '@/pages/account/Settings';
import HeaderAside from '@/layouts/HeaderAside';
import i18n from '@/i18n'

// 如果不指定 name 字段，会根据 path 生成 name = page-demo1
// 转换规则见 util.recursiveRouterConfig 中 path2name 方法
// meta 字段会和默认值使用 Object.assign 合并
// 如果不指定 meta.name 的话，name 字段会使用和上面路由 name 一样的取值逻辑
// 下面两个页面就是对比 你可以分别观察两个页面上显示的路由数据差异

// 变量名 routerConfig 为 iceworks 检测关键字
// ice 会自动在这个变量下添加路由数据
// 请不要修改名称
if(utils.cookies.get('locale')!== undefined && utils.cookies.get('locale') !== null){
  i18n.locale = (utils.cookies.get('locale'))
}
const routerConfig = [{
    path: '/',
    title: 'Home',
    hidden: true,
    component: HeaderAside,
    meta: {
      title: i18n.t('message.router.student.home')
    },
    children: [
      // { path: 'demo2', component: Demo2 },
      // keep the name param
      // { path: 'workplace', component: Workplace, name: 'Workplace' },
      {
        path: '/',
        component: Center,
        name: 'Workplace'
      },
      {
        path: 'profile',
        component: Center,
        name: 'Center',
        meta: {
          title: i18n.t('message.router.student.profile')
        }
      },
      {
        path: 'settings',
        component: Settings,
        name: 'Settings',
        meta: {
          title: i18n.t('message.router.student.settings')
        }
      },
    ],
  },
  {
    path: '/admin',
    title: 'Admin',
    component: HeaderAside,
    children: [
      // keep the name param
      {
        path: 'student',
        title: 'admin',
        component: Admin,
        name: 'Admin',
        meta: {
          title: i18n.t('message.router.admin.student_management')
        }
      },
      {
        path: 'type',
        component: TypeManagement,
        name: 'TypeManagement',
        meta: {
          title: i18n.t('message.router.admin.file_type_management')
        }
      },
      {
        path: 'log',
        component: LogManagement,
        name: 'log',
        meta: {
          title: i18n.t('message.router.admin.log_management')
        }
      },

    ],
  },
  {
    path: '*',
    component: Error404,
    hidden: true
  },
  {
    path: '/index',
    component: Index,
    hidden: true,
    meta: {
      title: i18n.t('message.router.student.home')
    }
  },

];

const routerConfig2 = [

  {
    path: '*',
    component: Error404
  },
  // { path: '/admin', component: Index },
];

// 不参与菜单显示的
// ice 不会处理这部分
// 但是这部分路由也会被注册
// 处理规则同 routerConfig

const routerConfigMenuLogin = [
  // 登录

  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      auth: false,
    },
  },

  // 404
  {
    path: '*',
    component: Error404,
  },
];

// 导出全部路由设置
export default util.recursiveRouterConfig([
  ...routerConfig,
  ...routerConfig2,
  ...routerConfigMenuLogin,
]);

function getFrameInRoutes() {
  const frameInRoutes = [];
  util.recursiveRouterConfig(routerConfig).forEach(e => {
    const {
      path,
      name,
      hidden,
      meta,
      children
    } = e;
    if (children) {
      children.forEach(child => {
        const {
          path,
          name,
          hidden,
          meta
        } = child;
        frameInRoutes.push({
          path,
          name,
          hidden,
          meta
        });
      });
    } else {
      frameInRoutes.push({
        path,
        name,
        hidden,
        meta
      });
    }
  });

  return frameInRoutes;
}

function getFrameInRoutes2() {
  const frameInRoutes = [];
  util.recursiveRouterConfig(routerConfig2).forEach(e => {
    const {
      path,
      name,
      hidden,
      meta,
      children
    } = e;
    if (children) {
      children.forEach(child => {
        const {
          path,
          name,
          hidden,
          meta
        } = child;
        frameInRoutes.push({
          path,
          name,
          hidden,
          meta
        });
      });
    } else {
      frameInRoutes.push({
        path,
        name,
        hidden,
        meta
      });
    }
  });

  return frameInRoutes;
}

// 导出参与多标签页处理的路由设置
// 这个数据会在 main.js 中使用
export const frameInRoutes = getFrameInRoutes();
export const router2 = getFrameInRoutes2();