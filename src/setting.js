import i18n from '@/i18n'
export default {
  // 快捷键
  // 支持快捷键 例如 ctrl+shift+s
  domain: 'http://roguelife.de:888',
  hotkey: {
    search: {
      open: 's',
      close: 'esc'
    }
  },
  // 侧边栏默认折叠状态
  menu: {
    asideCollapse: false
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: 'index',
        fullPath: '/',
        meta: {
          title: 'Home',
          auth: false
        }
      }
    ]
  },
  // 菜单搜索
  search: {
    enable: true
  },
  // 注册的主题
  theme: {
    list: [
      {
        title: i18n.t('message.common.theme1'),
        name: 'd2',
        preview: 'image/theme/d2/preview@2x.png'
      },
      {
        title: i18n.t('message.common.theme2'),
        name: 'violet',
        preview: 'image/theme/violet/preview@2x.png'
      },
      {
        title: i18n.t('message.common.theme3'),
        name: 'line',
        backgroundImage: 'image/theme/line/bg.jpg',
        preview: 'image/theme/line/preview@2x.png'
      },
      {
        title: i18n.t('message.common.theme4'),
        name: 'star',
        backgroundImage: 'image/theme/star/bg.jpg',
        preview: 'image/theme/star/preview@2x.png'
      },
      {
        title: 'Tomorrow Night Blue (vsCode)',
        name: 'tomorrow-night-blue',
        preview: 'image/theme/tomorrow-night-blue/preview@2x.png'
      }
    ]
  },
  // 是否默认开启页面切换动画
  transition: {
    active: true
  }
}
