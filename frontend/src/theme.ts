import type { ThemeConfig } from 'antd'

// Ant Design dùng ở các trang client-only (đăng bán, tin nhắn, quản trị). Giá trị khớp src/styles/tokens.css.
export const antdTheme: ThemeConfig = {
  cssVar: {},
  token: {
    colorPrimary: '#0041d9', // --color-primary
    colorInfo: '#0041d9',
    colorSuccess: '#0f7b4b', // --color-success
    colorError: '#c4262e', // --color-danger
    colorText: '#121722', // --color-text
    colorBorder: '#dde2eb', // --color-border
    colorBgLayout: '#f4f6fa', // --color-bg
    fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 8,
    borderRadiusLG: 12,
  },
}

// Admin CMS (docs/DESIGN.md mục 2): header + sidebar navy, mục đang chọn nền trắng chữ xanh.
const NAV_BG = '#0b2e6e' // --color-nav-bg

export const adminTheme: ThemeConfig = {
  ...antdTheme,
  components: {
    Layout: { headerBg: NAV_BG, headerHeight: 56, headerPadding: '0 16px', siderBg: NAV_BG, triggerBg: NAV_BG, bodyBg: '#f4f6fa' },
    Menu: {
      darkItemBg: NAV_BG,
      darkSubMenuItemBg: NAV_BG,
      darkPopupBg: NAV_BG,
      darkItemColor: '#c7d4f0', // --color-nav-text
      darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
      darkItemSelectedBg: '#ffffff',
      darkItemSelectedColor: '#0041d9',
      itemBorderRadius: 8,
      itemMarginInline: 8,
    },
    Table: { headerBg: '#f4f6fa' },
  },
}
